import { ClientSession } from 'mongoose';
import { IWalletHistory } from '../../models/interface/IWallet.history';


export interface IWalletHistoryRepository {
    create(walletHistory:Partial<IWalletHistory>,session?:ClientSession):Promise<IWalletHistory | null>;
    findByWalletId(walletId:string):Promise<IWalletHistory[]>;
    findByAppoinmentId(appoinmentId:string):Promise<IWalletHistory | null>;
    findAllWithPagination(walletId:string,skip:number,limit:number):Promise<IWalletHistory[]>;
    countAll(walletId:string):Promise<number>;
}