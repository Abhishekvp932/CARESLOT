
import { IAdmin } from "../../models/interface/IAdmin"
export interface IAdminRepository{
    findByEmail(email:string):Promise<IAdmin | null>
    findById(id:string):Promise<IAdmin | null>
}