import { NullObjectError } from '../errors/NullObjectError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = abstract new (...args: any[]) => T;
type NullableObject = Nullable & Record<string, unknown>;
interface Nullable {
  isNullObject: boolean;
  valueOf(): undefined;
}

export abstract class NullObject {
  private static setFakeProps<T>(
    nullObject: NullableObject,
    klass: Constructor<T>,
  ): void {
    const visited = new Set<string>();
    let proto = klass.prototype;

    while (proto && proto !== Object.prototype) {
      const props = Object.getOwnPropertyNames(proto);

      for (const prop of props) {
        if (
          prop === 'constructor' ||
          prop === 'isNullObject' ||
          prop === 'valueOf' ||
          visited.has(prop)
        ) {
          continue;
        }

        visited.add(prop);
        // eslint-disable-next-line no-param-reassign
        nullObject[prop] = () => {
          throw new NullObjectError(klass.name);
        };
      }

      proto = Object.getPrototypeOf(proto);
    }

    Object.setPrototypeOf(nullObject, NullObject.prototype);
  }

  public static new<T>(klass: Constructor<T>): T {
    const nullObject: NullableObject = {
      isNullObject: true,
      valueOf: () => {
        return undefined;
      },
    };
    NullObject.setFakeProps(nullObject, klass);

    return nullObject as T;
  }

  public static isNullObject(nullable: unknown): boolean {
    return !!(nullable as NullableObject)?.isNullObject;
  }
}
