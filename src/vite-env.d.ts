/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly N8N_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
