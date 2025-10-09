/// <reference types="vite/client" />

declare global {
  interface Window {
    __CSP_NONCE__?: string;
  }
}

export {};
