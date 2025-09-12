
import { BaseRepository } from '../base.repository';
import { IWalletHistory } from '../../models/interface/IWallet.history';
import WalletHistory from '../../models/implementation/wallet.history.modal';
import { IWalletHistoryRepository } from '../../interface/walletHistory/IWalletHistoryRepository';
export class WalletHistoryRepository extends BaseRepository <IWalletHistory> implements IWalletHistoryRepository{
    constructor (){
        super(WalletHistory);
    }
}