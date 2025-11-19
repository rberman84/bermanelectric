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

  private async sendCommand(conn: Deno.TlsConn, command: string): Promise<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    await conn.write(encoder.encode(command + "\r\n"));
    
    const buffer = new Uint8Array(4096);
    const n = await conn.read(buffer);
    if (n === null) throw new Error("Connection closed");
    
    return decoder.decode(buffer.subarray(0, n));
  }

  async send(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    let conn: Deno.TlsConn | null = null;
    
    try {
      const toAddresses = Array.isArray(options.to) ? options.to : [options.to];
      
      console.log(`Connecting to SMTP server: ${this.config.host}:${this.config.port}`);
      
      // Connect with TLS directly (port 465) or STARTTLS (port 587)
      if (this.config.port === 465) {
        // Direct TLS connection
        conn = await Deno.connectTls({
          hostname: this.config.host,
          port: this.config.port,
        });
      } else {
        // STARTTLS for port 587
        const plainConn = await Deno.connect({
          hostname: this.config.host,
          port: this.config.port,
        });

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        // Read greeting
        const greetingBuf = new Uint8Array(1024);
        await plainConn.read(greetingBuf);
        
        // Send EHLO
        await plainConn.write(encoder.encode(`EHLO ${this.config.host}\r\n`));
        const ehloBuf = new Uint8Array(1024);
        await plainConn.read(ehloBuf);
        
        // Send STARTTLS
        await plainConn.write(encoder.encode("STARTTLS\r\n"));
        const starttlsBuf = new Uint8Array(1024);
        await plainConn.read(starttlsBuf);
        
        // Upgrade to TLS
        conn = await Deno.startTls(plainConn, { hostname: this.config.host });
      }

      // Send EHLO after TLS
      await this.sendCommand(conn, `EHLO ${this.config.host}`);
      
      // Authenticate
      await this.sendCommand(conn, "AUTH LOGIN");
      await this.sendCommand(conn, btoa(this.config.username));
      const authResponse = await this.sendCommand(conn, btoa(this.config.password));
      
      if (!authResponse.includes("235")) {
        throw new Error(`Authentication failed: ${authResponse}`);
      }

      // Send emails
      for (const to of toAddresses) {
        await this.sendCommand(conn, `MAIL FROM:<${options.from}>`);
        await this.sendCommand(conn, `RCPT TO:<${to}>`);
        await this.sendCommand(conn, "DATA");

        // Build message
        const message = [
          `From: ${options.from}`,
          `To: ${to}`,
          `Subject: ${options.subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          options.replyTo ? `Reply-To: ${options.replyTo}` : null,
          "",
          options.html,
        ].filter(Boolean).join("\r\n");

        await this.sendCommand(conn, message + "\r\n.");
        
        console.log(`Email sent successfully to ${to}`);
      }

      await this.sendCommand(conn, "QUIT");
      conn.close();

      return { success: true };
    } catch (error: any) {
      console.error("SMTP Error:", error);
      if (conn) {
        try {
          conn.close();
        } catch (e) {
          // Ignore close errors
        }
      }
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
    throw new Error("SMTP configuration missing. Please set HOSTINGER_SMTP_HOST, HOSTINGER_SMTP_USER, and HOSTINGER_SMTP_PASSWORD");
  }

  console.log(`SMTP configured: ${config.host}:${config.port} (user: ${config.username})`);

  return new SmtpEmailSender(config);
}
