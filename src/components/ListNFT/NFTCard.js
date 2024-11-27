import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NFTCard({ nft }) {
  return (
    <Card>
      <CardHeader className="p-0">
        <Image
          src={nft.image}
          alt={nft.name}
          width={400}
          height={400}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{nft.name}</CardTitle>
        <p className="text-sm font-semibold mb-2">Missions:</p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {nft.missions.map((mission, index) => (
            <li key={index}>{mission}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

