import crypto from "crypto";

export class RandomGenerator {
  static generateKey(): Buffer {
    return crypto.randomBytes(32);
  }

  static generateSecureInt(range: number): number {
    if (range <= 0 || range > 256) {
      throw new Error("range must be between 1 and 256.");
    }

    const maxValue = 256;
    const limit = Math.floor(maxValue / range) * range;

    let randomByte: number;

    do {
      const buf = crypto.randomBytes(1);
      randomByte = buf[0];
    } while (randomByte >= limit);

    return randomByte % range;
  }

  static generateHMAC(key: Buffer, message: number): string {
    const msgBuffer = Buffer.alloc(4);
    msgBuffer.writeUInt32BE(message, 0);
    const hmac = crypto.createHmac("sha3-256", key);
    hmac.update(msgBuffer);
    return hmac.digest("hex").toUpperCase();
  }
}
