/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MONGODB_URI: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}