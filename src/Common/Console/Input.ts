import { Rule, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs/internal/Observable';
import * as inquirer from 'inquirer';

export function Input(name: string, default_message: string): Rule {
  const message = default_message ? `${default_message}: ` : `${name}: `;
  return (host: Tree) => {
    return new Observable<Tree>(subscriber => {
      inquirer.prompt({ type: 'input', name: name, message: message, default: 1 }).then(() => {
        console.log({ host });
        subscriber.next(host);
        subscriber.complete();
      });
    });
  };
}
