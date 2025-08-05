export interface FileData {
  base64: string; // Base64-encoded file content
  name: string; // File name
  type: string; // MIME type (e.g., image/png)
  size: number; // File size in bytes
}
