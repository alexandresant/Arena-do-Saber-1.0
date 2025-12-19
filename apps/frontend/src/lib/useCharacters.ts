"use client"

import { useEffect, useState } from "react"
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
  const [, forceRender] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        await hydrateAll()
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    load()

    function handleUpdate() {
      forceRender((v) => v + 1)
    }

    // Escutando o evento que CharacterData agora dispara
    window.addEventListener("characters:update", handleUpdate)

    return () => {
      mounted = false
      window.removeEventListener("characters:update", handleUpdate)
    }
  }, [])

  return {
    characters,
    gameUsers,
    isLoading,
  }
}