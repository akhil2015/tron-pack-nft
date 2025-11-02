import { useState, useEffect } from 'react';
import { stakeContract } from '../lib/contract';

export default function NFTSection({ walletAddress, packs, nfts, bandwidthCredits, onSuccess }) {
  const [nftDetails, setNftDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNFTDetails();
  }, [nfts]);

  const loadNFTDetails = async () => {
    if (nfts.length === 0) return;
    
    try {
      const details = await Promise.all(
        nfts.map(nftId => stakeContract.getNFTDetails(nftId))
      );
      setNftDetails(details);
    } catch (error) {
      console.error('Error loading NFT details:', error);
    }
  };

  const handleMint = async (packIndex) => {
    if (parseInt(bandwidthCredits) < 5) {
      alert('Insufficient bandwidth credits! You need 5 credits to mint an NFT.');
      return;
    }

    try {
      setLoading(true);
      await stakeContract.mintNFT(packIndex);
      alert('NFT minted successfully!');
      onSuccess();
    } catch (error) {
      alert('Error minting NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>🎨</span> Your NFTs & Packs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Packs */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Available Packs ({packs.length})</h3>
          {packs.length === 0 ? (
            <div className="p-8 text-center bg-black bg-opacity-20 rounded-lg border border-dashed border-white border-opacity-20">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-gray-400">No packs available</div>
              <div className="text-sm text-gray-500 mt-1">Purchase packs to mint NFTs</div>
            </div>
          ) : (
            <div className="space-y-3">
              {packs.map((packId, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-orange-500 to-red-500 bg-opacity-20 rounded-lg border border-orange-500 border-opacity-30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Pack #{packId}</div>
                      <div className="text-xs text-gray-300">Ready to mint</div>
                    </div>
                    <button
                      onClick={() => handleMint(index)}
                      disabled={loading || parseInt(bandwidthCredits) < 5}
                      className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Minting...' : 'Mint NFT (5⚡)'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Minted NFTs */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Minted NFTs ({nfts.length})</h3>
          {nfts.length === 0 ? (
            <div className="p-8 text-center bg-black bg-opacity-20 rounded-lg border border-dashed border-white border-opacity-20">
              <div className="text-4xl mb-2">🎨</div>
              <div className="text-gray-400">No NFTs minted yet</div>
              <div className="text-sm text-gray-500 mt-1">Mint NFTs from your packs</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {nftDetails.map((nft, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-20 rounded-lg border border-purple-500 border-opacity-30">
                  <div className="aspect-square bg-black bg-opacity-30 rounded-lg mb-2 flex items-center justify-center">
                    <div className="text-4xl">🎨</div>
                  </div>
                  <div className="text-sm font-medium text-white">NFT #{nft.id}</div>
                  <div className="text-xs text-gray-300">From Pack #{nft.packId}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
