import {
  generateKeyPair,
  encrypt,
  decrypt,
  Encrypted as EncryptedData
} from 'eccrypto-js';
import EncryptedValue from '../../../core/domain/common/EncryptedValue';
import EncryptionService, {
  EncryptionKeys
} from '../../../core/domain/services/EncryptionService';

export type SerializedEncryptedData = {
  ciphertext: string;
  ephemPublicKey: string;
  iv: string;
  mac: string;
};

export default class EcCryptoJsEncryptionService extends EncryptionService {
  public generateEncryptionKeys(): EncryptionKeys {
    const { publicKey, privateKey } = generateKeyPair();

    return {
      publicKey: publicKey.toString(
        EcCryptoJsEncryptionService.keyBufferEncoding
      ),
      secretKey: privateKey.toString(
        EcCryptoJsEncryptionService.keyBufferEncoding
      )
    };
  }

  public async encrypt(
    dataToEncrypt: string,
    aPublicKey: string
  ): Promise<EncryptedValue> {
    const publicKeyBuffer = Buffer.from(
      aPublicKey,
      EcCryptoJsEncryptionService.keyBufferEncoding
    );

    const dataBuffer = Buffer.from(
      dataToEncrypt,
      EcCryptoJsEncryptionService.dataBufferEncoding
    );

    const encryptedData: EncryptedData = await encrypt(
      publicKeyBuffer,
      dataBuffer
    );

    const serializedEncryptedData: SerializedEncryptedData =
      EcCryptoJsEncryptionService.serializeEncryptedData(encryptedData);

    return new EncryptedValue(JSON.stringify(serializedEncryptedData));
  }

  public async decrypt(
    dataToDecrypt: EncryptedValue,
    aSecretKey: string
  ): Promise<string> {
    const secretKeyBuffer = Buffer.from(
      aSecretKey,
      EcCryptoJsEncryptionService.keyBufferEncoding
    );

    const encryptedData: EncryptedData =
      EcCryptoJsEncryptionService.parseEncryptedValue(dataToDecrypt);

    const decryptedData: Buffer = await decrypt(secretKeyBuffer, encryptedData);

    return decryptedData.toString(
      EcCryptoJsEncryptionService.dataBufferEncoding
    );
  }

  public static isSerializedEncryptedData(
    data: Record<PropertyKey, unknown>
  ): data is SerializedEncryptedData {
    return (
      typeof data.ciphertext === 'string' &&
      typeof data.ephemPublicKey === 'string' &&
      typeof data.iv === 'string' &&
      typeof data.mac === 'string'
    );
  }

  private static keyBufferEncoding: BufferEncoding = 'base64';

  private static dataBufferEncoding: BufferEncoding = 'utf-8';

  private static encryptedBufferEncoding: BufferEncoding = 'hex';

  private static serializeEncryptedData(
    encrypted: EncryptedData
  ): SerializedEncryptedData {
    const rawEncryptedData: SerializedEncryptedData = {
      ciphertext: encrypted.ciphertext.toString(this.encryptedBufferEncoding),
      ephemPublicKey: encrypted.ephemPublicKey.toString(
        this.encryptedBufferEncoding
      ),
      iv: encrypted.iv.toString(this.encryptedBufferEncoding),
      mac: encrypted.mac.toString(this.encryptedBufferEncoding)
    };

    return rawEncryptedData;
  }

  private static parseEncryptedValue(
    encryptedValue: EncryptedValue
  ): EncryptedData {
    const rawEncryptedData: SerializedEncryptedData = JSON.parse(
      encryptedValue.value
    );

    const encryptedData: EncryptedData = {
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
