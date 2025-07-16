export interface IAdminRepository{
    findByEmail(email:string):Promise<any>
}