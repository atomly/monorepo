import ValueObject from '@ddd-framework/core/src/ValueObject';
import { Anemic } from '@ddd-framework/core/src/utils/Anemic';
import EncryptionService, {
  EncryptionKeys
} from '../services/EncryptionService';
import EncryptedValue from '../common/EncryptedValue';

type PublicKey = string;
type SecretKey = EncryptedValue;

export default class ApiKeys extends ValueObject {
  public public: PublicKey;

  public secret: SecretKey;

  constructor(data: Anemic<ApiKeys>) {
    super();
    this.public = data.public;
    this.secret = data.secret;
  }

  public static async generateNewKeys(
    encryptionService: EncryptionService
  ): Promise<[ApiKeys, EncryptionKeys]> {
    const keys = encryptionService.generateEncryptionKeys();

    const secret = await EncryptedValue.encrypt(
      encryptionService,
      keys.publicKey,
      keys.secretKey
    );

    return [new ApiKeys({ public: keys.publicKey, secret }), keys];
  }

  static Null = new ApiKeys({
    public: '',
    secret: EncryptedValue.Null
  });
}
