import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import NFTSlider from "./nft-slider"
import { Dumbbell, Flame, Footprints, Coins } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4 space-y-6 bg-gray-900 text-white">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/avatar/buffalo1.png" alt="User avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">Cardano Fitness Enthusiast</CardTitle>
            <p className="text-muted-foreground">Pushing limits, one block at a time.</p>
          </div>
        </CardHeader>
        <CardContent>
          <p>Blockchain developer by day, fitness junkie by night. Leveraging Cardano for a healthier future.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fitness Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Footprints className="text-blue-500" />
              <span>Steps</span>
            </div>
            <span className="font-bold">8,234 / 10,000</span>
          </div>
          <Progress value={82} />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="text-red-500" />
              <span>Calories Burned</span>
            </div>
            <span className="font-bold">1,567 kcal</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Dumbbell className="text-green-500" />
              <span>Workouts Completed</span>
            </div>
            <span className="font-bold">5 this week</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cardano Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="text-yellow-500" />
              <span>ADA Balance</span>
            </div>
            <span className="font-bold">1,234.56 ADA</span>
          </div>
          <div className="w-full">
            <h3 className="font-semibold mb-2">NFT Collection</h3>
            <NFTSlider />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
