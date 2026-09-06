export type ImageInfo = { width: number; height: number; format: "jpeg" | "png" | "webp" | "gif" };

/**
 * Reads the pixel size and real format from the first bytes of a file.
 * Detection is content-based, so a renamed file cannot lie about its type.
 * Supports the four formats the admin accepts; returns null for anything else.
 */
export function readImageInfo(buffer: Buffer): ImageInfo | null {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0x89 && buffer.toString("ascii", 1, 4) === "PNG") {
    if (buffer.length < 24) return null;
    return { format: "png", width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.toString("ascii", 0, 3) === "GIF") {
    return { format: "gif", width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return readWebp(buffer);
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return readJpeg(buffer);
  }
  return null;
}

function readWebp(buffer: Buffer): ImageInfo | null {
  if (buffer.length < 30) return null;
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return { format: "webp", width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  }
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { format: "webp", width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8 ") {
    return { format: "webp", width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  return null;
}

// Walks the JPEG segments until the first "start of frame" marker, which
// carries the image dimensions.
function readJpeg(buffer: Buffer): ImageInfo | null {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];

    if (marker === 0xff) {
      offset += 1; // fill byte
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      offset += 2; // standalone marker without a length field
      continue;
    }
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isStartOfFrame) {
      return { format: "jpeg", height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) return null;
    offset += 2 + length;
  }
  return null;
}
