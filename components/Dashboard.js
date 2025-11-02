export default function Dashboard({ userData, balance }) {
    const stats = [
      {
        label: 'Wallet Balance',
        value: `${parseFloat(balance).toFixed(2)} TRX`,
        icon: '💰',
        color: 'from-green-500 to-emerald-500'
      },
      {
        label: 'Staked Amount',
        value: `${parseFloat(userData.stakedAmount).toFixed(2)} TRX`,
        icon: '🔒',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        label: 'Bandwidth Credits',
        value: userData.bandwidthCredits,
        icon: '⚡',
        color: 'from-purple-500 to-pink-500'
      },
      {
        label: 'Packs Owned',
        value: userData.packs.length,
        icon: '📦',
        color: 'from-orange-500 to-red-500'
      },
      {
        label: 'NFTs Minted',
        value: userData.nfts.length,
        icon: '🎨',
        color: 'from-pink-500 to-rose-500'
      }
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`}></div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  }
  