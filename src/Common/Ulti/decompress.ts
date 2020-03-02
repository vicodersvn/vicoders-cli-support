import { Rule, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs/internal/Observable';
import * as decompresser from 'decompress';

interface Options {
  dryRun?: boolean;
  debug?: boolean;
}

/**
 * Decompress zip file
 * @param {string} source - Source file
 * @param {string} destination - Destination
 * @param {Options} options - Optional params
 */

export function decompress(source: string, destination: string, _options?: Options): Rule {
  return (host: Tree) => {
    return new Observable<Tree>(subscriber => {
      decompresser(source, destination)
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
