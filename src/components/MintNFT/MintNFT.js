"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingAnimation } from "@/components/MintNFT/loading-animation"
import { ConfettiEffect } from "@/components/MintNFT/confetti-effect"
import Image from 'next/image'

export default function MintNFTPage() {
  const [isMinting, setIsMinting] = useState(false)
  const [nftName, setNftName] = useState('')
  const [mintedNFT, setMintedNFT] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

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
    e.preventDefault()
    setIsMinting(true)
    // Select a random image
    const randomImage = avatarImages[Math.floor(Math.random() * avatarImages.length)]
  
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsMinting(false)
    setMintedNFT(randomImage)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)
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
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
      {showConfetti && <ConfettiEffect />}
    </div>
  )
}