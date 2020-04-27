export class Account {
    constructor(
        public id: string,
        public email: string,
        public tokenInit: number,
        private _tokenExpiration: number,
        private _token: string,
        public userAccessType?: string,
        public role?: string,
        private issuer?: string,
        private audience?: string
    ) { }

    get token() {  
        if (!this._tokenExpiration || (this.tokenInit > this._tokenExpiration)) {
            return null;
        }
        return this._token;
    }

    get tokenExpiration() {
        return this._tokenExpiration;
    }

}