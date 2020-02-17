import { Rule, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs/internal/Observable';
import * as inquirer from 'inquirer';
import * as colors from 'colors';
import { registerOption } from '../Host/Host';

interface InputOption {
  message?: string;
  default?: string;
}

const INQUIRER_TYPE = 'input';

/**
 * Create a input prompt.
 * @param {string} name - Name of selection
 * @param {any[]} values - Available value
 * @param {any[]} options - Optional params
 */

export function Select(name: string, values: any[], options?: InputOption): Rule {
  return (host: Tree) => {
    console.log((host as any).options);
    return new Observable<Tree>(subscriber => {
      let answer;
      options = options || {};
      let message = options.message ? `\n${options.message} \n\n` : `\nSelect ${name}: \n\n`;
      const params: any = { type: INQUIRER_TYPE, name: name, message: message };
      if (options.default) {
        params.default = options.default;
      }

      values.forEach((item: any, key: any) => {
        message += `(${key + 1}) ${item.description} \n`;
      });

      console.log(message);
      inquirer.prompt({ type: 'input', name: name, message: 'Your choice: ', default: 1 }).then(result => {
        if (Number(result[name]) <= values.length) {
          answer = values[Number(result[name]) - 1];
          registerOption(host, name, answer);
          console.log((host as any).options);
          subscriber.next(host);
          subscriber.complete();
        } else {
          console.log(colors.red('Please select available option'));
          subscriber.error();
        }
      });
    });
  };
}
