import EncryptedValue from '../common/EncryptedValue';

export type EncryptionKeys = {
  publicKey: string;
  secretKey: string;
};

export default abstract class EncryptionService {
  public abstract generateEncryptionKeys(): EncryptionKeys;

  public abstract encrypt(
    dataToEncrypt: string,
    aPublicKey: string
  ): PromiseLike<EncryptedValue>;

  public abstract decrypt(
    dataToDecrypt: EncryptedValue,
    aSecretKey: string
  ): PromiseLike<string>;
}
