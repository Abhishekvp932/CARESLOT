export interface IPatientService {

    getResendAppoinments():Promise<any>
    updateUserProfile(formData:any,userId:string,profileImg?:string):Promise<any>
    getUserData(userId:string):Promise<any>
}