export default function toTitleCase(str: string): string {
  return str
    .toLowerCase() // Convert the entire string to lowercase first
    .split(' ') // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first character of each word
    .join(' '); // Join the words back into a single string
}
