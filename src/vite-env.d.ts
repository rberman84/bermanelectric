/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRACKING_NUMBERS?: string;
  readonly VITE_BOOKING_LINK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
