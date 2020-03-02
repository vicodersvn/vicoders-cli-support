import { Rule, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs/internal/Observable';
import * as readline from 'readline';
import * as fs from 'fs';
import axios from 'axios';
import * as ora from 'ora';

interface Options {
  method?: string;
  responseType?: string;
}

/**
 * Download resource
 * @param {string} url - Resource URL
 * @param {string} destination - Destination
 * @param {Options} options - Optional params
 */

export function download(url: string, destination: string, _options?: Options): Rule {
  return (host: Tree) => {
    return new Observable<Tree>(subscriber => {
      let params = {};
      if (_options !== undefined) {
        params = Object.assign({ method: 'GET', responseType: 'stream' }, _options, { url });
      } else {
        params = { method: 'GET', responseType: 'stream', url: url };
      }

      const spinner: any = ora('Downloading...').start();
      const start_time = new Date();
      axios(params).then(response => {
        response.data.pipe(fs.createWriteStream(destination));
        const len = Number(response.data.headers['content-length']);
        let cur = 0;
        const total = Number(len) / 1048576;

        response.data.on('data', function(chunk: any) {
          if (process !== undefined && process.stdout !== undefined) {
            cur += Number(chunk.length);
            const percent = ((100.0 * cur) / len).toFixed(2);
            readline.cursorTo(process.stdout, 0);
            if (total > 0) {
              spinner.text(`Downloading ${percent}% of ${total.toFixed(2)}MB`);
            }
          }
        });

        response.data.on('end', () => {
          const end_time = new Date();
          if (process !== undefined && process.stdout !== undefined) {
            spinner.stop();
          }
          if (end_time.getTime() > start_time.getTime()) {
            const total_time = end_time.getTime() - start_time.getTime();
            setTimeout(() => {
              subscriber.next(host);
              subscriber.complete();
            }, Math.round(total_time * 0.2));
          } else {
            subscriber.next(host);
            subscriber.complete();
          }
        });

        response.data.on('error', () => {
          subscriber.error(new Error('Can not download file'));
        });
      });
    });
  };
}
