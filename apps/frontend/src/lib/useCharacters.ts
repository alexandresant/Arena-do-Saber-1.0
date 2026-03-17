"use client"

import { useEffect, useState, useCallback } from "react"
import {
  characters, // Agora exportado corretamente
  gameUsers,
  hydrateAll, // Nome batendo com o CharacterData.ts
  type Character,
  type GameUser,
} from "@/lib/CharacterData"

interface UseCharactersResult {
  characters: Character[]
  gameUsers: GameUser[]
  isLoading: boolean
}



export function useCharacters(): UseCharactersResult {
  // 1. Se já temos personagens na memória, não precisamos começar em loading
  const [isLoading, setIsLoading] = useState(characters.length === 0)
  const [, forceRender] = useState(0)

  // Usamos useCallback para manter a mesma referência de função
  const handleUpdate = useCallback(() => {
    console.log("Hook: Recebido evento de atualização!");
    setIsLoading(false) // Garante que o loading pare ao receber o evento
    forceRender((v) => v + 1)
  }, [])

  useEffect(() => {
    let mounted = true

    async function load() {
      // Se já houver dados, apenas desativa o loading e sai
      if (characters.length > 0) {
        if (mounted) setIsLoading(false)
        return
      }

      try {
        await hydrateAll()
      } catch (error) {
        console.error("Erro no Hook:", error)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()

    window.addEventListener("characters:update", handleUpdate)
    
    return () => {
      mounted = false
      window.removeEventListener("characters:update", handleUpdate)
    }
  }, [handleUpdate])

  return {
    characters,
    gameUsers,
    isLoading,
  }
}