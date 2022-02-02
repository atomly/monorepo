export default class ArgumentOutOfRangeException<
  Class extends object = object
> extends Error {
  constructor(argument: keyof Class, error: string) {
    super(`${argument} - ${error}`);
  }
}
