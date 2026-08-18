/**
 * Motor Criptográfico de Cúpula y Seguridad Soberana
 * Regla 5: Encriptación AES-256-GCM y Copia de Seguridad Cifrada
 * Regla 10: Hasheo seguro de contraseñas con PBKDF2 y Salt
 * Regla 12: Desafíos Proof-of-Work Anti-Bot
 */

// Utilidades Web Crypto API nativas (Compatibles con Edge, Node 18+ y Navegadores modernos)
export class CryptoEngine {
  /**
   * Hasheo criptográfico SHA-256
   */
  static async sha256(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hasheo seguro de contraseñas mediante PBKDF2 con 100,000 iteraciones y Salt criptográfico (Regla 10)
   */
  static async hashPassword(password: string, customSalt?: string): Promise<{ hash: string; salt: string }> {
    const salt = customSalt || Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const exported = await crypto.subtle.exportKey('raw', derivedKey);
    const hashHex = Array.from(new Uint8Array(exported))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    return { hash: hashHex, salt };
  }

  /**
   * Verifica una contraseña contra su hash y salt
   */
  static async verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
    const { hash } = await this.hashPassword(password, salt);
    return hash === expectedHash;
  }

  /**
   * Cifrado simétrico AES-256-GCM para datos sensibles (Regla 5)
   */
  static async encryptAES256(plaintext: string, secretKeyHex: string): Promise<{ ciphertext: string; iv: string }> {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV para GCM
    
    // Derivar clave de 256 bits
    const keyBuffer = enc.encode(secretKeyHex.padEnd(32, '0').slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      enc.encode(plaintext)
    );

    const ciphertext = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');

    return { ciphertext, iv: ivHex };
  }

  /**
   * Descifrado AES-256-GCM
   */
  static async decryptAES256(ciphertext: string, ivHex: string, secretKeyHex: string): Promise<string> {
    const enc = new TextEncoder();
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const keyBuffer = enc.encode(secretKeyHex.padEnd(32, '0').slice(0, 32));

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const binaryString = atob(ciphertext);
    const encryptedBytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      encryptedBytes[i] = binaryString.charCodeAt(i);
    }

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encryptedBytes
    );

    return new TextDecoder().decode(decrypted);
  }

  /**
   * Generación y Verificación de Copia de Seguridad Cifrada (Regla 5)
   */
  static async generateEncryptedBackup(data: Record<string, any>, backupPassword?: string): Promise<{
    backupPayload: string;
    checksumSHA256: string;
    timestamp: string;
    version: string;
  }> {
    const rawJson = JSON.stringify(data);
    const checksum = await this.sha256(rawJson);
    const key = backupPassword || 'REYPLACE-BACKUP-AES256-ENCRYPTION-KEY-2026';
    const { ciphertext, iv } = await this.encryptAES256(rawJson, key);

    const envelope = {
      version: 'REY-BACKUP-V3',
      timestamp: new Date().toISOString(),
      checksum,
      iv,
      payload: ciphertext,
    };

    return {
      backupPayload: btoa(JSON.stringify(envelope)),
      checksumSHA256: checksum,
      timestamp: envelope.timestamp,
      version: envelope.version,
    };
  }

  /**
   * Genera un desafío Proof-of-Work criptográfico Anti-Bot (Regla 12)
   */
  static async solveProofOfWork(challenge: string, difficulty: number = 3): Promise<{ nonce: number; hash: string }> {
    let nonce = 0;
    const targetPrefix = '0'.repeat(difficulty);
    
    while (true) {
      const candidate = `${challenge}:${nonce}`;
      const hash = await this.sha256(candidate);
      if (hash.startsWith(targetPrefix)) {
        return { nonce, hash };
      }
      nonce++;
      if (nonce > 1000000) break; // Safeguard
    }
    return { nonce: 0, hash: '' };
  }
}
