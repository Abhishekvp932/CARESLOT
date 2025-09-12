import { IWallet } from '../../models/interface/IWallet';

export interface IWalletRepository{
    findById(walletId:string):Promise<IWallet | null>;
    findByUserId(userId:string):Promise<IWallet | null>;
}