type ExcludeKeysWithTypeOf<T, V> = {
  [K in keyof T]: Exclude<T[K], undefined> extends V ? never : K;
}[keyof T];

type ReplaceUnserializable<T extends object> = {
  [key in keyof T]: T[key] extends Date
    ? string
    : T[key] extends Date | undefined
    ? string | undefined
    : T[key] extends Function
    ? never
    : T[key];
};

export type SerializableEntity<T extends object> = Pick<
  ReplaceUnserializable<T>,
  ExcludeKeysWithTypeOf<ReplaceUnserializable<T>, never>
>;

export function toSerializable<T extends object>(input: T): SerializableEntity<T> {
  return input as SerializableEntity<T>;
}
