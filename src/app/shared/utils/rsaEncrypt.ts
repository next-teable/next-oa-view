import { Injectable } from '@angular/core';
import JSEncrypt from 'jsencrypt/bin/jsencrypt';

@Injectable()
export class RSAEncrypt {
  constructor() { }

  publicKey =
    'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n' +
    '2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ==';

  encrypted(text) {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(this.publicKey); // 设置公钥
    return encryptor.encrypt(text);
  }
}
