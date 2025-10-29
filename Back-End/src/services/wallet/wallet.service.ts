import { IWalletService } from '../../interface/wallet/IWalletService';
import { IWalletRepository } from '../../interface/wallet/IWalletRepository';
import { IWalletHistoryRepository } from '../../interface/walletHistory/IWalletHistoryRepository';

import { walletHistoryAndPagination } from '../../types/walletHistoryAndPagination';

import { IWalletHistoryDto } from '../../types/IWalletHistoryDTO';
export class WalletService implements IWalletService {
  constructor(
    private _walletRepository: IWalletRepository,
    private _WalletHistoryRepository: IWalletHistoryRepository
  ) {}
  async getUserWalletData(
    patientId: string,
    page: number,
    limit: number
  ): Promise<walletHistoryAndPagination> {
    const skip = (page - 1) * limit;

    const wallet = await this._walletRepository.findByUserId(patientId);

    if (!wallet) {
      throw new Error('This user dont have wallet');
    }

    const [walletHistoryList, total] = await Promise.all([
      this._WalletHistoryRepository.findAllWithPagination(
        wallet?.id,
        skip,
        limit
      ),
      this._WalletHistoryRepository.countAll(wallet?._id as string),
    ]);

    if (!walletHistoryList) {
      throw new Error('No history found');
    }
    return {
      walletHistory: walletHistoryList,
      total: total,
      balance: wallet?.balance,
    };
  }
  async getDoctorWalletData(
    doctorId: string
  ): Promise<{ balance: number; history: IWalletHistoryDto[] }> {
    if (!doctorId) {
      throw new Error('Doctor id is not found');
    }
    const doctorWallet = await this._walletRepository.findByUserId(doctorId);
    if (!doctorWallet) {
      throw new Error('Doctor wallet not found');
    }
    const walletHistory = await this._WalletHistoryRepository.findByWalletId(
      doctorWallet?._id as string
    );
    if (!walletHistory) {
      throw new Error('wallet history not found');
    }

    return {
      balance: doctorWallet?.balance,
      history: walletHistory,
    };
  }
}
