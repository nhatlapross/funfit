"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingAnimation } from "@/components/MintNFT/loading-animation"
import { ConfettiEffect } from "@/components/MintNFT/confetti-effect"
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useWallet, useAddress } from '@martifylabs/mesh-react';
import { BrowserWallet, Transaction, ForgeScript } from '@martifylabs/mesh';

export default function MintNFTPage() {
  const [isMinting, setIsMinting] = useState(false)
  const [nftName, setNftName] = useState('')
  const [mintedNFT, setMintedNFT] = useState(null)
  const [hash, setHash] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const router = useRouter();
  const address = useAddress();
  
  // Array of avatar image paths
  const avatarImages = [
      '/avatar/bear1.png',
      '/avatar/bear2.png',
      '/avatar/buffalo1.png',
      '/avatar/buffalo2.png',
      '/avatar/cat1.png',
      '/avatar/cat2.png',
      '/avatar/chicken1.png',
      '/avatar/chicken2.png',
      '/avatar/pig1.png',
      '/avatar/pig2.png',
      '/avatar/tiger1.png',
      '/avatar/tiger2.png',
  ]

  const handleMint = async (e) => {
    setMintedNFT(null);
    e.preventDefault();
    setIsMinting(true);
    setHash('');

    // Simulate minting process
    //await new Promise(resolve => setTimeout(resolve, 3000))

    try{
      // await sendLace()
      await mintNFT()
    }
    catch(error){
      console.log(error);
      alert("Please check your wallet connection and try again")
      setIsMinting(false);
    }
    
  }

  useEffect(()=>{
    if(hash != ''){
      // Select a random image
      const randomImage = avatarImages[Math.floor(Math.random() * avatarImages.length)]
  
      setIsMinting(false)
      setMintedNFT(randomImage)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  },[hash])

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

  const mintNFT = async () => {
    console.log(address);
    const randomImage = avatarImages[Math.floor(Math.random() * avatarImages.length)]
    const forgingScript = ForgeScript.withOneSignature(address);
    const assetMetadata = {
      "name": nftName,
      "image": randomImage,
      "mediaType": "image/png",
      "description": "Funfit AI Trainer NFT."
    };
    
    const asset = {
      assetName: 'MeshToken',
      assetQuantity: '1',
      metadata: assetMetadata,
      label: '721',
      recipient: 'addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr' 
    };
    const wallet = await BrowserWallet.enable('Nami');

    const tx = new Transaction({ initiator: wallet });
    tx.mintAsset(
      forgingScript,
      asset,
    );

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    console.log(txHash);
    setHash(txHash);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-2">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mint Your NFT</CardTitle>
          <CardDescription>Enter a name for your new NFT and click mint!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMint}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nftName">NFT Name</Label>
                <Input 
                  id="nftName" 
                  placeholder="Enter NFT name" 
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button 
            type="submit" 
            onClick={handleMint}
            disabled={isMinting || !nftName.trim()}
            className="w-full"
          >
            {isMinting ? (
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingAnimation />
                <span className="ml-2">Minting...</span>
              </motion.div>
            ) : (
              'Mint NFT'
            )}
          </Button>
          <AnimatePresence>
            {mintedNFT && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                <p className="mb-4">Your NFT "{nftName}" has been minted successfully!</p>
                <div className="relative w-48 h-48 mx-auto border-4 border-white rounded-lg overflow-hidden">
                  <Image
                    src={mintedNFT}
                    alt={`Minted NFT: ${nftName}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <button className='border-2 border-white text-white mt-2' onClick={()=>router.push('/mission')}>Start your first exercise!</button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
      {showConfetti && <ConfettiEffect />}
    </div>
  )
}