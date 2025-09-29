
import { BaseRepository } from '../base.repository';
import { IWalletHistory } from '../../models/interface/IWallet.history';
import WalletHistory from '../../models/implementation/wallet.history.modal';
import { IWalletHistoryRepository } from '../../interface/walletHistory/IWalletHistoryRepository';
export class WalletHistoryRepository extends BaseRepository <IWalletHistory> implements IWalletHistoryRepository{
    constructor (){
        super(WalletHistory);
    }
    async findByWalletId(walletId: string): Promise<IWalletHistory[]> {
        return await WalletHistory.find({walletId:walletId}).sort({createdAt:-1});
    }
    async findByAppoinmentId(appoinmentId: string): Promise<IWalletHistory | null> {
        return await WalletHistory.findOne({appoinmentId:appoinmentId});
    }
    async findAllWithPagination(walletId:string,skip: number, limit: number): Promise<IWalletHistory[]> {
        return await WalletHistory.find({walletId:walletId}).sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .lean();
    }
    async countAll(walletId:string): Promise<number> {
        return await WalletHistory.countDocuments({walletId});
    }
}