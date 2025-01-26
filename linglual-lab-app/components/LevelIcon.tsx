'use client'

import { Star, Trophy, Award, Medal, Crown } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const LEVEL_DESCRIPTIONS = {
  'Beginner': '기초적인 문장 구조와 어휘 사용',
  'Intermediate': '다양한 문장 구조와 적절한 어휘 활용',
  'Upper Intermediate': '자연스러운 표현과 복잡한 문장 구사',
  'Advanced': '세련된 표현과 풍부한 어휘 구사',
  'Master': '원어민 수준의 자연스러운 표현'
} as const

interface LevelIconProps {
  level: keyof typeof LEVEL_DESCRIPTIONS
}

export function LevelIcon({ level }: LevelIconProps) {
  const icon = (() => {
    switch (level) {
      case 'Beginner':
        return <Star className="w-5 h-5 text-yellow-500" />
      case 'Intermediate':
        return <Trophy className="w-5 h-5 text-blue-500" />
      case 'Upper Intermediate':
        return <Award className="w-5 h-5 text-green-500" />
      case 'Advanced':
        return <Medal className="w-5 h-5 text-purple-500" />
      case 'Master':
        return <Crown className="w-5 h-5 text-red-500" />
    }
  })()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {icon}
        </TooltipTrigger>
        <TooltipContent>
          <p>{level}</p>
          <p className="text-xs text-muted-foreground">{LEVEL_DESCRIPTIONS[level]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 