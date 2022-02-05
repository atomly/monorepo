import ValueObject from 'ddd-framework-core/src/ValueObject';
import EncryptionService from '../services/EncryptionService';

export default class EncryptedValue extends ValueObject {
  public value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  public static async fromRawData(
    encryptionService: EncryptionService,
    data: string,
    publicKey: string
  ): Promise<EncryptedValue> {
    const encryptedData = await encryptionService.encrypt(data, publicKey);

    return new EncryptedValue(encryptedData);
  }

  public static async toRawData(
    encryptionService: EncryptionService,
    { value }: EncryptedValue,
    secretKey: string
  ): Promise<string> {
    const encryptedData = await encryptionService.decrypt(value, secretKey);

    return encryptedData;
  }

  public static Null = new EncryptedValue('');
}
