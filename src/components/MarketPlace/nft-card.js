import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function NFTCard({ nft, onSell, onBuy, isOwner, showSellButton }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Image src={nft.image} alt={nft.name} width={300} height={300} className="w-full h-auto" />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <h3 className="text-lg font-semibold mb-2">{nft.name}</h3>
        {nft.price ? (
          <p className="text-sm text-gray-500 mb-4">{nft.price} ETH</p>
        ) : (
          <p className="text-sm text-gray-500 mb-4">Not for sale</p>
        )}
        {isOwner && showSellButton && (
          <Button onClick={onSell} variant="outline">Sell</Button>
        )}
        {!isOwner && nft.price !== null && (
          <Button onClick={onBuy}>Buy</Button>
        )}
      </CardFooter>
    </Card>
  )
}

