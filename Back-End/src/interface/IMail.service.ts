export interface IMailService {
    sendMail(to:string,subject:string,text:string):Promise<void>;
    sendBlockDoctorMail(email:string,name:string,reason:string):Promise<void>;
    sendDoctorUnBlockEmail(email:string,name:string):Promise<void>;
    sendPatientAppoinmentEmail(email:string,Patientname:string,date:string,startTime:string,endTime:string,doctorName:string):Promise<void>;
    sendDoctorAppoinmentEmail(email:string,doctorName:string,patientName:string,date:string,startTime:string,endTime:string):Promise<void>;
    sendDoctorRejectionEmail(email:string,doctorName:string,reason:string):Promise<void>;
    sendDoctorApproveEmail(email:string,doctorName:string):Promise<void>;
}