/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_HOST?: string;
}

interface ImportMeta {
    meta: ImportMetaEnv;
}