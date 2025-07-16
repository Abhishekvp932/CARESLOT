export interface IMailService {
    sendMail(to:string,subject:string,text:string):Promise<void>;
}