
export class Console {

    static log(str: any): void { console.log('\x1b[36m%s\x1b[0m', str);  }

    static error(str: any): void { console.log('\x1b[31m%s\x1b[0m', str); }

    static warning(str: any): void { console.log('\x1b[33m%s\x1b[0m', str); }

    static ok(str: any): void { console.log('\x1b[32m%s\x1b[0m', str); }
    
}