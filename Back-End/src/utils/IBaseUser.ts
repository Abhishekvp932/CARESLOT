export interface IBaseUser{
    _id:string | { toString():string},
    email:string,
    password:string
}