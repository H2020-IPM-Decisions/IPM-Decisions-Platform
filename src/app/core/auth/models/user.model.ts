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
        if (!this._tokenExpirationDate) { // || +new Date() > this._tokenExpirationDate || TODO
            return null;
        }
        return this._token;
    }

}