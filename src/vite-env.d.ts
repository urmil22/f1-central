/// <reference types="vite/client" />

// Augments the ImportMetaEnv that vite/client declares.
interface ImportMetaEnv {
  /** Overrides the F1 API origin — defaults to the public Jolpica mirror. */
  readonly VITE_F1_API_URL?: string;
}
