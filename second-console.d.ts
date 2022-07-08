// https://stackoverflow.com/questions/52677576/typescript-discriminated-union-allows-invalid-state/52678379

declare type UnionKeys<T> = T extends T ? keyof T : never;
declare type StrictUnionHelper<T, TAllKeys extends PropertyKey> = T extends any
  ? T & Partial<Record<Exclude<TAllKeys, keyof T>, never>>
  : never;
declare type StrictUnion<T> = StrictUnionHelper<T, UnionKeys<T>>;
declare type ConsoleConnectionType = StrictUnion<
  | {
      port: number;
      host?: string;
    }
  | {
      seed: string;
    }
  | {
      path: string;
    }
  | {}
>;
declare type ConsoleParameter = ConsoleConnectionType & {
  reconnect?: boolean;
  wait?: boolean;
  clearConsole?: boolean;
};

import { Console } from "node:console";

declare class SecondConsole extends Console {
  constructor(params?: ConsoleParameter);
  static createIPCPath(seed: string): string;
  static createRequire(console: Console, __parent: string): NodeJS.Require;
}
export default SecondConsole;
