interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export class SmtpEmailSender {
  private config: SmtpConfig;

  constructor(config: SmtpConfig) {
    this.config = config;
  }

  async send(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const toAddresses = Array.isArray(options.to) ? options.to : [options.to];
      
      for (const to of toAddresses) {
        const conn = await Deno.connect({
          hostname: this.config.host,
          port: this.config.port,
        });

        const textEncoder = new TextEncoder();
        const textDecoder = new TextDecoder();

        // Helper to read response
        const readResponse = async () => {
          const buffer = new Uint8Array(1024);
          const n = await conn.read(buffer);
          if (n === null) throw new Error("Connection closed");
          return textDecoder.decode(buffer.subarray(0, n));
        };

        // Helper to send command
        const sendCommand = async (command: string) => {
          await conn.write(textEncoder.encode(command + "\r\n"));
          return await readResponse();
        };

        // SMTP conversation
        await readResponse(); // Read server greeting
        await sendCommand(`EHLO ${this.config.host}`);
        await sendCommand("STARTTLS");

        // Upgrade to TLS
        const tlsConn = await Deno.startTls(conn, { hostname: this.config.host });

        const tlsReadResponse = async () => {
          const buffer = new Uint8Array(1024);
          const n = await tlsConn.read(buffer);
          if (n === null) throw new Error("Connection closed");
          return textDecoder.decode(buffer.subarray(0, n));
        };

        const tlsSendCommand = async (command: string) => {
          await tlsConn.write(textEncoder.encode(command + "\r\n"));
          return await tlsReadResponse();
        };

        await tlsSendCommand(`EHLO ${this.config.host}`);
        await tlsSendCommand("AUTH LOGIN");
        await tlsSendCommand(btoa(this.config.username));
        await tlsSendCommand(btoa(this.config.password));
        await tlsSendCommand(`MAIL FROM:<${options.from}>`);
        await tlsSendCommand(`RCPT TO:<${to}>`);
        await tlsSendCommand("DATA");

        // Build email message
        const message = [
          `From: ${options.from}`,
          `To: ${to}`,
          `Subject: ${options.subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          options.replyTo ? `Reply-To: ${options.replyTo}` : null,
          "",
          options.html,
          ".",
        ].filter(Boolean).join("\r\n");

        await tlsSendCommand(message);
        await tlsSendCommand("QUIT");

        tlsConn.close();
      }

      return { success: true };
    } catch (error: any) {
      console.error("SMTP Error:", error);
      return { success: false, error: error.message };
    }
  }
}

export function getSmtpSender(): SmtpEmailSender {
  const config: SmtpConfig = {
    host: Deno.env.get("HOSTINGER_SMTP_HOST") || "",
    port: parseInt(Deno.env.get("HOSTINGER_SMTP_PORT") || "587"),
    username: Deno.env.get("HOSTINGER_SMTP_USER") || "",
    password: Deno.env.get("HOSTINGER_SMTP_PASSWORD") || "",
  };

  if (!config.host || !config.username || !config.password) {
    throw new Error("SMTP configuration missing");
  }

  return new SmtpEmailSender(config);
}
