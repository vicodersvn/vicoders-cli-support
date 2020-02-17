import { Rule, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs/internal/Observable';
import * as inquirer from 'inquirer';
import { registerOption } from '../Host/Host';

interface InputOption {
  message?: string;
  default?: string;
}

const INQUIRER_TYPE = 'input';

/**
 * Create a input prompt.
 * @param {string} name - Name of input
 * @param {InputOption} options - Optional params
 */

export function Input(name: string, options: InputOption): Rule {
  const message = options.message ? `${options.message}: ` : `${name}: `;
  const params: any = { type: INQUIRER_TYPE, name: name, message: message };
  if (options.default) {
    params.default = options.default;
  }

  return (host: Tree) => {
    return new Observable<Tree>(subscriber => {
      inquirer.prompt(params).then(answer => {
        registerOption(host, name, (answer as any)[name]);
        subscriber.next(host);
        subscriber.complete();
      });
    });
  };
}
