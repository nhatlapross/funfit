import NFTMarketplace from '@/components/MarketPlace/nft-marketplace'

export default function Home() {
    return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white flex items-center justify-center">
            <div className="w-full">
                <NFTMarketplace />
            </div>
        </div>
    )
}

