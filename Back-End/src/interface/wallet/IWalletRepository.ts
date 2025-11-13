import { IWallet } from '../../models/interface/IWallet';
import { ClientSession, UpdateQuery } from 'mongoose';

export interface IWalletRepository{
    findById(walletId:string):Promise<IWallet | null>;
    findByUserId(userId:string):Promise<IWallet | null>;
    create(walletDate:Partial<IWallet>,session?:ClientSession):Promise<IWallet | null>;
    findByIdAndUpdate(walletId:string,update:UpdateQuery<IWallet>,session?:ClientSession):Promise<IWallet | null>;
}