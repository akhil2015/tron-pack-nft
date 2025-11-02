import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0)

    const steps = [
        {
            number: "01",
            title: "Connect Your Wallet",
            description: "Connect your TronLink wallet to the Shasta testnet. Make sure you have some test TRX in your wallet.",
            icon: "🔗",
            details: [
                "Install TronLink browser extension",
                "Switch to Shasta Testnet",
                "Get free test TRX from faucet",
                "Connect wallet to the dApp"
            ]
        },
        {
            number: "02",
            title: "Stake TRX",
            description: "Stake your TRX tokens to earn bandwidth credits. You get 10 credits for every 1 TRX staked.",
            icon: "💰",
            details: [
                "Enter amount of TRX to stake",
                "Confirm transaction in TronLink",
                "Receive bandwidth credits instantly",
                "Credits can be used to mint NFTs"
            ]
        },
        {
            number: "03",
            title: "Purchase Packs",
            description: "Buy mystery packs with TRX. Each pack contains a unique NFT waiting to be minted.",
            icon: "🎁",
            details: [
                "Browse available pack tiers",
                "Select pack to purchase",
                "Pay with TRX from your wallet",
                "Pack added to your inventory"
            ]
        },
        {
            number: "04",
            title: "Mint NFTs",
            description: "Use 5 bandwidth credits to mint an NFT from your pack. Each NFT is unique and permanently yours.",
            icon: "🎨",
            details: [
                "Select pack from your inventory",
                "Spend 5 bandwidth credits",
                "NFT is minted on blockchain",
                "View in your collection"
            ]
        }
    ]

    const features = [
        {
            icon: "⚡",
            title: "Bandwidth Credits",
            description: "Stake TRX to earn credits. Use credits to mint NFTs without paying gas fees for each mint."
        },
        {
            icon: "🔒",
            title: "Secure & Transparent",
            description: "All transactions are on-chain and verifiable. Your assets are secured by TRON blockchain."
        },
        {
            icon: "💎",
            title: "True Ownership",
            description: "Every NFT you mint is permanently yours. Trade, hold, or showcase your unique collection."
        },
        {
            icon: "🎯",
            title: "Easy to Use",
            description: "Simple 4-step process. No complex setup required. Start collecting NFTs in minutes."
        }
    ]

    const faqs = [
        {
            question: "What are bandwidth credits?",
            answer: "Bandwidth credits are earned by staking TRX. They allow you to mint NFTs without paying gas fees for each transaction. You earn 10 credits for every 1 TRX staked."
        },
        {
            question: "How much does it cost to mint an NFT?",
            answer: "Minting an NFT costs 5 bandwidth credits. You must first purchase a pack with TRX, then use credits to mint the NFT from that pack."
        },
        {
            question: "Can I unstake my TRX?",
            answer: "Yes! You can unstake your TRX at any time. However, unstaking will reduce your bandwidth credits proportionally to the amount unstaked."
        },
        {
            question: "What happens to my NFTs if I unstake?",
            answer: "Your NFTs remain permanently in your wallet. Unstaking only affects your ability to mint new NFTs by reducing your bandwidth credits."
        },
        {
            question: "How long does it take for transactions to confirm?",
            answer: "On Shasta testnet, transactions typically confirm within 30-60 seconds. You can track your transaction on the block explorer."
        },
        {
            question: "Are my NFTs transferable?",
            answer: "Yes! Your NFTs are stored on the TRON blockchain and can be transferred to other wallets or traded on compatible marketplaces."
        }
    ]

    return (
        <>
            <Head>
                <title>How It Works - TRON NFT Marketplace</title>
                <meta name="description" content="Learn how to stake TRX, buy packs, and mint NFTs" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className="min-h-screen bg-slate-950">
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
                            <div className="flex items-center space-x-8">
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

                                {/* Add this navigation link */}
                                <Link href="/how-it-works">
                                    <div className="text-slate-300 hover:text-white transition-colors text-sm font-medium hidden md:block">
                                        How It Works
                                    </div>
                                </Link>
                            </div>
                            <Link href="/">
                                <div className="flex items-center space-x-3 cursor-pointer">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-2xl">
                                        🎁
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                            TRON NFT Marketplace
                                        </h1>
                                        <p className="text-xs text-slate-400">How It Works</p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/">
                                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white hover:scale-105 transition-all">
                                    Launch App
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="relative z-10">
                    {/* Hero Section */}
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                        <div className="inline-block mb-4 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                            <span className="text-purple-400 font-semibold text-sm">📚 GETTING STARTED</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            How It <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Works</span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12">
                            Start your NFT journey in 4 simple steps. Stake TRX, earn credits, buy packs, and mint unique NFTs on the TRON blockchain.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/">
                                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white hover:scale-105 transition-all">
                                    Start Now →
                                </button>
                            </Link>

                            <a
                                href="https://www.trongrid.io/shasta"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-white transition-all"
                            >
                                Get Test TRX
                            </a>
                        </div>
                    </section>

                    {/* Steps Section */}
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">The Process</h2>
                            <p className="text-slate-400 text-lg">Follow these simple steps to start collecting NFTs</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    className={`relative cursor-pointer group transition-all ${activeStep === index ? 'scale-105' : 'hover:scale-102'
                                        }`}
                                >
                                    <div className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border transition-all ${activeStep === index
                                            ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                                            : 'border-slate-700 hover:border-slate-600'
                                        }`}>
                                        {/* Step Number */}
                                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                            {step.number}
                                        </div>

                                        {/* Icon */}
                                        <div className="text-6xl mb-4">{step.icon}</div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>

                                        {/* Description */}
                                        <p className="text-slate-400 text-sm">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Active Step Details */}
                        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-700">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="text-5xl">{steps[activeStep].icon}</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{steps[activeStep].title}</h3>
                                    <p className="text-slate-400">{steps[activeStep].description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {steps[activeStep].details.map((detail, index) => (
                                    <div key={index} className="flex items-start space-x-3 bg-slate-900/50 rounded-lg p-4">
                                        <div className="flex-shrink-0 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <p className="text-slate-300">{detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
                            <p className="text-slate-400 text-lg">Why choose our NFT marketplace</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all hover:scale-105"
                                >
                                    <div className="text-5xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                            <p className="text-slate-400 text-lg">Everything you need to know</p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <details
                                    key={index}
                                    className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700 hover:border-slate-600 transition-all overflow-hidden"
                                >
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                        <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                                        <svg
                                            className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <div className="px-6 pb-6">
                                        <p className="text-slate-400">{faq.answer}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-3xl p-12 text-center">
                            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
                            <p className="text-slate-300 text-lg mb-8">
                                Connect your wallet and start minting NFTs in minutes
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/">
                                    <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white hover:scale-105 transition-all">
                                        Launch App →
                                    </button>
                                </Link>

                                <a
                                    href="https://www.tronlink.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-white transition-all"
                                >
                                    Install TronLink
                                </a>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="relative z-10 border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-2xl">
                                        🎁
                                    </div>
                                    <span className="text-xl font-bold text-white">TRON NFT</span>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    The easiest way to collect NFTs on the TRON blockchain.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm">
                                            How It Works
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="https://shasta.tronscan.org" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm">
                                            Block Explorer
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-semibold mb-4">Resources</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="https://www.tronlink.org/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm">
                                            TronLink Wallet
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.trongrid.io/shasta" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm">
                                            Get Test TRX
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://developers.tron.network" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors text-sm">
                                            Documentation
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
                            <p>© 2025 TRON NFT Marketplace. Built on TRON Shasta Testnet.</p>
                        </div>
                    </div>
                </footer>
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
