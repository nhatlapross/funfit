import React from "react"
import { NFTCard } from "@/components/ListNFT/NFTCard"
import { nfts } from "@/data/nfts"

export default function NFTMissionsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">NFT Missions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  )
}