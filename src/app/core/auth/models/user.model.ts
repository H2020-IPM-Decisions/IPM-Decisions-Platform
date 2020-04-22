export class User {
    constructor(
        public id: string,
        public email: string,
        public userType: string,
        public role: string,
        private _token: string,
        private _tokenExpiration: number
    ) { }

    get token() {  
        if (!this._tokenExpiration || Math.round(new Date().getTime()/1000) > this._tokenExpiration) {
            return null;
        }

        return this._token;
    }

    get tokenExpiration() {
        return this._tokenExpiration;
    }

}