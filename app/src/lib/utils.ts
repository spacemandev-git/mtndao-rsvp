export function truncateAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export async function uuidToEmojis(uuid: string) {
  const emojiBase = 0x1f600; // Starting from 😀 (grinning face)
  const emojiRange = 80; // Limit to common emoji range

  // Hash the UUID using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(uuid);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Pick 4 values from the hash to map to emojis
  return hashArray
    .slice(0, 4) // Take the first 4 bytes
    .map((byte) => String.fromCodePoint(emojiBase + (byte % emojiRange))) // Map to emoji range
    .join("");
}
