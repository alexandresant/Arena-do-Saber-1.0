import BattleArena from "@/components/layout/battle/BattleArena"
import type { Character, GameUser } from "@/lib/CharacterData"
import { characters, gameUsers } from "@/lib/CharacterData"

export function calculateHitChance(attacker: Character, defender: Character): boolean {
  // Chance base de acerto: 75%
  const baseHitChance = 75

  // Cada ponto de destreza do atacante aumenta 1% de chance de acerto
  const attackerBonus = attacker.dexterity * 1

  // Cada ponto de destreza do defensor aumenta 0.8% de chance de esquiva
  const defenderBonus = defender.dexterity * 0.8

  // Calcula a chance final (mínimo 10%, máximo 95%)
  const finalHitChance = Math.max(10, Math.min(95, baseHitChance + attackerBonus - defenderBonus))

  // Rola um número aleatório entre 0-100 e compara com a chance de acerto
  const roll = Math.random() * 100

  return roll <= finalHitChance
}

export function calculateDamage(attacker: Character, defender: Character, useMagic = false): number {
  const baseAttack = useMagic ? attacker.magicAttack : attacker.attack
  const dexterityBonus = Math.floor(attacker.dexterity * 0.2)
  const defenseReduction = Math.floor(defender.defense * 0.5)

  // Adiciona aleatoriedade de 80% a 120% do dano base
  const randomFactor = 0.8 + Math.random() * 0.4

  const totalDamage = Math.max(10, Math.floor((baseAttack + dexterityBonus - defenseReduction) * randomFactor))

  return totalDamage
}

export function determineAttackOrder(char1: Character, char2: Character): [Character, Character] {
  // Quem tem maior destreza ataca primeiro
  // Em caso de empate, decide aleatoriamente
  if (char1.dexterity > char2.dexterity) {
    return [char1, char2]
  } else if (char2.dexterity > char1.dexterity) {
    return [char2, char1]
  } else {
    return Math.random() > 0.5 ? [char1, char2] : [char2, char1]
  }
}

export function shouldUseMagicAttack(character: Character, currentMana: number): boolean {
  const manaCost = 20
  const hasMana = currentMana >= manaCost
  const isMagicStronger = character.magicAttack > character.attack

  return hasMana && isMagicStronger
}
