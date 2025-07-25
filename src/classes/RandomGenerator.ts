import crypto from "crypto";

export class RandomGenerator {
  static generateKey(): Buffer {
    return crypto.randomBytes(32);
  }

  static generateHMAC(key: Buffer, message: number): string {
    const msgBuffer = Buffer.alloc(4);
    msgBuffer.writeUInt32BE(message, 0);
    const hmac = crypto.createHmac("sha3-256", key);
    hmac.update(msgBuffer);
    return hmac.digest("hex").toUpperCase();
  }
}
