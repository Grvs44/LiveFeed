// Adapted from https://vitejs.dev/guide/env-and-mode.html
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'shaka-player' {
  export = shaka;
}

declare module 'shaka-player/dist/shaka-player.compiled' {
  export = shaka;
}
