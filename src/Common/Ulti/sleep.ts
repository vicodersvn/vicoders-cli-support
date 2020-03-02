import { Rule, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs/internal/Observable';

interface Options {
  dryRun?: boolean;
  debug?: boolean;
}

/**
 * Take a nap
 *
 * @param {number} time - time in milisecond
 * @param {Options} options - Optional params
 */

export function sleep(time: number, _options?: Options): Rule {
  return (host: Tree) => {
    return new Observable<Tree>(subscriber => {
      setTimeout(() => {
        subscriber.next(host);
        subscriber.complete();
      }, time);
    });
  };
}
