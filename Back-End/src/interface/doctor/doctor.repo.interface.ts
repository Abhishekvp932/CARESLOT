export interface IDoctorRepository{
    uploadDocument(doctorId:string,qualification:any):Promise<any>
}