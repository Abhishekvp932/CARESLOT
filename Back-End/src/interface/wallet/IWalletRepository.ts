import { IWallet } from '../../models/interface/IWallet';
import { UpdateQuery } from 'mongoose';

export interface IWalletRepository{
    findById(walletId:string):Promise<IWallet | null>;
    findByUserId(userId:string):Promise<IWallet | null>;
    create(walletDate:Partial<IWallet>):Promise<IWallet | null>;
    findByIdAndUpdate(walletId:string,update:UpdateQuery<IWallet>):Promise<IWallet | null>;
}