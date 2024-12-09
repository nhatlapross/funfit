"use client"
import React, { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const initialNFTs = [
  { 
    id: 1, 
    name: "Fitness Achievement #1", 
    image: "/avatar/bear1.png",
    level: 3,
    days: 45,
    points: 1250,
    isUsing: false,
    isSelling: false,
    bonus: {
      calories: 250,
      workoutDays: 15,
      adalevel: 1
    }
  },
  { 
    id: 2, 
    name: "Cardano Summit Badge", 
    image: "/avatar/cat1.png",
    level: 2,
    days: 30,
    points: 875,
    isUsing: false,
    isSelling: false,
    bonus: {
      calories: 150,
      workoutDays: 10,
      adalevel: 2
    }
  },
  { 
    id: 3, 
    name: "Workout Milestone", 
    image: "/avatar/chicken1.png",
    level: 4,
    days: 60,
    points: 1750,
    isUsing: false,
    isSelling: false,
    bonus: {
      calories: 350,
      workoutDays: 20,
      adalevel: 3
    }
  },
  { 
    id: 4, 
    name: "Virtual Gym Pass", 
    image: "/avatar/pig1.png",
    level: 1,
    days: 15,
    points: 450,
    isUsing: false,
    isSelling: false,
    bonus: {
      calories: 100,
      workoutDays: 5,
      adalevel: 1
    }
  },
]

export default function NFTSlider({ onNFTUse }) {
  const [nfts, setNFTs] = useState(initialNFTs)
  const [selectedNFT, setSelectedNFT] = useState(null)

  const handleNFTClick = (nft) => {
    // Only allow clicking on NFTs that are not selling
    if (!nft.isSelling) {
      setSelectedNFT(nft)
    }
  }

  const handleCloseModal = () => {
    setSelectedNFT(null)
  }

  const handleUseNFT = () => {
    const updatedNFTs = nfts.map(nft => {
      if (nft.id === selectedNFT.id) {
        // Toggle use status
        const newIsUsing = !nft.isUsing
        return { 
          ...nft, 
          isUsing: newIsUsing,
          isSelling: false // Cancel selling when using
        }
      }
      return { 
        ...nft, 
        isUsing: false, // Unuse other NFTs
        isSelling: false // Ensure other NFTs are not in selling mode
      }
    })
    
    // Find the used NFT to pass bonus information
    const usedNFT = updatedNFTs.find(nft => nft.id === selectedNFT.id && nft.isUsing)
    
    setNFTs(updatedNFTs)
    // Call the callback to update parent component
    onNFTUse && onNFTUse(usedNFT ? usedNFT : null)
    handleCloseModal()
  }

  const handleSellNFT = () => {
    const updatedNFTs = nfts.map(nft => 
      nft.id === selectedNFT.id 
        ? { ...nft, isSelling: true, isUsing: false } 
        : { ...nft, isSelling: false, isUsing: false }
    )
    
    setNFTs(updatedNFTs)
    handleCloseModal()
  }

  const CheckOnchain = () => {

  }

  const handleCancelSell = (nftId) => {
    const updatedNFTs = nfts.map(nft => 
      nft.id === nftId 
        ? { ...nft, isSelling: false } 
        : nft
    )
    
    setNFTs(updatedNFTs)
  }

  return (
    <>
      <Carousel className="w-full max-w-xs mx-auto">
        <CarouselContent>
          {nfts.map((nft) => (
            <CarouselItem key={nft.id}>
              <Card>
                <CardContent 
                  className={`
                    flex aspect-square items-center justify-center p-6 relative 
                    hover:bg-gray-800 cursor-pointer
                    transition-colors duration-200
                    ${nft.isUsing ? "border-2 border-green-500" : ""}
                    ${nft.isSelling ? "opacity-50" : ""}
                  `}
                  onClick={() => handleNFTClick(nft)}
                >
                  <div className="text-center">
                    <div className="relative">
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        width={150}
                        height={150}
                        className="mx-auto mb-2 rounded-lg"
                      />
                      {nft.isUsing && (
                        <Badge 
                          variant="default" 
                          className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4"
                        >
                          Using
                        </Badge>
                      )}
                      {nft.isSelling && (
                        <Badge 
                          variant="destructive" 
                          className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4"
                        >
                          Selling
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold">{nft.name}</h4>
                    {nft.isSelling && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCancelSell(nft.id)
                        }}
                      >
                        Cancel Sell
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {selectedNFT && !selectedNFT.isSelling && (
        <Dialog open={!!selectedNFT} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>{selectedNFT.name}</DialogTitle>
              <DialogDescription>NFT Details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Image
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  width={100}
                  height={100}
                  className="col-span-2 mx-auto rounded-lg"
                />
                <div className="col-span-2 space-y-2">
                  <p><strong>Level:</strong> {selectedNFT.level}</p>
                  <p><strong>Days:</strong> {selectedNFT.days}</p>
                  <p><strong>Points:</strong> {selectedNFT.points}</p>
                </div>
              </div>
              <div className="flex justify-between space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleUseNFT}
                  className="w-full hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                >
                  {selectedNFT.isUsing ? "Unuse NFT" : "Use NFT"}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={CheckOnchain}
                  className="w-full hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                >
                  Check on-chain
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}