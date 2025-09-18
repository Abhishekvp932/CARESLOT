

export interface IChatbotService{
    processMessage(message:string):Promise<{replay:string}>;

}