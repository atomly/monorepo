import { ExcludeFunctionsOf } from './ExcludeFunctionsOf';

type IsOptional<T> = Extract<T, undefined> extends never ? false : true;
type AnyFunction = (...args: any[]) => any;
type IsFunction<T> = T extends AnyFunction ? true : false;
type IsValueType<T> = T extends
  | string
  | number
  | boolean
  | null
  | undefined
  | AnyFunction
  | Set<any>
  | Map<any, any>
  | Date
  | Array<any>
  ? true
  : false;

type ReplaceDate<T> = T extends Date ? string : T;
type ReplaceSet<T> = T extends Set<infer X> ? X[] : T;
type ReplaceMap<T> = T extends Map<infer K, infer I>
  ? Record<
      K extends string | number | symbol ? K : string,
      IsValueType<I> extends true
        ? I
        : { [K in keyof ExcludeFunctionsOf<I>]: TransformToDTO<I[K]> }
    >
  : T;
type ReplaceArray<T> = T extends Array<infer X> ? TransformToDTO<X>[] : T;

type Serialize<T> = IsValueType<T> extends true
  ? ReplaceDate<ReplaceMap<ReplaceSet<ReplaceArray<T>>>>
  : { [K in keyof ExcludeFunctionsOf<T>]: TransformToDTO<T[K]> };

type TransformToDTO<T> = IsFunction<T> extends true
  ? never
  : IsOptional<T> extends true
  ? Serialize<Exclude<T, undefined>> | null
  : Serialize<T>;

/**
 * Deeply converts a generic type into an anemic type by excluding any methods.
 * Useful for object/class initializers or data-centric operations.
 */
export type DataTransferObject<
  T,
  K extends keyof ExcludeFunctionsOf<T> = never
> = Omit<TransformToDTO<T>, K>;
