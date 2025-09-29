import { IWalletHistory } from '../../models/interface/IWallet.history';
import { walletHistoryAndPagination } from '../../types/walletHistoryAndPagination';



export interface IWalletService {
    getUserWalletData(patientId:string,page:number,limit:number):Promise<walletHistoryAndPagination>;
    getDoctorWalletData(doctorId:string):Promise<{balance:number,history:IWalletHistory[]}>;
}