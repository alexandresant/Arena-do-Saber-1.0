
import type { EvolutionResults } from '../types/types'

export function calculateEvolution(
    currentLevel: number,
    currentXp: number,
    xpGained: number
): EvolutionResults {
    let newExperience = currentXp + xpGained
    let newLevel = currentLevel
    let pointsToAssign = 0
    let levelUp = false

    //Fórmula: Cada Nível requer Nivel atual * 100 XP

    while (newExperience >= newLevel * 100) {
        newExperience >= newLevel * 100
        newLevel ++
        pointsToAssign += 100
        levelUp = true
    }
    return{
        newLevel,
        newExperience,
        pointsToAssign,
        levelUp
    }

}