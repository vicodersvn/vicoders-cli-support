import { Rule, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs/internal/Observable';
import { spawn } from 'child_process';

interface Options {
  dryRun?: boolean;
  debug?: boolean;
}

/**
 * Create a input prompt.
 * @param {string} name - Name of input
 * @param {Options} options - Optional params
 */

export function exec(command: string, _options?: Options): Rule {
  const [executable, ...args] = command.split(' ');
  return (host: Tree) => {
    return new Observable<Tree>(subscriber => {
      spawn(executable, args, { stdio: 'inherit' });
      subscriber.next(host);
      subscriber.complete();
    });
  };
}
