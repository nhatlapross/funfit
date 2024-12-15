'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NFTCard from '@/components/MarketPlace/nft-card'
import SellNFTModal from '@/components/MarketPlace/sell-nft-modal'
import BuyNFTModal from '@/components/MarketPlace/buy-nft-modal'
import { BrowserWallet, Transaction } from '@martifylabs/mesh';

const mockNFTs = [
    { 
        id: '1', 
        name: 'Cool Cat #1', 
        image: '/avatar/bear1.png', 
        price: null, 
        owner: '0x1234...5678',
        level: 3,
        days: 45,
        points: 750
    },
    { 
        id: '2', 
        name: 'Bored Ape #42', 
        image: '/avatar/bear2.png', 
        price: 1.5, 
        owner: '0xMarket',
        level: 5,
        days: 60,
        points: 1200
    },
    { 
        id: '3', 
        name: 'Punk #007', 
        image: '/avatar/buffalo1.png', 
        price: 2.0, 
        owner: '0xMarket',
        level: 4,
        days: 55,
        points: 1000
    },
    { 
        id: '4', 
        name: 'Doodle #123', 
        image: '/avatar/buffalo2.png', 
        price: null, 
        owner: '0x1234...5678',
        level: 2,
        days: 30,
        points: 500
    },
    { 
        id: '5', 
        name: 'Punk #007', 
        image: '/avatar/pig1.png', 
        price: 2.0, 
        owner: '0xMarket',
        level: 6,
        days: 75,
        points: 1500
    },
    { 
        id: '6', 
        name: 'Doodle #123', 
        image: '/avatar/pig2.png', 
        price: null, 
        owner: '0x1234...5678',
        level: 1,
        days: 15,
        points: 250
    }
]


export default function NFTMarketplace() {
    const [nfts, setNfts] = useState(mockNFTs)
    const [selectedNFT, setSelectedNFT] = useState(null)
    const [isSellModalOpen, setIsSellModalOpen] = useState(false)
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('market')
    const [hash, setHash] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isBuy, setIsBuy] = useState(false);
    const [isSell, setIsSell] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const handleSellNFT = (nft) => {
        setSelectedNFT(nft)
        setIsSellModalOpen(true)
        setIsLoading(true)
        setIsSell(true)
    }

    const handleBuyNFT = (nft) => {
        setSelectedNFT(nft)
        setIsBuyModalOpen(true)
        setIsLoading(true)
        setIsBuy(true)
    }

    const handleSetPrice = async(price) => {
        setHash('');
        setSelectedPrice(price);
        
        if (selectedNFT && isLoading) {
            setIsLoading(false);
            
            try{
                await sendLace(price)
              }
              catch(error){
                alert("Please check your wallet connection and try again")
                console.log(error);
            }
            // setIsSellModalOpen(false)
        }
    }

     useEffect(()=>{
        if(hash != '' && isSellModalOpen && selectedNFT && isSell){
            const updatedNFTs = nfts.map((nft) =>
                nft.id === selectedNFT.id ? { ...nft, price: selectedPrice, owner: '0xMarket' } : nft
            )
            console.log("sell:",updatedNFTs);
            setNfts(updatedNFTs)
            setIsSell(false)
            setIsSellModalOpen(false)
        }
        if(hash != '' && isBuyModalOpen && selectedNFT && isBuy){
            console.log(selectedNFT);
            const updatedNFTs = nfts.map((nft) =>
                nft.id === selectedNFT.id ? { ...nft, price: null, owner: '0x1234...5678' } : nft
            )
            console.log("buy:",updatedNFTs);
            setNfts(updatedNFTs)
            setIsBuy(false)
            setIsBuyModalOpen(false)
        }
      },[hash])

    const sendLace = async (num) => {
        const wallet = await BrowserWallet.enable('Nami');
        const tx = new Transaction({ initiator: wallet })
          .sendLovelace(
            "addr_test1qpkaf3r2xt85j7h3hvx4xtmltcuaegzjyz05ve3czyrtr9g0xlr37m45stpvqn03yfezxfgzrezntprt4u8t2jld4t7shz7cpa",
            (num * 1000000).toString()
          )
    
        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash);
        setHash(txHash);
      }

    const handleBuy = async() => {
        if (selectedNFT && isLoading) {
            setIsLoading(false);
           
            try{
                await sendLace(selectedNFT.price)
            }
            catch(error){
                alert("Please check your wallet connection and try again")
                console.log(error);
            }
        }
    }

    const marketNFTs = nfts.filter((nft) => nft.owner === '0xMarket')
    const myNFTs = nfts.filter((nft) => nft.owner === '0x1234...5678')

    return (
        <div className="bg-gray-900 min-h-screen p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 bg-transparent border-gray-700">
                    <TabsTrigger
                        value="market"
                        className={`
                                px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-300 ease-in-out
                                ${activeTab === 'market'
                                ? 'text-white border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent hover:border-gray-600'}
                            `}
                    >
                        Market
                    </TabsTrigger>
                    <TabsTrigger
                        value="my-nfts"
                        className={`
                                px-6 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-300 ease-in-out
                                ${activeTab === 'my-nfts'
                                ? 'text-white border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent hover:border-gray-600'}
                            `}
                    >
                        My NFTs
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="market" className="pt-6">
                    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-16">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                <TabsContent value="my-nfts" className="pt-6">
                    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-16">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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