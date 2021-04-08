export interface IManageWeatherDataSource{
    id?: string;
    url?: string;
    label?: string;
    username?: string;
    password?: string;
}


export class ManageWeatherDataSource implements IManageWeatherDataSource{
    constructor(
        public id?: string,
        public url?: string,
        public label?: string,
        public username?: string,
        public password?: string
    ){}
}