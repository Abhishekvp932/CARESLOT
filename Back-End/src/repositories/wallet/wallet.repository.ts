import { IWalletRepository } from '../../interface/wallet/IWalletRepository';
import { BaseRepository } from '../base.repository';
import Wallet from '../../models/implementation/wallet.model';
import { IWallet } from '../../models/interface/IWallet';
export class WalletRepository extends BaseRepository <IWallet> implements IWalletRepository {

    constructor(){
        super(Wallet);
    }
    async findByUserId(userId: string): Promise<IWallet | null> {
        return await Wallet.findById({userId:userId});
    }
}