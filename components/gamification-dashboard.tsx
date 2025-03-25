'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GamificationStats } from './gamification-stats'
import { MissionsPanel } from './missions-panel'
import { AchievementsPanel } from './achievements-panel'

export function GamificationDashboard() {
  return (
    <div className="space-y-6">
      <GamificationStats />
      
      <Tabs defaultValue="missions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="missions">
          <MissionsPanel />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
} 