import { IWalletService } from '../../interface/wallet/IWalletService';
import { IWalletRepository } from '../../interface/wallet/IWalletRepository';
import { IWalletHistoryRepository } from '../../interface/walletHistory/IWalletHistoryRepository';
export class WalletService implements IWalletService {
    constructor (
        private _walletRepository:IWalletRepository,
        private _WalletHistoryRepository:IWalletHistoryRepository,

    ){}
}