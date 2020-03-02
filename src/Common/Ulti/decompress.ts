import { Rule, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs/internal/Observable';
import * as decompresser from 'decompress';

interface Options {
  dryRun?: boolean;
  debug?: boolean;
}

/**
 * Take a nap
 *
 * @param {string} source - source
 * @param {dest} source - destination
 * @param {Options} options - Optional params
 */

export function decompress(source: string, dest: string, _options?: Options): Rule {
  return (host: Tree) => {
    return new Observable<Tree>(subscriber => {
      decompresser(source, dest)
        .then(() => {
          subscriber.next(host);
          subscriber.complete();
        })
        .catch(error => {
          subscriber.error(error);
        });
    });
  };
}
