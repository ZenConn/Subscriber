import crypto from "crypto";

export class Encrypt {
    static make(secret: string, data: string) : string {
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(data);
        return hmac.digest('hex').toString();
    }
}