import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Coins } from "lucide-react"

interface ProfileHeaderProps {
  username: string
  tokenBalance: string
  followers: number
  following: number
}

export function ProfileHeader({ username, tokenBalance, followers, following }: ProfileHeaderProps) {
  return (
    <Card className="border-0 rounded-none">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt={username} />
            <AvatarFallback className="text-2xl">{username[0]}</AvatarFallback>
          </Avatar>

          <h2 className="text-xl font-bold">@{username}</h2>

          <div className="flex items-center mt-2 mb-4 bg-primary/10 rounded-full px-4 py-2">
            <Coins className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">{tokenBalance} tokens</span>
          </div>

          <div className="flex w-full justify-around mb-4">
            <div className="text-center">
              <p className="font-bold">{followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold">12</p>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <Button className="flex-1">Edit Profile</Button>
            <Button variant="outline" className="flex-1">
              <Coins className="h-4 w-4 mr-2" />
              Withdraw Tokens
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

