import base64ToBlob from './Base64ToBlob';

export default function base64ToFile(base64: string, filename: string, mimeType = ''): File {
  const blob = base64ToBlob(base64, mimeType);
  return new File([blob], filename, { type: mimeType });
}
