import { IWalletController } from '../../interface/wallet/IWalletController';
import { IWalletService } from '../../interface/wallet/IWalletService';


export class WalletController implements IWalletController {
    constructor (private _walletService : IWalletService ){}
}