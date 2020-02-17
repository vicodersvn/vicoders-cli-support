import { Tree } from '@angular-devkit/schematics';

/**
 * Register new option to host object
 * @param {Tree} host - Host instance to register
 * @param {string} key - Option key
 * @param {any} value - Option value
 */

export function registerOption(host: Tree, key: string, value: any) {
  let options = (host as any).options;
  if (options === undefined) {
    options = {};
  }
  options = { ...options, ...{ [key]: value } };
  (host as any).options = options;
  return host;
}
