import { IWalletRepository } from '../../interface/wallet/IWalletRepository';
import { BaseRepository } from '../base.repository';
import Wallet from '../../models/implementation/wallet.model';
import { IWallet } from '../../models/interface/IWallet';
import { ClientSession, UpdateQuery } from 'mongoose';
export class WalletRepository
  extends BaseRepository<IWallet>
  implements IWalletRepository
{
  constructor() {
    super(Wallet);
  }
  async findByUserId(userId: string): Promise<IWallet | null> {
    return await Wallet.findOne({ userId });
  }

  async findByIdAndUpdate(
    walletId: string,
    update: UpdateQuery<IWallet>,
    session?:ClientSession
  ): Promise<IWallet | null> {
    return await Wallet.findByIdAndUpdate(walletId, update, { new: true ,session});
  }
}
