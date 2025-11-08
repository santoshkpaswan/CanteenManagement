import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';

@Injectable({ providedIn: 'root' })
export class SecureStorageService {

  constructor(private enc: EncryptionService) {}

  setItem(key: string, value: any): void {
    const plain = JSON.stringify(value);
    const encrypted = this.enc.encrypt(plain);
    localStorage.setItem(key, encrypted);
  }

  getItem<T>(key: string): T | null {
    const cipherText = localStorage.getItem(key);
    if (!cipherText) return null;
    const decrypted = this.enc.decrypt(cipherText);
    try {
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
