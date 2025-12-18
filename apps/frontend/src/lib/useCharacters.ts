"use client"

import { useEffect, useState } from "react"
import { characters as charactersSource } from "@/lib/CharacterData"
import type { Character } from "@/lib/CharacterData"

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    // snapshot inicial
    setCharacters([...charactersSource])

    const update = () => {
      setCharacters([...charactersSource])
    }

    window.addEventListener("characters:update", update)

    return () => {
      window.removeEventListener("characters:update", update)
    }
  }, [])

  return characters
}
