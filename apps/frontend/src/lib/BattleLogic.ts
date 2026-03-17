import type { Character } from "@/lib/CharacterData"

export function calculateHitChance(attacker: Character, defender: Character): { didHit: boolean; isCritical: boolean } {
  const baseHitChance = 80
  const hitRating = (attacker.dexterity || 0) * 1.2
  const evasionRating = (defender.dexterity || 0) * 1.0
  
  const finalHitChance = Math.max(15, Math.min(98, baseHitChance + (hitRating - evasionRating)))
  const hitRoll = Math.random() * 100
  const didHit = hitRoll <= finalHitChance

  // Chance de crítico: 5% base + bônus de destreza (limite de 35%)
  const critChance = Math.min(35, 5 + (attacker.dexterity / 8))
  const isCritical = didHit && (Math.random() * 100 <= critChance)

  return { didHit, isCritical }
}

export function calculateDamage(
  attacker: Character, 
  defender: Character, 
  currentMana: number, // Agora aceita o número corretamente
  isCritical = false
): number {
  // 1. Detecta se é um personagem mágico
  const isMagicUser = (attacker.magicAttack || 0) > (attacker.attack || 0);
  
  // 2. Define o poder base
  let power = isMagicUser ? attacker.magicAttack : attacker.attack;
  
  // 3. Apenas aplica o bônus de Mana se for Mágico (Protege Guerreiros)
  if (isMagicUser) {
    // Bônus proporcional: Mana cheia = +50% de dano.
    const manaBonus = 1 + (currentMana / attacker.maxMana) * 0.5;
    power = power * manaBonus;
  }

  const dexterityBonus = (attacker.dexterity || 0) * 0.2;
  const rawDamage = power + dexterityBonus;
  
  // Mitigação de defesa (máximo 65% de redução)
  const mitigation = Math.min(rawDamage * 0.65, (defender.defense || 0) * 0.5);
  let finalDamage = rawDamage - mitigation;

  if (isCritical) {
    finalDamage *= 2.0; 
  }

  const variance = 0.9 + Math.random() * 0.2;
  return Math.max(1, Math.floor(finalDamage * variance));
}