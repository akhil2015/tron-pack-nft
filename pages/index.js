import { useEffect, useState } from 'react'
import Head from 'next/head'
import { CONTRACT_ABI } from '@/lib/contractABI'
import { CONTRACT_ADDRESS } from '@/lib/contractConfig'

export default function Home() {
  const [tronWeb, setTronWeb] = useState(null)
  const [address, setAddress] = useState(null)
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [txHash, setTxHash] = useState('') // Track transaction hash
  
  // User data
  const [stakeInfo, setStakeInfo] = useState({ amount: 0, credits: 0 })
  const [userPacks, setUserPacks] = useState([])
  const [userNFTs, setUserNFTs] = useState([])
  const [availablePacks, setAvailablePacks] = useState([])
  
  // Form states
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')

  // Connect wallet
  const connectWallet = async () => {
    try {
      setLoading(true)
      setLoadingMessage('Connecting to wallet...')
      
      if (!window.tronLink) {
        alert('Please install TronLink wallet extension')
        return
      }

      const result = await window.tronLink.request({ method: 'tron_requestAccounts' })
      
      if (result.code === 200) {
        const tronWebInstance = window.tronLink.tronWeb
        
        // Check network
        const network = tronWebInstance.fullNode.host
        if (!network.includes('shasta')) {
          alert('⚠️ Please switch TronLink to Shasta Testnet!')
          return
        }

        setTronWeb(tronWebInstance)
        setAddress(tronWebInstance.defaultAddress.base58)
        
        setLoadingMessage('Initializing contract...')
        const contractInstance = await tronWebInstance.contract(CONTRACT_ABI, CONTRACT_ADDRESS)
        setContract(contractInstance)
        
        setLoadingMessage('Loading your data...')
        await loadUserData(tronWebInstance, contractInstance, tronWebInstance.defaultAddress.base58)
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      alert('Failed to connect wallet: ' + error.message)
    } finally {
      setLoading(false)
      setLoadingMessage('')
    }
  }

  // Load user data
  const loadUserData = async (tronWebInstance, contractInstance, userAddress) => {
    try {
      const stakeData = await contractInstance.getStakeInfo(userAddress).call()
      setStakeInfo({
        amount: parseFloat(tronWebInstance.fromSun(stakeData.amount?.toString() || '0')).toFixed(2),
        credits: stakeData.credits?.toString() || '0'
      })
      
      const packsData = await contractInstance.getUserPacks(userAddress).call()
      const packsDetails = []
      for (let i = 0; i < packsData.length; i++) {
        const packId = packsData[i].toString()
        const pack = await contractInstance.getPackDetails(packId).call()
        packsDetails.push({
          id: packId,
          price: tronWebInstance.fromSun(pack.price.toString()),
          exists: pack.exists
        })
      }
      setUserPacks(packsDetails)
      
      const nftsData = await contractInstance.getUserNFTs(userAddress).call()
      const nftsDetails = []
      for (let i = 0; i < nftsData.length; i++) {
        const nftId = nftsData[i].toString()
        const nft = await contractInstance.getNFTDetails(nftId).call()
        nftsDetails.push({
          id: nftId,
          packId: nft.packId.toString(),
          mintedAt: new Date(parseInt(nft.mintedAt.toString()) * 1000).toLocaleDateString()
        })
      }
      setUserNFTs(nftsDetails)
      
      const packsToLoad = []
      for (let i = 1; i <= 3; i++) {
        try {
          const pack = await contractInstance.getPackDetails(i).call()
          if (pack.exists) {
            packsToLoad.push({
              id: i.toString(),
              price: tronWebInstance.fromSun(pack.price.toString()),
              exists: pack.exists
            })
          }
        } catch (e) {
          // Pack doesn't exist
        }
      }
      setAvailablePacks(packsToLoad)
      
    } catch (error) {
      console.error('Error loading user data:', error)
      alert('Failed to load data: ' + error.message)
    }
  }

  // Refresh data helper
  const refreshData = async () => {
    if (tronWeb && contract && address) {
      setLoading(true)
      setLoadingMessage('Refreshing data...')
      await loadUserData(tronWeb, contract, address)
      setLoading(false)
      setLoadingMessage('')
    }
  }

  // Stake TRX
  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    try {
      setLoading(true)
      setTxHash('')
      setLoadingMessage('Preparing transaction...')
      const amountInSun = tronWeb.toSun(stakeAmount)
      
      setLoadingMessage('Waiting for confirmation...')
      const result = await contract.stake().send({
        callValue: amountInSun,
        feeLimit: 1000000000,
      })
      
      // Set transaction hash
      if (result) {
        setTxHash(result)
      }
      
      setLoadingMessage('Transaction confirmed! Updating data...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      await loadUserData(tronWeb, contract, address)
      setStakeAmount('')
      
      alert('✅ Staked successfully!')
    } catch (error) {
      console.error('Error staking:', error)
      alert('Failed to stake: ' + error.message)
    } finally {
      setLoading(false)
      setLoadingMessage('')
      setTxHash('')
    }
  }

  // Unstake TRX
  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    
    try {
      setLoading(true)
      setTxHash('')
      setLoadingMessage('Preparing transaction...')
      const amountInSun = tronWeb.toSun(unstakeAmount)
      
      setLoadingMessage('Waiting for confirmation...')
      const result = await contract.unstake(amountInSun).send({
        feeLimit: 1000000000,
      })
      
      if (result) {
        setTxHash(result)
      }
      
      setLoadingMessage('Transaction confirmed! Updating data...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      await loadUserData(tronWeb, contract, address)
      setUnstakeAmount('')
      
      alert('✅ Unstaked successfully!')
    } catch (error) {
      console.error('Error unstaking:', error)
      alert('Failed to unstake: ' + error.message)
    } finally {
      setLoading(false)
      setLoadingMessage('')
      setTxHash('')
    }
  }

  // Purchase Pack
  const handlePurchasePack = async (packId, price) => {
    try {
      setLoading(true)
      setTxHash('')
      setLoadingMessage('Preparing purchase...')
      const priceInSun = tronWeb.toSun(price)
      
      setLoadingMessage('Waiting for confirmation...')
      const result = await contract.purchasePack(packId).send({
        callValue: priceInSun,
        feeLimit: 1000000000,
      })
      
      if (result) {
        setTxHash(result)
      }
      
      setLoadingMessage('Purchase confirmed! Updating data...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      await loadUserData(tronWeb, contract, address)
      
      alert('✅ Pack purchased successfully!')
    } catch (error) {
      console.error('Error purchasing pack:', error)
      alert('Failed to purchase pack: ' + error.message)
    } finally {
      setLoading(false)
      setLoadingMessage('')
      setTxHash('')
    }
  }

  // Mint NFT
  const handleMintNFT = async (packIndex) => {
    try {
      setLoading(true)
      setTxHash('')
      setLoadingMessage('Preparing to mint...')
      
      setLoadingMessage('Minting your NFT...')
      const result = await contract.mintNFT(packIndex).send({
        feeLimit: 1000000000,
      })
      
      if (result) {
        setTxHash(result)
      }
      
      setLoadingMessage('NFT minted! Updating collection...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      await loadUserData(tronWeb, contract, address)
      
      alert('✅ NFT minted successfully!')
    } catch (error) {
      console.error('Error minting NFT:', error)
      alert('Failed to mint NFT: ' + error.message)
    } finally {
      setLoading(false)
      setLoadingMessage('')
      setTxHash('')
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.tronLink && window.tronLink.ready) {
      connectWallet()
    }
  }, [])

  return (
    <>
      <Head>
        <title>TRON Pack to NFT System</title>
        <meta name="description" content="Stake TRX, buy packs, mint NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-slate-950">
        {/* Fancy Loader Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl max-w-md w-full mx-4">
              <div className="flex flex-col items-center space-y-6">
                {/* Animated Spinner */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 border-r-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 border-r-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                </div>
                
                {/* Loading Text */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Processing</h3>
                  <p className="text-slate-400 text-sm">{loadingMessage}</p>
                </div>
                
                {/* Animated Dots */}
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>

                {/* Transaction Hash and Actions */}
                {txHash && (
                  <div className="w-full space-y-3 pt-4 border-t border-slate-700">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                      <p className="text-xs text-slate-400 mb-1">Transaction Hash:</p>
                      <p className="text-xs text-cyan-400 font-mono break-all">{txHash}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {/* Refresh Button */}
                      <button
                        onClick={refreshData}
                        className="flex-1 flex items-center justify-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Refresh</span>
                      </button>
                      
                      {/* Explorer Link */}
                      <a
                        href={`https://shasta.tronscan.org/#/transaction/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-2 bg-purple-600/80 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Explorer</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Helpful Tips */}
                {!txHash && loadingMessage.includes('Waiting') && (
                  <div className="w-full pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400 text-center">
                      💡 Shasta testnet can take 30-60 seconds for confirmation
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-2xl">
                  🎁
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    TRON NFT Marketplace
                  </h1>
                  <p className="text-xs text-slate-400">Stake · Purchase · Mint</p>
                </div>
              </div>
              
              {!address ? (
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                  <span className="relative flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
                  </span>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={refreshData}
                    disabled={loading}
                    className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700 transition-all disabled:opacity-50"
                    title="Refresh data"
                  >
                    <svg className={`w-5 h-5 text-slate-300 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-3 bg-slate-800/50 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300 font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {address ? (
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                      💰
                    </div>
                    <div className="text-xs font-semibold text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                      STAKED
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-slate-400 mb-1">Total Staked</h3>
                  <p className="text-3xl font-bold text-white">{stakeInfo.amount}</p>
                  <p className="text-sm text-slate-500 mt-1">TRX</p>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-2xl">
                      ⚡
                    </div>
                    <div className="text-xs font-semibold text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-full">
                      CREDITS
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-slate-400 mb-1">Bandwidth Credits</h3>
                  <p className="text-3xl font-bold text-white">{stakeInfo.credits}</p>
                  <p className="text-sm text-slate-500 mt-1">Available (5 needed to mint)</p>
                </div>
              </div>
              
              <div className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 hover:border-pink-500/50 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center text-2xl">
                      🎁
                    </div>
                    <div className="text-xs font-semibold text-pink-400 bg-pink-500/20 px-3 py-1 rounded-full">
                      INVENTORY
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-slate-400 mb-1">My Packs</h3>
                  <p className="text-3xl font-bold text-white">{userPacks.length}</p>
                  <p className="text-sm text-slate-500 mt-1">Ready to mint</p>
                </div>
              </div>
            </div>

            {/* Rest of your UI remains the same... */}
            {/* Stake/Unstake Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Stake */}
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Stake TRX</h2>
                    <p className="text-sm text-slate-400">Earn 10 credits per 1 TRX</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (TRX)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium">
                      TRX
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">You will receive:</span>
                    <span className="text-green-400 font-bold">
                      {stakeAmount ? (parseFloat(stakeAmount) * 10).toFixed(0) : '0'} credits
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleStake}
                  disabled={loading || !stakeAmount}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? 'Processing...' : 'Stake Now'}
                </button>
              </div>

              {/* Unstake */}
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Unstake TRX</h2>
                    <p className="text-sm text-slate-400">Withdraw your staked TRX</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Amount (TRX)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      placeholder="0.00"
                      max={stakeInfo.amount}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium">
                      TRX
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-700">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Available to unstake:</span>
                    <span className="text-white font-bold">{stakeInfo.amount} TRX</span>
                  </div>
                </div>
                
                <button
                  onClick={handleUnstake}
                  disabled={loading || !unstakeAmount}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? 'Processing...' : 'Unstake Now'}
                </button>
              </div>
            </div>

            {/* Available Packs */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                    🛒
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Available Packs</h2>
                    <p className="text-sm text-slate-400">Purchase packs to mint NFTs</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePacks.map((pack) => (
                  <div key={pack.id} className="group relative bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500/50 transition-all transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative p-4">
                      <div className="w-full aspect-square bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-lg mb-4 flex items-center justify-center text-5xl shadow-lg">
                        🎁
                      </div>
                      
                      <h3 className="font-bold text-white mb-1">Pack #{pack.id}</h3>
                      <p className="text-sm text-slate-400 mb-4">Price: {pack.price} TRX</p>
                      
                      <button
                        onClick={() => handlePurchasePack(pack.id, pack.price)}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all"
                      >
                        Buy for {pack.price} TRX
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My Packs */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
                    📦
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">My Packs</h2>
                    <p className="text-sm text-slate-400">Mint NFTs using 5 bandwidth credits</p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-cyan-400 bg-cyan-500/20 px-4 py-2 rounded-full">
                  {userPacks.length} packs
                </div>
              </div>
              
              {userPacks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 opacity-50">📦</div>
                  <p className="text-slate-400 text-lg">No packs yet</p>
                  <p className="text-slate-500 text-sm mt-2">Purchase packs from the marketplace above</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {userPacks.map((pack, index) => (
                    <div key={index} className="group relative bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all transform hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative p-4">
                        <div className="w-full aspect-square bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 rounded-lg mb-4 flex items-center justify-center text-5xl shadow-lg">
                          📦
                        </div>
                        
                        <h3 className="font-bold text-white mb-1">Pack #{pack.id}</h3>
                        <p className="text-xs text-slate-400 mb-4">Price: {pack.price} TRX</p>
                        
                        <button
                          onClick={() => handleMintNFT(index)}
                          disabled={loading || parseInt(stakeInfo.credits) < 5}
                          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {parseInt(stakeInfo.credits) < 5 ? '⚠️ Need 5 Credits' : '✨ Mint NFT'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My NFTs */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl">
                    🎨
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">My NFT Collection</h2>
                    <p className="text-sm text-slate-400">Your minted NFTs</p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-pink-400 bg-pink-500/20 px-4 py-2 rounded-full">
                  {userNFTs.length} NFTs
                </div>
              </div>
              
              {userNFTs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 opacity-50">🎨</div>
                  <p className="text-slate-400 text-lg">No NFTs yet</p>
                  <p className="text-slate-500 text-sm mt-2">Mint NFTs from your packs above</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {userNFTs.map((nft) => (
                    <div key={nft.id} className="group relative bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700 hover:border-pink-500/50 transition-all transform hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative p-4">
                        <div className="relative w-full aspect-square bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 rounded-lg mb-4 flex items-center justify-center text-5xl shadow-lg overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <span className="relative z-10">🎨</span>
                          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white font-mono">
                            #{nft.id}
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-white mb-1 truncate">NFT #{nft.id}</h3>
                        <p className="text-xs text-slate-400 mb-1">From Pack #{nft.packId}</p>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{nft.mintedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl">
                🔗
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Connect Your Wallet</h2>
              <p className="text-slate-400 mb-8">Connect your TronLink wallet to start staking, purchasing packs, and minting NFTs</p>
              
              <button
                onClick={connectWallet}
                disabled={loading}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white overflow-hidden transition-all hover:scale-105 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  )
}
