/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  // add more env variables here if needed
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
