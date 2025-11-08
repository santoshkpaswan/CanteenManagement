import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private secretKey = 'ASDFASD2341234@@#!@POYUIOYUI'; // ⚠️ store safely, not hardcoded for real apps

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(cipherText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  }
}
