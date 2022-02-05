import { generateKeyPair, encrypt, decrypt, Encrypted } from 'eccrypto-js';
import EncryptedValue from '../../../core/domain/common/EncryptedValue';
import EncryptionService, {
  EncryptionKeys
} from '../../../core/domain/services/EncryptionService';

type RawEncrypted = {
  ciphertext: string;
  ephemPublicKey: string;
  iv: string;
  mac: string;
};

export class EcCryptoJsEncryptionService extends EncryptionService {
  public generateEncryptionKeys(): EncryptionKeys {
    const { publicKey, privateKey } = generateKeyPair();

    return {
      publicKey: new EncryptedValue(
        publicKey.toString(EcCryptoJsEncryptionService.keyBufferEncoding)
      ),
      secretKey: new EncryptedValue(
        privateKey.toString(EcCryptoJsEncryptionService.keyBufferEncoding)
      )
    };
  }

  public async encrypt(
    dataToEncrypt: string,
    aPublicOrSecretKey: string
  ): Promise<string> {
    const keyBuffer = Buffer.from(
      aPublicOrSecretKey,
      EcCryptoJsEncryptionService.keyBufferEncoding
    );

    const dataBuffer = Buffer.from(
      dataToEncrypt,
      EcCryptoJsEncryptionService.dataBufferEncoding
    );

    const encryptedData: Encrypted = await encrypt(keyBuffer, dataBuffer);

    const rawEncryptedData: RawEncrypted =
      EcCryptoJsEncryptionService.encryptedToRaw(encryptedData);

    return JSON.stringify(rawEncryptedData);
  }

  public async decrypt(
    rawEncryptedDataToDecrypt: string,
    aSecretKey: string
  ): Promise<string> {
    const secretKeyBuffer = Buffer.from(
      aSecretKey,
      EcCryptoJsEncryptionService.keyBufferEncoding
    );

    const dataToDecrypt = EcCryptoJsEncryptionService.rawToEncrypted(
      rawEncryptedDataToDecrypt
    );

    const decryptData = await decrypt(secretKeyBuffer, dataToDecrypt);

    return decryptData.toString(EcCryptoJsEncryptionService.dataBufferEncoding);
  }

  private static keyBufferEncoding: BufferEncoding = 'base64';

  private static dataBufferEncoding: BufferEncoding = 'utf-8';

  private static encryptedBufferEncoding: BufferEncoding = 'hex';

  private static encryptedToRaw(encrypted: Encrypted): RawEncrypted {
    const rawEncryptedData: RawEncrypted = {
      ciphertext: encrypted.ciphertext.toString(this.encryptedBufferEncoding),
      ephemPublicKey: encrypted.ephemPublicKey.toString(
        this.encryptedBufferEncoding
      ),
      iv: encrypted.iv.toString(this.encryptedBufferEncoding),
      mac: encrypted.mac.toString(this.encryptedBufferEncoding)
    };

    return rawEncryptedData;
  }

  private static rawToEncrypted(raw: string): Encrypted {
    const rawEncryptedData: RawEncrypted = JSON.parse(raw);

    const encryptedData: Encrypted = {
      ciphertext: Buffer.from(
        rawEncryptedData.ciphertext,
        this.encryptedBufferEncoding
      ),
      ephemPublicKey: Buffer.from(
        rawEncryptedData.ephemPublicKey,
        this.encryptedBufferEncoding
      ),
      iv: Buffer.from(rawEncryptedData.iv, this.encryptedBufferEncoding),
      mac: Buffer.from(rawEncryptedData.mac, this.encryptedBufferEncoding)
    };

    return encryptedData;
  }
}
