let tronWeb;

export const initTronWeb = () => {
  return new Promise((resolve, reject) => {
    const checkTronWeb = () => {
      if (window.tronWeb && window.tronWeb.ready) {
        tronWeb = window.tronWeb;
        resolve(tronWeb);
      } else {
        setTimeout(checkTronWeb, 100);
      }
    };
    
    if (typeof window !== 'undefined') {
      checkTronWeb();
      setTimeout(() => reject(new Error('TronLink not found')), 10000);
    } else {
      reject(new Error('Not in browser environment'));
    }
  });
};

export const getTronWeb = () => {
  if (window.tronWeb && window.tronWeb.ready) {
    return window.tronWeb;
  }
  throw new Error('TronWeb not initialized');
};

export const connectWallet = async () => {
  try {
    if (!window.tronLink) {
      throw new Error('TronLink not installed');
    }
    
    const res = await window.tronLink.request({ method: 'tron_requestAccounts' });
    
    if (res.code === 200) {
      await initTronWeb();
      return window.tronWeb.defaultAddress.base58;
    } else {
      throw new Error('User rejected connection');
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const getBalance = async (address) => {
  try {
    const tronWeb = getTronWeb();
    const balance = await tronWeb.trx.getBalance(address);
    return tronWeb.fromSun(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
};

export const getContract = async (contractAddress) => {
  try {
    const tronWeb = getTronWeb();
    return await tronWeb.contract().at(contractAddress);
  } catch (error) {
    console.error('Error getting contract:', error);
    throw error;
  }
};
