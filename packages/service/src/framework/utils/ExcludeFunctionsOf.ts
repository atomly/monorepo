export type ExcludeFunctionsOf<Type> = Pick<
  Type,
  { [Key in keyof Type]: Type[Key] extends Function ? never : Key }[keyof Type]
>;
