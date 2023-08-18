import { JSONArray, JSONObject, JSONPrimitive } from './json-types';
import 'reflect-metadata';
export type Permission = 'r' | 'w' | 'rw' | 'none';

export type StoreResult = Store | JSONPrimitive | undefined;

export type StoreValue =
  | JSONObject
  | JSONArray
  | StoreResult
  | (() => StoreResult);

export interface IStore {
  defaultPolicy: Permission;
  allowedToRead(key: string): boolean;
  allowedToWrite(key: string): boolean;
  read(path: string): StoreResult;
  write(path: string, value: StoreValue): StoreValue;
  writeEntries(entries: JSONObject): void;
  entries(): JSONObject;
}

export function Restrict(restriction: string = ''): any {
  return function (target: any, propertyKey: string) {
    let metadata = {
      canRead: restriction.includes('r'),
      canWrite: restriction.includes('w'),
    };

    Reflect.defineMetadata('restrict-decorator', metadata, target, propertyKey);
  };
}

export class Store implements IStore {
  defaultPolicy: Permission = 'rw';
  [key: string]: any;

  allowedToRead(key: string): boolean {
    const metadata = Reflect.getMetadata('restrict-decorator', this, key);
    return metadata?.canRead || this.defaultPolicy.includes('r');
  }

  allowedToWrite(key: string): boolean {
    const metadata = Reflect.getMetadata('restrict-decorator', this, key);
    return metadata?.canWrite || this.defaultPolicy.includes('w');
  }

  read(path: string): StoreResult {
    if (!this.allowedToRead(path)) {
      throw new Error(`Cannot read property ${path}`);
    } else {
      const result = this[path];
      return result as StoreResult;
    }
  }

  write(path: string, value: StoreValue): StoreValue {
    if (!this.allowedToWrite(path)) {
      throw new Error(`Cannot write property ${path}`);
    } else {
      this[path] = value;
      return value;
    }
  }

  writeEntries(entries: JSONObject): void {
    for (const [key, value] of Object.entries(entries)) {
      this.write(key, value);
    }
  }

  entries(): JSONObject {
    throw new Error('Method not implemented.');
  }
}
