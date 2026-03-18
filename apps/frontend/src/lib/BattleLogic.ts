import type { Character } from "@/lib/CharacterData"

type DamageApplicationResult = {
  hpDamage: number
  manaDamage: number
  remainingHp: number
  remainingMana: number
}

function normalizeClassName(value: unknown): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
}

function getCharacterClass(character: Character): string {
  return normalizeClassName(character.name)
}

function isMage(character: Character): boolean {
  return getCharacterClass(character) === "maga"
}

function isWarrior(character: Character): boolean {
  return getCharacterClass(character) === "guerreiro"
}

function isArcher(character: Character): boolean {
  return getCharacterClass(character) === "arqueira"
}

function isBeastMaster(character: Character): boolean {
  return getCharacterClass(character) === "mestre das feras"
}

function getEvasionMultiplier(character: Character): number {
  if (isArcher(character)) return 1.0
  if (isBeastMaster(character)) return 0.8
  if (isMage(character)) return 0.5
  if (isWarrior(character)) return 0.45
  return 0.6
}

function getCritChance(character: Character): number {
  if (isArcher(character)) return 16
  if (isBeastMaster(character)) return 11
  if (isWarrior(character)) return 9
  if (isMage(character)) return 7
  return 8
}

function getDefenseMultiplier(defender: Character, currentHp?: number): number {
  if (isWarrior(defender)) {
    return 1.15
  }

  if (isBeastMaster(defender)) {
    const maxHp = Math.max(1, Number(defender.maxHp || 1))
    const safeCurrentHp = Math.max(0, Number(currentHp ?? maxHp))
    const hpRatio = safeCurrentHp / maxHp

    if (hpRatio <= 0.25) return 1.32
    if (hpRatio <= 0.5) return 1.2
    if (hpRatio <= 0.75) return 1.08
    return 1.0
  }

  if (isMage(defender)) {
    return 0.92
  }

  return 1.0
}

function getMitigationMultiplier(defense: number): number {
  return 140 / (140 + Math.max(0, defense))
}

export function calculateHitChance(attacker: Character, defender: Character): { didHit: boolean; isCritical: boolean } {
  const baseHitChance = 92

  // dexterity continua sendo usado como evasão prática
  const effectiveEvasion = (defender.dexterity || 0) * getEvasionMultiplier(defender)

  // peso controlado para reduzir os misses exagerados
  const evasionPenalty = effectiveEvasion * 0.08

  const finalHitChance = Math.max(60, Math.min(98, baseHitChance - evasionPenalty))
  const hitRoll = Math.random() * 100
  const didHit = hitRoll <= finalHitChance

  const critChance = getCritChance(attacker)
  const isCritical = didHit && (Math.random() * 100 <= critChance)

  return { didHit, isCritical }
}

export function calculateDamage(
  attacker: Character,
  defender: Character,
  currentMana: number,
  isCritical = false,
  defenderCurrentHp?: number
): number {
  // Maga é sempre mágica; demais usam comparação de ataque se necessário
  const magicUser = isMage(attacker) || ((attacker.magicAttack || 0) > (attacker.attack || 0))

  let power = magicUser ? (attacker.magicAttack || 0) : (attacker.attack || 0)

  // bônus de mana apenas para personagem mágico
  if (magicUser) {
    const maxMana = Math.max(1, Number(attacker.maxMana || 1))
    const safeCurrentMana = Math.max(0, Number(currentMana || 0))
    const manaBonus = 1 + (Math.min(1, safeCurrentMana / maxMana) * 0.15)
    power = power * manaBonus
  }

  // pequenos ajustes por classe
  if (isArcher(attacker)) {
    power *= 1.06
  } else if (isWarrior(attacker)) {
    power *= 1.05
  } else if (isBeastMaster(attacker)) {
    power *= 1.06
  } else if (isMage(attacker)) {
    power *= 1.03
  }

  // ajuste global para o dano não ficar baixo demais
  power *= 1.1

  const effectiveDefense = (defender.defense || 0) * getDefenseMultiplier(defender, defenderCurrentHp)

  let finalDamage = power * getMitigationMultiplier(effectiveDefense)

  if (isCritical) {
    finalDamage *= 1.6
  }

  const variance = 0.95 + Math.random() * 0.1
  finalDamage *= variance

  return Math.max(1, Math.floor(finalDamage))
}

export function applyDamageToTarget(
  defender: Character,
  damage: number,
  currentHp: number,
  currentMana: number
): DamageApplicationResult {
  const safeDamage = Math.max(0, Math.floor(damage))
  const safeCurrentHp = Math.max(0, currentHp)
  const safeCurrentMana = Math.max(0, currentMana)

  if (isMage(defender)) {
    const manaShieldDamage = Math.min(safeCurrentMana, Math.floor(safeDamage * 0.25))
    const hpDamage = Math.min(safeCurrentHp, safeDamage - manaShieldDamage)

    return {
      hpDamage,
      manaDamage: manaShieldDamage,
      remainingHp: Math.max(0, safeCurrentHp - hpDamage),
      remainingMana: Math.max(0, safeCurrentMana - manaShieldDamage),
    }
  }

  const hpDamage = Math.min(safeCurrentHp, safeDamage)

  return {
    hpDamage,
    manaDamage: 0,
    remainingHp: Math.max(0, safeCurrentHp - hpDamage),
    remainingMana: safeCurrentMana,
  }
}