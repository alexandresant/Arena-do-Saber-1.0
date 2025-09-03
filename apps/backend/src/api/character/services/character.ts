export function calculatedDerived(level: number, strength: number, intelligence: number, agility: number, constitution: number, defense: number){
    console.log("Dados que chegam na função Derived: " + level, strength, intelligence, agility, constitution, defense)
    const hp = 100 + (constitution * 12) + (level -1) * 8
    const mana = 30 + (intelligence * 10) + (level -1) * 3
    const attack = Math.round(strength * 1.8 + level * 1.2)
    const magicAttack = Math.round(intelligence * 1.6 + level * 1.1)
    const evasion = Math.min(60, Math.round(agility * 0.6 + level *0.2))
    const critChance = Math.min(50, Math.round(agility * 0.25))
    const defenseTotal = Math.round(defense + constitution * 0.8 + (level * 0.5))
    return{hp, mana, attack, magicAttack, evasion, critChance, defenseTotal}
}