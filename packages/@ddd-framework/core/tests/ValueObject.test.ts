import CurrencyDetails from './mocks/CurrencyDetails';
import CurrencyMismatchException from './mocks/CurrencyMismatchException';
import Money from './mocks/Money';

const usd = new CurrencyDetails('USD', '$', 2, true);

const euro = new CurrencyDetails('EUR', '€', 2, true);

const fiveDollars = new Money(5, usd);

const fiveEuros = new Money(5, euro);

describe('ValueObject', () => {
  test('five dollars should equal another five dollars', () => {
    const anotherFiveDollars = new Money(5, usd);
    expect(fiveDollars.equals(anotherFiveDollars)).toBe(true);
  });

  test('five dollars plus five dollars should be 10 dolllars', () => {
    const tenDollars = fiveDollars.add(fiveDollars);
    expect(tenDollars.amount).toBe(10);
  });

  test("can't add five dollars with five uros", () => {
    expect(() => fiveDollars.add(fiveEuros)).toThrow(CurrencyMismatchException);
  });

  test('five dollars should not equal five uros', () => {
    expect(fiveDollars.notEquals(fiveEuros)).toBe(true);
  });

  test('money to string', () => {
    expect(fiveDollars.toString()).toBe('$5');
    expect(fiveEuros.toString()).toBe('€5');
  });

  test('money to JSON', () => {
    expect(fiveDollars.toJSON()).toBe(
      '{"amount":5,"currency":"{\\"currencyCode\\":\\"USD\\",\\"currencySymbol\\":\\"$\\",\\"decimalPlaces\\":2,\\"isCurrencyPrefix\\":true}"}'
    );
  });
});
