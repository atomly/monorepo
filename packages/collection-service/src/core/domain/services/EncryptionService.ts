import EncryptedValue from '../common/EncryptedValue';

export type EncryptionKeys = {
  publicKey: EncryptedValue;
  secretKey: EncryptedValue;
};

export default abstract class EncryptionService {
  public abstract generateEncryptionKeys(): EncryptionKeys;

  public abstract encrypt(
    dataToEncrypt: string,
    aPublicOrSecretKey: string
  ): PromiseLike<string>;

  public abstract decrypt(
    dataToDecrypt: string,
    aSecretKey: string
  ): PromiseLike<string>;
}
