import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyHackathon from './MyHackathon';
import AllHackathon from './AllHackathon';
import { BrowserWallet, Transaction } from '@martifylabs/mesh';

const FitnessHackathonSlider = () => {
    const [activeTab, setActiveTab] = useState('market');
    const [myNFTs, setMyNFTs] = useState([]);
    const [hash, setHash] = useState('');

    const handleJoinHackathon = async (hackathon) => {
        // Generate a unique NFT for the joined hackathon
        const newNFT = {
            ...hackathon,
            nftId: `NFT-${hackathon.id}-${Date.now()}`,
            claimedAt: new Date().toLocaleString()
        };
        setHash('');

        try {
            await sendLace()
        }
        catch (error) {
            alert("Please check your wallet connection and try again")
            console.log(error);
        }

        // Add the new NFT to the collection
        setMyNFTs(prevNFTs => [...prevNFTs, newNFT]);

        
    };

    useEffect(() => {
        if (hash != '') {

            // Switch to My Hackathon tab
            setActiveTab('my-nfts');
        }
    }, [hash])

    const sendLace = async () => {
        const wallet = await BrowserWallet.enable('Nami');
        const tx = new Transaction({ initiator: wallet })
            .sendLovelace(
                "addr_test1qpkaf3r2xt85j7h3hvx4xtmltcuaegzjyz05ve3czyrtr9g0xlr37m45stpvqn03yfezxfgzrezntprt4u8t2jld4t7shz7cpa",
                "1000000"
            )

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        console.log(txHash);
        setHash(txHash);
    }

    return (
        <div className="w-full h-full">
            <div className="bg-gray-900 p-4">
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
                            All Hackathon
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
                            My Hackathon
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="market" className="pt-6">
                        <AllHackathon onJoinHackathon={handleJoinHackathon} />
                    </TabsContent>
                    <TabsContent value="my-nfts" className="pt-6">
                        <MyHackathon myNFTs={myNFTs} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default FitnessHackathonSlider;