import { IAdminRepository } from "../../interface/admin/admin.repo.interface";

import Admin from "../../models/implementation/admin.model";
import { BaseRepository } from "../base.repository";
import { IAdmin } from "../../models/interface/IAdmin";
export class AdminRepository extends BaseRepository <IAdmin> implements IAdminRepository{

    constructor (){
        super(Admin)
    }
}