import { useState } from 'react';
import { stakeContract } from '../lib/contract';

export default function StakeSection({ walletAddress, onSuccess, stakedAmount }) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      await stakeContract.stake(stakeAmount);
      alert('Successfully staked TRX!');
      setStakeAmount('');
      onSuccess();
    } catch (error) {
      alert('Error staking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      await stakeContract.unstake(unstakeAmount);
      alert('Successfully unstaked TRX!');
      setUnstakeAmount('');
      onSuccess();
    } catch (error) {
      alert('Error unstaking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>🔒</span> Stake TRX
      </h2>
      
      <div className="mb-4 p-4 bg-black bg-opacity-20 rounded-lg">
        <div className="text-sm text-gray-300 mb-1">Currently Staked</div>
        <div className="text-2xl font-bold text-white">{parseFloat(stakedAmount).toFixed(2)} TRX</div>
        <div className="text-xs text-gray-400 mt-1">Earn 10 credits per 1 TRX staked</div>
      </div>

      <div className="space-y-4">
        {/* Stake */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Stake Amount (TRX)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 px-4 py-2 bg-black bg-opacity-30 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleStake}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
            >
              {loading ? 'Staking...' : 'Stake'}
            </button>
          </div>
        </div>

        {/* Unstake */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Unstake Amount (TRX)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 px-4 py-2 bg-black bg-opacity-30 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleUnstake}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition disabled:opacity-50"
            >
              {loading ? 'Unstaking...' : 'Unstake'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
