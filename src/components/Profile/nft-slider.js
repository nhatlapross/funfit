"use client"

import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const nfts = [
  { id: 1, name: "Fitness Achievement #1", image: "/avatar/bear1.png" },
  { id: 2, name: "Cardano Summit Badge", image: "/avatar/cat1.png" },
  { id: 3, name: "Workout Milestone", image: "/avatar/chicken1.png" },
  { id: 4, name: "Virtual Gym Pass", image: "/avatar/pig1.png" },
]

export default function NFTSlider() {
  return (
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {nfts.map((nft) => (
          <CarouselItem key={nft.id}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <div className="text-center">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    width={150}
                    height={150}
                    className="mx-auto mb-2 rounded-lg"
                  />
                  <h4 className="font-semibold">{nft.name}</h4>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

