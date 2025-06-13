export class SecureDecoder {
    constructor(secretKey = "your_secret_key_2025") {
        this.secretKey = secretKey;
    }

    // Tạo salt giống như Python
    _generateSalt(timestamp) {
        const combined = `${timestamp}_${this.secretKey}`;
        return this._sha256(combined).substring(0, 16);
    }

    // SHA256 implementation cho JavaScript
    _sha256(str) {
        // Simple SHA256 implementation
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    // Cho browser (không có crypto module)
    async _sha256Browser(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // XOR decrypt
    _xorDecrypt(data, key) {
        let result = [];
        const keyLen = key.length;
        
        for (let i = 0; i < data.length; i++) {
            const keyChar = key[i % keyLen];
            const decryptedChar = String.fromCharCode(data.charCodeAt(i) ^ keyChar.charCodeAt(0));
            result.push(decryptedChar);
        }
        
        return result.join('');
    }

    // Unscramble - ngược lại của Python
    _unscrambleString(s, seed) {
        let chars = s.split('');
        const length = chars.length;
        
        if (length < 4) {
            return s;
        }
        
        // Cùng pattern swap như Python nhưng ngược lại
        const swaps = [
            [seed % length, (seed * 2) % length],
            [(seed * 3) % length, (seed * 5) % length],
            [(seed * 7) % length, (seed * 11) % length]
        ];
        
        // Làm ngược lại - reverse order
        for (let k = swaps.length - 1; k >= 0; k--) {
            const [i, j] = swaps[k];
            if (i !== j) {
                [chars[i], chars[j]] = [chars[j], chars[i]];
            }
        }
        
        return chars.join('');
    }

    // MD5 đơn giản (hoặc dùng thư viện)
    _md5(str) {
        // Tạm thời dùng hash đơn giản, thực tế nên dùng crypto library
        let hash = 0;
        if (str.length === 0) return hash.toString(16).padStart(8, '0');
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);
    }

    // Base64 decode
    _base64Decode(str) {
        if (typeof atob !== 'undefined') {
            return atob(str);
        } else {
            // Node.js
            return Buffer.from(str, 'base64').toString('utf-8');
        }
    }

    // Decode ra dữ liệu gốc
    decode(encodedData) {
        // Base64 decode lần 1
        const step1 = this._base64Decode(encodedData);
        
        // Unscramble với seed từ secret key
        const seed = this.secretKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 1000;
        const unscrambled = this._unscrambleString(step1, seed);
        
        // Base64 decode lần 2
        const step3 = this._base64Decode(unscrambled);
        
        // XOR decrypt với secret key
        const decrypted = this._xorDecrypt(step3, this.secretKey);
        
        // Tách data và checksum
        const parts = decrypted.split('|');
        const data = parts[0];
        
        return data; // Trả về dữ liệu gốc
    }

    // Get salt (handle both browser and Node.js)
    async _getSalt(timestamp) {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
            // Browser environment
            return (await this._sha256Browser(`${timestamp}_${this.secretKey}`)).substring(0, 16);
        } else {
            // Node.js environment
            return this._generateSalt(timestamp);
        }
    }
}