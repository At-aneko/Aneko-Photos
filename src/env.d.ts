/// <reference types="astro/client" />

type R2Object = {
  body: ReadableStream | null
  writeHttpMetadata(headers: Headers): void
  httpEtag: string
}

type R2Bucket = {
  get(key: string): Promise<R2Object | null>
}

type KVNamespace = {
  get(key: string): Promise<string | null>
}

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        KV: KVNamespace
        R2: R2Bucket
      }
    }
  }
}
