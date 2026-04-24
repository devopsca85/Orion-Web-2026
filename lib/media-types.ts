export interface MediaFile {
  name: string
  path: string       // public URL: /assets/images/...
  folder: string     // relative folder within images dir
  ext: string
  size: number       // bytes
  uploadedAt: string // ISO string from mtime
}
