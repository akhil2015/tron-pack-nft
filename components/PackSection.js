import { useState, useEffect } from 'react';
import { stakeContract } from '../lib/contract';

export default function PackSection({ walletAddress, onSuccess, bandwidthCredits }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    try {
      const packDetails = await Promise.all([
        stakeContract.getPackDetails(1),
        stakeContract.getPackDetails(2),
        stakeContract.getPackDetails(3)
      ]);
      
      setPacks(packDetails.filter(p => p && p.exists));
    } catch (error) {
      console.error('Error loading packs:', error);
    }
  };

  const handlePurchase = async (packId, price) => {
    try {
      setLoading(true);
      await stakeContract.purchasePack(packId, price);
      alert('Pack purchased successfully!');
      onSuccess();
    } catch (error) {
      alert('Error purchasing pack: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📦</span> Purchase Packs
      </h2>

      <div className="mb-4 p-4 bg-black bg-opacity-20 rounded-lg">
        <div className="text-sm text-gray-300 mb-1">Available Credits</div>
        <div className="text-2xl font-bold text-white">{bandwidthCredits} ⚡</div>
        <div className="text-xs text-gray-400 mt-1">Required for minting NFTs (5 credits per NFT)</div>
      </div>

      <div className="space-y-3">
        {packs.map((pack, index) => (
          <div key={pack.id} className="p-4 bg-black bg-opacity-20 rounded-lg border border-white border-opacity-10 hover:border-opacity-30 transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Pack #{pack.id}</div>
                <div className="text-2xl font-bold text-purple-400">{parseFloat(pack.price).toFixed(2)} TRX</div>
              </div>
              <button
                onClick={() => handlePurchase(pack.id, pack.price)}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50"
              >
                {loading ? 'Buying...' : 'Buy Pack'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
