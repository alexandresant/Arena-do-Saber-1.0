"use client"

import { useEffect, useState } from "react"
import {
  characters,
  gameUsers,
  hydrateAllCharacters,
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
        await hydrateAllCharacters()
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
