import { getTronWeb, getContract } from './tronweb';

// Replace with your deployed contract address
export const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';

export const stakeContract = {
  // Stake TRX
  stake: async (amount) => {
    try {
      const tronWeb = getTronWeb();
      const contract = await getContract(CONTRACT_ADDRESS);
      const amountInSun = tronWeb.toSun(amount);
      
      const result = await contract.stake().send({
        callValue: amountInSun,
        shouldPollResponse: true
      });
      
      return result;
    } catch (error) {
      console.error('Error staking:', error);
      throw error;
    }
  },
  
  // Unstake TRX
  unstake: async (amount) => {
    try {
      const tronWeb = getTronWeb();
      const contract = await getContract(CONTRACT_ADDRESS);
      const amountInSun = tronWeb.toSun(amount);
      
      const result = await contract.unstake(amountInSun).send({
        shouldPollResponse: true
      });
      
      return result;
    } catch (error) {
      console.error('Error unstaking:', error);
      throw error;
    }
  },
  
  // Purchase Pack
  purchasePack: async (packId, price) => {
    try {
      const tronWeb = getTronWeb();
      const contract = await getContract(CONTRACT_ADDRESS);
      const priceInSun = tronWeb.toSun(price);
      
      const result = await contract.purchasePack(packId).send({
        callValue: priceInSun,
        shouldPollResponse: true
      });
      
      return result;
    } catch (error) {
      console.error('Error purchasing pack:', error);
      throw error;
    }
  },
  
  // Mint NFT
  mintNFT: async (packIndex) => {
    try {
      const contract = await getContract(CONTRACT_ADDRESS);
      
      const result = await contract.mintNFT(packIndex).send({
        shouldPollResponse: true
      });
      
      return result;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  },
  
  // Get user stake info
  getStakeInfo: async (address) => {
    try {
      const tronWeb = getTronWeb();
      const contract = await getContract(CONTRACT_ADDRESS);
      
      const result = await contract.getStakeInfo(address).call();
      
      return {
        amount: tronWeb.fromSun(result.amount.toString()),
        timestamp: result.timestamp.toString(),
        credits: result.credits.toString()
      };
    } catch (error) {
      console.error('Error getting stake info:', error);
      return { amount: '0', timestamp: '0', credits: '0' };
    }
  },
  
  // Get bandwidth credits
  getBandwidthCredits: async (address) => {
    try {
      const contract = await getContract(CONTRACT_ADDRESS);
      const credits = await contract.getBandwidthCredits(address).call();
      return credits.toString();
    } catch (error) {
      console.error('Error getting credits:', error);
      return '0';
    }
  },
  
  // Get user packs
  getUserPacks: async (address) => {
    try {
      const contract = await getContract(CONTRACT_ADDRESS);
      const packs = await contract.getUserPacks(address).call();
      return packs.map(p => p.toString());
    } catch (error) {
      console.error('Error getting user packs:', error);
      return [];
    }
  },
  
  // Get user NFTs
  getUserNFTs: async (address) => {
    try {
      const contract = await getContract(CONTRACT_ADDRESS);
      const nfts = await contract.getUserNFTs(address).call();
      return nfts.map(n => n.toString());
    } catch (error) {
      console.error('Error getting user NFTs:', error);
      return [];
    }
  },
  
  // Get pack details
  getPackDetails: async (packId) => {
    try {
      const tronWeb = getTronWeb();
      const contract = await getContract(CONTRACT_ADDRESS);
      const result = await contract.getPackDetails(packId).call();
      
      return {
        id: result.id.toString(),
        price: tronWeb.fromSun(result.price.toString()),
        exists: result.exists
      };
    } catch (error) {
      console.error('Error getting pack details:', error);
      return null;
    }
  },
  
  // Get NFT details
  getNFTDetails: async (nftId) => {
    try {
      const contract = await getContract(CONTRACT_ADDRESS);
      const result = await contract.getNFTDetails(nftId).call();
      
      return {
        id: result.id.toString(),
        packId: result.packId.toString(),
        owner: result.nftOwner,
        mintedAt: result.mintedAt.toString()
      };
    } catch (error) {
      console.error('Error getting NFT details:', error);
      return null;
    }
  }
};
