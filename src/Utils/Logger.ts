

import fs from 'fs'

export class Logger {

    public static async write(path: string | undefined, message: any) {
        if (path && message) {

            const mess: string = `[+] ${new Date()} ${message}\n`;
            fs.writeFile(path, mess, { flag: 'a+' }, err => {
                console.log(err);
            });
        }
    }

}