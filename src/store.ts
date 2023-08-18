/* eslint-disable @typescript-eslint/no-this-alias */
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

export function Restrict(restriction = ''): any {
  return function (target: any, propertyKey: string) {
    const metadata = {
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
    console.log(metadata);

    return metadata?.canWrite || this.defaultPolicy.includes('w');
  }

  read(path: string): StoreResult {
    const pathParts = path.split(':');
    let currentObject = this;

    for (const part of pathParts) {
      if (
        currentObject instanceof Store &&
        !currentObject.allowedToRead(part)
      ) {
        throw new Error(`Cannot read property ${path}`);
      }

      currentObject = currentObject[part];
    }

    return currentObject as StoreResult;
  }

  write(path: string, value: StoreValue): StoreValue {
    value = this.processValue(value);

    const pathParts = path.split(':');
    let currentObject: any = this;

    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      console.log(i);

      if (
        currentObject instanceof Store &&
        i === pathParts.length - 2 &&
        !currentObject.allowedToWrite(part)
      ) {
        console.log(pathParts);

        throw new Error(`Cannot write property ${path}`);
      }

      if (!currentObject[part]) {
        currentObject[part] = new Store();
      }

      currentObject = currentObject[part];

      console.log('?', currentObject instanceof Store);
    }

    currentObject[pathParts[pathParts.length - 1]] = value;

    return this;
  }

  writeEntries(entries: JSONObject): void {
    for (const [key, value] of Object.entries(entries)) {
      this.write(key, value);
    }
  }

  entries(): JSONObject {
    throw new Error('Method not implemented.');
  }

  processValue(value: StoreValue): StoreValue {
    if (typeof value !== 'object') return value;

    const store = new Store();
    for (const [key, v] of Object.entries(value as any)) {
      store.write(key, v as any);
    }
    return store;
  }
}
