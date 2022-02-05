import ValueObject from 'ddd-framework-core/src/ValueObject';
import { Anemic } from 'ddd-framework-core/src/utils/Anemic';
import EncryptionService from '../services/EncryptionService';
import EncryptedValue from '../common/EncryptedValue';

type SecretKey = EncryptedValue | string | null;

export class ApiKeys<Secret extends SecretKey = null> extends ValueObject {
  public public: EncryptedValue;

  public secret: Secret;

  constructor(data: Anemic<ApiKeys<SecretKey>>) {
    super();
    this.public = data.public;
    this.secret = data.secret as Secret;
  }

  public static generateNewKeys(
    encryptionService: EncryptionService
  ): ApiKeys<string> {
    const { publicKey, secretKey } = encryptionService.generateEncryptionKeys();

    return new ApiKeys({ public: publicKey, secret: secretKey });
  }

  static Null = new ApiKeys({
    public: EncryptedValue.Null,
    secret: EncryptedValue.Null
  });
}
