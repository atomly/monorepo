import ValueObject from '@ddd-framework/core/src/ValueObject';
import EncryptionService from '../services/EncryptionService';

export default class EncryptedValue extends ValueObject {
  public value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  public async decrypt(
    encryptionService: EncryptionService,
    secretKey: string
  ): Promise<string> {
    const encryptedData = await encryptionService.decrypt(this, secretKey);

    return encryptedData;
  }

  public async encrypt(
    encryptionService: EncryptionService,
    publicKey: string,
    data: string
  ): Promise<void> {
    const encryptedValue = await encryptionService.encrypt(data, publicKey);

    this.value = encryptedValue.value;
  }

  public static async encrypt(
    encryptionService: EncryptionService,
    publicKey: string,
    data: string
  ): Promise<EncryptedValue> {
    const encryptedValue = await encryptionService.encrypt(data, publicKey);

    return encryptedValue;
  }

  public static Null = new EncryptedValue('');
}
