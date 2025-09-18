import { walletHistoryAndPagination } from '../../types/walletHistoryAndPagination';



export interface IWalletService {
    getUserWalletData(patientId:string,page:number,limit:number):Promise<walletHistoryAndPagination>;
}