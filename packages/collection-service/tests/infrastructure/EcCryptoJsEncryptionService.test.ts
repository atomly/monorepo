import faker from '@faker-js/faker';
import EncryptedValue from '../../src/core/domain/common/EncryptedValue';
import EcCryptoJsEncryptionService from '../../src/infrastructure/adapters/secondary/EcCryptoJsEncryptionService';

describe('EcCryptoJsEncryptionService', () => {
  const encryptionService = new EcCryptoJsEncryptionService();

  test('generateEncryptionKeys', () => {
    const { publicKey, secretKey } = encryptionService.generateEncryptionKeys();

    expect(typeof publicKey).toBe('string');
    expect(publicKey).toBeTruthy();

    expect(typeof secretKey).toBe('string');
    expect(secretKey).toBeTruthy();
  });

  describe('encryption and decryption', () => {
    const dataToEncrypt = faker.internet.password(undefined, true);
    const { publicKey, secretKey } = encryptionService.generateEncryptionKeys();

    test('encrypting with public key succeeds', async () => {
      const encryptedValue = await encryptionService.encrypt(
        dataToEncrypt,
        publicKey
      );
      expect(encryptedValue).toBeInstanceOf(EncryptedValue);
      expect(encryptedValue).toBeInstanceOf(EncryptedValue);
      expect(encryptedValue.value).toBeTruthy();
      expect(typeof encryptedValue.value).toBe('string');
      expect(typeof JSON.parse(encryptedValue.value)).toBe('object');
      expect(
        EcCryptoJsEncryptionService.isSerializedEncryptedData(
          JSON.parse(encryptedValue.value)
        )
      ).toBe(true);
    });

    test('encrypting with secret key fails', async () => {
      await expect(
        encryptionService.encrypt(dataToEncrypt, secretKey)
      ).rejects.toThrow();
    });

    test('decrypting with public key fails', async () => {
      const value = await encryptionService.encrypt(dataToEncrypt, publicKey);
      await expect(
        encryptionService.decrypt(value, publicKey)
      ).rejects.toThrow();
    });

    test('decrypting with random value fails', async () => {
      const value = await encryptionService.encrypt(dataToEncrypt, publicKey);
      await expect(
        encryptionService.decrypt(value, faker.internet.password())
      ).rejects.toThrow();
    });

    test('decrypting with secret key succeeds', async () => {
      const value = await encryptionService.encrypt(dataToEncrypt, publicKey);
      const decryptedData = await encryptionService.decrypt(value, secretKey);
      expect(decryptedData).toBe(dataToEncrypt);
    });
  });
});
