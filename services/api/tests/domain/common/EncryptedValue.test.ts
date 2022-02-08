import faker from '@faker-js/faker';
import EncryptedValue from '../../../src/core/domain/common/EncryptedValue';
import EcCryptoJsEncryptionService from '../../../src/infrastructure/adapters/secondary/EcCryptoJsEncryptionService';

describe('EncryptedValue', () => {
  const encryptionService = new EcCryptoJsEncryptionService();

  describe('[EcCryptoJsEncryptionService] encryption and decryption', () => {
    const dataToEncrypt = faker.internet.password(undefined, true);
    const { publicKey, secretKey } = encryptionService.generateEncryptionKeys();

    test('static encrypt', async () => {
      const encryptedValue = await EncryptedValue.encrypt(
        encryptionService,
        publicKey,
        dataToEncrypt
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

    test('encrypt', async () => {
      const encryptedValue = new EncryptedValue('');

      await encryptedValue.encrypt(encryptionService, publicKey, dataToEncrypt);

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

    test('decrypt', async () => {
      const encryptedValue = await EncryptedValue.encrypt(
        encryptionService,
        publicKey,
        dataToEncrypt
      );

      const decryptedData = await encryptedValue.decrypt(
        encryptionService,
        secretKey
      );

      expect(decryptedData).toBe(dataToEncrypt);
    });
  });
});
