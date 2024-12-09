import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import NFTSlider from "./nft-slider"
import { Dumbbell, Flame, Footprints, Coins, PersonStanding } from 'lucide-react'
import CardanoIcon from "@/asset/icon/CardanoIcon"

// NFT-specific user profiles
const nftProfiles = {
  default: {
    avatar: "/avatar/buffalo1.png",
    title: "Cardano Fitness Enthusiast",
    subtitle: "Pushing limits, one block at a time.",
    description: "Blockchain developer by day, fitness junkie by night. Leveraging Cardano for a healthier future."
  },
  1: {
    avatar: "/avatar/bear1.png",
    title: "Fitness Achievement Master",
    subtitle: "Breaking barriers, building strength",
    description: "Transforming physical limits through consistent dedication and blockchain-powered motivation."
  },
  2: {
    avatar: "/avatar/cat1.png",
    title: "Cardano Summit Champion",
    subtitle: "Networking fitness with blockchain",
    description: "Connecting community, technology, and personal wellness through innovative blockchain solutions."
  },
  3: {
    avatar: "/avatar/chicken1.png",
    title: "Workout Milestone Breaker",
    subtitle: "Elevating fitness to new heights",
    description: "Strategically approaching fitness with data-driven insights and blockchain-backed accountability."
  },
  4: {
    avatar: "/avatar/pig1.png",
    title: "Virtual Fitness Innovator",
    subtitle: "Reimagining personal wellness",
    description: "Pioneering a new era of fitness through digital motivation and decentralized tracking."
  }
}

export default function ProfilePage() {
  const [userStats, setUserStats] = useState({
    level: 10,
    caloriesBurned: 1567,
    workoutDays: 68,
    adalevel: 1,
    currentNFT: null
  })

  const handleNFTUse = (data) => {
    console.log(data);
    if (data) {
      setUserStats(prevStats => ({
        level: data.level,
        caloriesBurned: data?.bonus?.calories,
        workoutDays: data.days,
        adalevel: data?.bonus.adalevel,
        currentNFT: data?.bonus.adalevel
      }))
    } else {
      // Reset to base stats when no NFT is used
      setUserStats({
        level: 10,
        caloriesBurned: 1567,
        workoutDays: 68,
        adalevel: 1,
        currentNFT: null
      })
    }
  }

  // Determine current profile based on used NFT
  const currentProfile = userStats.currentNFT 
    ? nftProfiles[userStats.currentNFT] 
    : nftProfiles.default

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gray-900 text-white">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar className="w-24 h-24">
            <AvatarImage 
              src={currentProfile.avatar} 
              alt="User avatar" 
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{currentProfile.title}</CardTitle>
            <p className="text-muted-foreground">{currentProfile.subtitle}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p>{currentProfile.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fitness Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PersonStanding className="text-blue-500" />
              <span>Level</span>
            </div>
            <span className="font-bold">{userStats.level}</span>
          </div>
          <Progress value={82} />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="text-red-500" />
              <span>Calories Burned</span>
            </div>
            <span className="font-bold">{userStats.caloriesBurned} kcal</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Dumbbell className="text-green-500" />
              <span>Workouts Completed</span>
            </div>
            <span className="font-bold">{userStats.workoutDays} days</span>
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
              <CardanoIcon />
              <span>ADA</span>
            </div>
            <span className="font-bold">100</span>
          </div>
          <div className="w-full">
            <h3 className="font-semibold mb-2">NFT Collection</h3>
            <NFTSlider onNFTUse={handleNFTUse} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}