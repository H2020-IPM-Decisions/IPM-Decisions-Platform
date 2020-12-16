export class Account {
    constructor(
        public id: string,
        public email: string,
        public tokenInit: number,
        public tokenExpiration: number,
        public token: string,
        public refreshToken?: string,
        public useraccesstype?: string[],
        public roles?: string[],
        public tokenType?: string,
        public issuer?: string,
        public audience?: string
    ) { }
    
    // get token() {  
    //     if (!this._tokenExpiration || (this.tokenInit > this._tokenExpiration)) {
    //         return null;
    //     }
    //     return this._token;
    // }

    // get tokenExpiration() {
    //     return this._tokenExpiration;
    // }

}