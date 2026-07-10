import { mkdir, writeFile } from 'node:fs/promises'

const distUrl = new URL('../dist/', import.meta.url)
const assetsIgnoreUrl = new URL('.assetsignore', distUrl)

await mkdir(distUrl, { recursive: true })
await writeFile(assetsIgnoreUrl, '_worker.js\n')
