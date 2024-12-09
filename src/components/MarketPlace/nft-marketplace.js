'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NFTCard from '@/components/MarketPlace/nft-card'
import SellNFTModal from '@/components/MarketPlace/sell-nft-modal'
import BuyNFTModal from '@/components/MarketPlace/buy-nft-modal'

const mockNFTs = [
    { id: '1', name: 'Cool Cat #1', image: '/avatar/bear1.png', price: null, owner: '0x1234...5678' },
    { id: '2', name: 'Bored Ape #42', image: '/avatar/bear2.png', price: 1.5, owner: '0xMarket' },
    { id: '3', name: 'Punk #007', image: '/avatar/buffalo1.png', price: 2.0, owner: '0xMarket' },
    { id: '4', name: 'Doodle #123', image: '/avatar/buffalo2.png', price: null, owner: '0x1234...5678' },
    { id: '5', name: 'Punk #007', image: '/avatar/pig1.png', price: 2.0, owner: '0xMarket' },
    { id: '6', name: 'Doodle #123', image: '/avatar/pig2.png', price: null, owner: '0x1234...5678' },
]

export default function NFTMarketplace() {
    const [nfts, setNfts] = useState(mockNFTs)
    const [selectedNFT, setSelectedNFT] = useState(null)
    const [isSellModalOpen, setIsSellModalOpen] = useState(false)
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('market')

    const handleSellNFT = (nft) => {
        setSelectedNFT(nft)
        setIsSellModalOpen(true)
    }

    const handleBuyNFT = (nft) => {
        setSelectedNFT(nft)
        setIsBuyModalOpen(true)
    }

    const handleSetPrice = (price) => {
        if (selectedNFT) {
            const updatedNFTs = nfts.map((nft) =>
                nft.id === selectedNFT.id ? { ...nft, price, owner: '0xMarket' } : nft
            )
            setNfts(updatedNFTs)
            setIsSellModalOpen(false)
        }
    }

    const handleBuy = () => {
        if (selectedNFT) {
            const updatedNFTs = nfts.map((nft) =>
                nft.id === selectedNFT.id ? { ...nft, price: null, owner: '0x1234...5678' } : nft
            )
            setNfts(updatedNFTs)
            setIsBuyModalOpen(false)
        }
    }

    const marketNFTs = nfts.filter((nft) => nft.owner === '0xMarket')
    const myNFTs = nfts.filter((nft) => nft.owner === '0x1234...5678')

    return (
        <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-600">
                    <TabsTrigger
                        value="market"
                        className={`px-4 py-2 text-center ${activeTab === 'market'
                            ? 'bg-blue-500 text-white' // Active tab styles
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' // Inactive tab styles
                            }`}
                    >
                        Market
                    </TabsTrigger>
                    <TabsTrigger
                        value="my-nfts"
                        className={`px-4 py-2 text-center ${activeTab === 'my-nfts'
                            ? 'bg-blue-500 text-white' // Active tab styles
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white' // Inactive tab styles
                            }`}
                    >
                        My NFTs
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="market">
                    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {marketNFTs.map((nft) => (
                                <NFTCard
                                    key={nft.id}
                                    nft={nft}
                                    onSell={() => { }}
                                    onBuy={() => handleBuyNFT(nft)}
                                    isOwner={false}
                                    showSellButton={false}
                                />
                            ))}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="my-nfts">
                    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {myNFTs.map((nft) => (
                                <NFTCard
                                    key={nft.id}
                                    nft={nft}
                                    onSell={() => handleSellNFT(nft)}
                                    onBuy={() => { }}
                                    isOwner={true}
                                    showSellButton={true}
                                />
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            {selectedNFT && (
                <>
                    <SellNFTModal
                        isOpen={isSellModalOpen}
                        onClose={() => setIsSellModalOpen(false)}
                        onSetPrice={handleSetPrice}
                        nft={selectedNFT}
                    />
                    <BuyNFTModal
                        isOpen={isBuyModalOpen}
                        onClose={() => setIsBuyModalOpen(false)}
                        onBuy={handleBuy}
                        nft={selectedNFT}
                    />
                </>
            )}
        </div>
    )
}
