import { ExcludeFunctionsOf } from './ExcludeFunctionsOf';

/**
 * Deeply converts a generic type into an anemic type by excluding any methods.
 * Useful for object/class initializers or data-centric operations.
 */
export type DataTransferObject<Type> = {
  [Key in keyof ExcludeFunctionsOf<Type>]: NonNullable<Type[Key]> extends object // Is the type an object?
    ? // Is the type an array?
      NonNullable<Type[Key]> extends Array<unknown>
      ? // Is the array element of the type an object?
        NonNullable<Type[Key]>[number] extends object
        ? // Then return deep anemic of array element:
          Array<DataTransferObject<NonNullable<Type[Key]>[number]>>
        : // Otherwise, return array element as it is:
          Type[Key]
      : // Is the type a date?
      // NOTE: This block serves as a whitelist.
      NonNullable<Type[Key]> extends Date
      ? // Then return the primitive date:
        Type[Key]
      : // Otherwise, return deep anemic of the object:
        DataTransferObject<NonNullable<Type[Key]>>
    : // Otherwise, return the primitive type:
      Type[Key];
};
