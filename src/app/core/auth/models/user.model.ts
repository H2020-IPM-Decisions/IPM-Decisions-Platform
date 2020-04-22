export class User {
    constructor(
        public id: string,
        public email: string,
        public userType: string,
        public role: string,
        private _token: string,
        private _tokenExpirationDate: number
    ) { }

    get token() {  
        if (!this._tokenExpirationDate || Math.round(new Date().getTime()/1000) > this._tokenExpirationDate) {
            return null;
        }
        
        return this._token;
    }

}