"use client"
import { useEffect, useState } from "react"

interface AnimatedSpriteProps {
  characterClass: string
  animation: "idle" | "attack" | "hit"
  position: "left" | "right"
  isLoser: boolean
  isCritical?: boolean // Adicionado para suportar o estado de crítico
}

export default function AnimatedSprite({ 
  characterClass, 
  animation, 
  position, 
  isLoser, 
  isCritical // Recebendo a nova prop
}: AnimatedSpriteProps) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const frameCount = animation === "idle" ? 4 : animation === "attack" ? 3 : 2
    const frameDelay = animation === "idle" ? 400 : animation === "attack" ? 200 : 150

    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frameCount)
    }, frameDelay)

    return () => clearInterval(interval)
  }, [animation])

  // Cores originais mantidas...
  const colors = {
    Maga: { primary: "#7c3aed", secondary: "#a78bfa", accent: "#ddd6fe", dark: "#5b21b6", light: "#ede9fe", glow: "#c4b5fd" },
    "Mestre das Feras": { primary: "#059669", secondary: "#10b981", accent: "#6ee7b7", dark: "#065f46", light: "#d1fae5", glow: "#34d399" },
    Guerreiro: { primary: "#dc2626", secondary: "#ef4444", accent: "#fca5a5", dark: "#991b1b", light: "#fee2e2", glow: "#f87171" },
    Arqueira: { primary: "#2563eb", secondary: "#3b82f6", accent: "#93c5fd", dark: "#1e40af", light: "#dbeafe", glow: "#60a5fa" },
  }

  const color = colors[characterClass as keyof typeof colors] || colors.Guerreiro

  // Determina se deve aplicar a animação de flash de crítico (apenas para o atacante)
  const isAttackingCrit = isCritical && animation === "attack";
  // Determina se deve aplicar o tremor de crítico (apenas para quem recebe o hit)
  const isTakingCritHit = isCritical && animation === "hit";

  return (
    <div 
      className={`relative w-64 h-64 mx-auto transition-all duration-300
        ${isLoser ? "grayscale opacity-40" : ""}
        ${isAttackingCrit ? "animate-critical-flash" : ""}
        ${isTakingCritHit ? "animate-super-shake" : ""}
      `}
    >
      {/* Efeito de aura dourada quando desfere um crítico */}
      {isAttackingCrit && (
        <div className="absolute inset-0 bg-yellow-400/30 blur-[60px] animate-pulse rounded-full z-0" />
      )}

      <svg
        viewBox="0 0 128 128"
        className="w-full h-full drop-shadow-2xl relative z-10"
        style={{
          transform: position === "right" ? "scaleX(-1)" : "none",
          // Se for crítico, o drop-shadow fica dourado e mais forte
          filter: isAttackingCrit 
            ? `drop-shadow(0 0 25px gold)` 
            : animation === "attack" ? `drop-shadow(0 0 20px ${color.glow})` : "",
        }}
      >
        {characterClass === "Maga" && (
          <>
            {/* Sombra no chão */}
            <ellipse cx="64" cy="116" rx="24" ry="6" fill="rgba(0,0,0,0.3)" />

            {/* Corpo com detalhes de vestido */}
            <path
              d="M52 64 L52 96 L48 102 L80 102 L76 96 L76 64 Z"
              fill={color.primary}
              stroke={color.dark}
              strokeWidth="1"
            />
            <path d="M54 70 L74 70 L74 96 L54 96 Z" fill={color.secondary} opacity="0.6" />

            {/* Cinto/Faixa */}
            <rect x="50" y="62" width="28" height="4" fill={color.dark} />
            <circle cx="64" cy="64" r="3" fill={color.accent} />

            {/* Cabeça com mais detalhes */}
            <ellipse cx="64" cy="48" rx="14" ry="16" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

            {/* Cabelo/Franja */}
            <path d="M52 42 Q64 38 76 42 L76 48 L72 46 L64 48 L56 46 L52 48 Z" fill="#92400e" />

            {/* Olhos */}
            <circle cx="58" cy="48" r="2" fill="#1f2937" />
            <circle cx="70" cy="48" r="2" fill="#1f2937" />
            <circle cx="58.5" cy="47.5" r="0.8" fill="white" />
            <circle cx="70.5" cy="47.5" r="0.8" fill="white" />

            {/* Boca */}
            <path d="M60 54 Q64 56 68 54" stroke="#dc2626" strokeWidth="1" fill="none" strokeLinecap="round" />

            {/* Chapéu de bruxa detalhado */}
            <path
              d="M48 40 L50 36 L78 36 L80 40 L76 42 L52 42 Z"
              fill={color.primary}
              stroke={color.dark}
              strokeWidth="1"
            />
            <path d="M54 36 L58 28 L70 28 L74 36 Z" fill={color.secondary} stroke={color.dark} strokeWidth="1" />
            <path d="M60 28 L62 20 L66 20 L68 28 Z" fill={color.primary} stroke={color.dark} strokeWidth="1" />
            <path d="M62 20 L63 14 L65 14 L66 20 Z" fill={color.secondary} stroke={color.dark} strokeWidth="1" />
            {/* Estrelas no chapéu */}
            <circle cx="58" cy="32" r="1.5" fill={color.accent} />
            <circle cx="70" cy="30" r="1.5" fill={color.accent} />

            {/* Braços com movimento */}
            <g transform={animation === "attack" ? "translate(2, -4)" : "translate(0, 0)"}>
              {/* Braço direito */}
              <path
                d={
                  animation === "attack"
                    ? "M76 66 L86 60 L88 62 L90 72 L88 74 L82 72"
                    : "M76 66 L84 68 L86 70 L86 78 L84 80 L78 78"
                }
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="1"
              />
              {/* Mão direita */}
              <ellipse
                cx={animation === "attack" ? "90" : "86"}
                cy={animation === "attack" ? "72" : "79"}
                rx="4"
                ry="3"
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="0.5"
              />
            </g>

            {/* Braço esquerdo */}
            <path d="M52 66 L44 68 L42 70 L42 78 L44 80 L50 78" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            <ellipse cx="42" cy="79" rx="4" ry="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

            {/* Cajado mágico detalhado */}
            <g transform={animation === "attack" ? "translate(2, -4) rotate(-15 90 70)" : "translate(0, 0)"}>
              <rect x="38" y="56" width="3" height="40" rx="1" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
              <rect x="37" y="54" width="5" height="3" rx="1" fill="#92400e" />

              {/* Cristal no topo */}
              <g opacity={animation === "attack" && frame === 1 ? "1" : "0.7"}>
                <path
                  d="M39.5 48 L35 54 L39.5 56 L44 54 Z"
                  fill={color.accent}
                  stroke={color.secondary}
                  strokeWidth="1"
                />
                <path d="M39.5 48 L39.5 42 L35 54 Z" fill={color.secondary} opacity="0.6" />
                <path d="M39.5 48 L39.5 42 L44 54 Z" fill={color.primary} opacity="0.6" />
                {/* Brilho do cristal */}
                <circle cx="39.5" cy="52" r="1.5" fill="white" opacity="0.8" />
              </g>

              {/* Partículas mágicas durante ataque */}
              {animation === "attack" && (
                <>
                  <circle cx="42" cy="50" r="2" fill={color.glow} opacity={frame === 1 ? "0.8" : "0.4"}>
                    <animate attributeName="cy" values="50;46;50" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="37" cy="52" r="1.5" fill={color.accent} opacity={frame === 2 ? "0.8" : "0.4"}>
                    <animate attributeName="cy" values="52;48;52" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="40" cy="48" r="1" fill="white" opacity={frame === 0 ? "1" : "0.5"}>
                    <animate attributeName="cy" values="48;44;48" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
            </g>

            {/* Pernas com movimento */}
            <g transform={animation === "idle" && frame % 2 === 0 ? "translate(0, 1)" : "translate(0, 0)"}>
              <rect
                x="54"
                y="96"
                width="10"
                height="14"
                rx="1"
                fill={color.primary}
                stroke={color.dark}
                strokeWidth="0.5"
              />
              <rect
                x="64"
                y="96"
                width="10"
                height="14"
                rx="1"
                fill={color.primary}
                stroke={color.dark}
                strokeWidth="0.5"
              />
              {/* Sapatos */}
              <ellipse cx="59" cy="112" rx="5" ry="3" fill={color.dark} />
              <ellipse cx="69" cy="112" rx="5" ry="3" fill={color.dark} />
            </g>

            {/* Efeitos especiais de magia ambiente */}
            {animation === "idle" && (
              <>
                <circle cx="50" cy={70 + Math.sin(frame) * 3} r="1.5" fill={color.glow} opacity="0.6" />
                <circle cx="78" cy={75 + Math.cos(frame) * 3} r="1.5" fill={color.accent} opacity="0.6" />
              </>
            )}
          </>
        )}

        {characterClass === "Guerreiro" && (
          <>
            {/* Sombra */}
            <ellipse cx="64" cy="116" rx="26" ry="6" fill="rgba(0,0,0,0.4)" />

            {/* Pernas com armadura */}
            <g transform={animation === "idle" && frame % 2 === 0 ? "translate(1, 0)" : "translate(0, 0)"}>
              <rect
                x="52"
                y="94"
                width="12"
                height="18"
                rx="2"
                fill={color.primary}
                stroke={color.dark}
                strokeWidth="1"
              />
              <rect
                x="64"
                y="94"
                width="12"
                height="18"
                rx="2"
                fill={color.primary}
                stroke={color.dark}
                strokeWidth="1"
              />
              {/* Joelheiras */}
              <rect x="52" y="100" width="12" height="6" fill="#71717a" stroke="#3f3f46" strokeWidth="1" />
              <rect x="64" y="100" width="12" height="6" fill="#71717a" stroke="#3f3f46" strokeWidth="1" />
              {/* Botas */}
              <rect x="51" y="110" width="14" height="6" rx="1" fill="#3f3f46" />
              <rect x="63" y="110" width="14" height="6" rx="1" fill="#3f3f46" />
            </g>

            {/* Corpo com armadura detalhada */}
            <rect
              x="50"
              y="60"
              width="28"
              height="36"
              rx="2"
              fill={color.primary}
              stroke={color.dark}
              strokeWidth="1"
            />
            {/* Peitoral */}
            <rect x="52" y="62" width="24" height="16" rx="2" fill="#71717a" stroke="#3f3f46" strokeWidth="1" />
            {/* Detalhes do peitoral */}
            <rect x="56" y="66" width="16" height="8" rx="1" fill="#52525b" opacity="0.6" />
            <circle cx="64" cy="70" r="3" fill={color.accent} stroke={color.dark} strokeWidth="0.5" />

            {/* Cinto */}
            <rect x="50" y="88" width="28" height="6" fill="#78716c" stroke="#57534e" strokeWidth="1" />
            <rect x="62" y="88" width="4" height="6" fill="#fbbf24" />

            {/* Cabeça */}
            <ellipse cx="64" cy="48" rx="13" ry="15" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

            {/* Elmo detalhado */}
            <rect x="48" y="38" width="32" height="10" rx="2" fill="#71717a" stroke="#3f3f46" strokeWidth="1" />
            <rect x="50" y="36" width="28" height="4" rx="2" fill="#52525b" />
            {/* Visor do elmo */}
            <rect x="54" y="42" width="20" height="4" rx="1" fill="#1f2937" />
            {/* Olhos através do visor */}
            <rect x="58" y="43" width="4" height="2" fill="#ef4444" />
            <rect x="66" y="43" width="4" height="2" fill="#ef4444" />
            {/* Pluma no elmo */}
            <path d="M64 34 Q62 28 60 24 Q64 26 64 30" fill={color.accent} stroke={color.primary} strokeWidth="0.5" />
            <path
              d="M64 34 Q66 28 68 24 Q64 26 64 30"
              fill={color.secondary}
              stroke={color.primary}
              strokeWidth="0.5"
            />

            {/* Braço esquerdo com escudo */}
            <g transform={animation === "hit" ? "translate(-2, 0)" : "translate(0, 0)"}>
              <rect x="40" y="64" width="10" height="24" rx="2" fill="#78716c" stroke="#57534e" strokeWidth="1" />
              <ellipse cx="45" cy="76" rx="4" ry="3" fill="#d97706" stroke="#92400e" strokeWidth="0.5" />

              {/* Escudo grande */}
              <path
                d="M32 68 L32 88 Q32 94 38 96 Q44 94 44 88 L44 68 Q44 64 38 64 Q32 64 32 68"
                fill="#52525b"
                stroke="#3f3f46"
                strokeWidth="1.5"
              />
              {/* Detalhes do escudo */}
              <circle cx="38" cy="78" r="6" fill="#71717a" stroke="#3f3f46" strokeWidth="1" />
              <circle cx="38" cy="78" r="3" fill={color.accent} />
              <rect x="36" y="72" width="4" height="12" fill={color.primary} opacity="0.6" />
              <rect x="32" y="76" width="12" height="4" fill={color.primary} opacity="0.6" />
            </g>

            {/* Braço direito com espada */}
            <g transform={animation === "attack" ? "translate(4, -8) rotate(-25 84 72)" : "translate(0, 0)"}>
              <rect x="78" y="64" width="10" height="24" rx="2" fill="#78716c" stroke="#57534e" strokeWidth="1" />
              <ellipse cx="83" cy="76" rx="4" ry="3" fill="#d97706" stroke="#92400e" strokeWidth="0.5" />

              {/* Espada detalhada */}
              <g transform={animation === "attack" ? "translate(0, 0)" : "rotate(45 85 80)"}>
                {/* Lâmina */}
                <rect x="84" y="68" width="4" height="32" rx="1" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1" />
                <rect x="85" y="70" width="2" height="28" fill="#f4f4f5" opacity="0.8" />
                <path d="M86 68 L84 62 L88 62 Z" fill="#e4e4e7" stroke="#a1a1aa" strokeWidth="1" />

                {/* Guarda da espada */}
                <rect x="80" y="98" width="12" height="4" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

                {/* Cabo */}
                <rect x="84" y="100" width="4" height="10" rx="1" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />

                {/* Pomo */}
                <circle cx="86" cy="112" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              </g>

              {/* Efeito de corte durante ataque */}
              {animation === "attack" && (
                <>
                  <path
                    d="M90 60 Q95 55 100 50"
                    stroke="#e4e4e7"
                    strokeWidth="2"
                    fill="none"
                    opacity={frame === 1 ? "0.8" : "0.3"}
                    strokeLinecap="round"
                  />
                  <path
                    d="M92 65 Q97 60 102 55"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    opacity={frame === 2 ? "0.8" : "0.2"}
                    strokeLinecap="round"
                  />
                </>
              )}
            </g>
          </>
        )}

        {characterClass === "Arqueira" && (
          <>
            {/* Sombra */}
            <ellipse cx="64" cy="116" rx="22" ry="6" fill="rgba(0,0,0,0.3)" />

            {/* Pernas */}
            <g transform={animation === "idle" && frame % 2 === 0 ? "translate(0, 1)" : "translate(0, 0)"}>
              <rect
                x="54"
                y="94"
                width="10"
                height="18"
                rx="2"
                fill={color.primary}
                stroke={color.dark}
                strokeWidth="0.5"
              />
              <rect
                x="64"
                y="94"
                width="10"
                height="18"
                rx="2"
                fill={color.primary}
                stroke={color.dark}
                strokeWidth="0.5"
              />
              {/* Botas */}
              <rect x="53" y="110" width="12" height="6" rx="1" fill="#78350f" />
              <rect x="63" y="110" width="12" height="6" rx="1" fill="#78350f" />
            </g>

            {/* Corpo com armadura leve */}
            <rect
              x="52"
              y="62"
              width="24"
              height="34"
              rx="2"
              fill={color.primary}
              stroke={color.dark}
              strokeWidth="1"
            />
            {/* Colete de couro */}
            <rect x="54" y="64" width="20" height="20" rx="1" fill="#92400e" stroke="#78350f" strokeWidth="1" />
            <path d="M56 68 L72 68 M56 72 L72 72 M56 76 L72 76" stroke="#78350f" strokeWidth="0.5" />

            {/* Cinto com acessórios */}
            <rect x="52" y="86" width="24" height="4" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
            <circle cx="58" cy="88" r="2" fill="#fbbf24" />
            <circle cx="64" cy="88" r="2" fill="#fbbf24" />
            <circle cx="70" cy="88" r="2" fill="#fbbf24" />

            {/* Cabeça */}
            <ellipse cx="64" cy="48" rx="12" ry="14" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

            {/* Cabelo longo detalhado */}
            <path
              d="M52 42 Q64 38 76 42 L76 48 Q76 52 74 54 L76 60 L74 64 L54 64 L52 60 L54 54 Q52 52 52 48 Z"
              fill="#92400e"
              stroke="#78350f"
              strokeWidth="0.5"
            />
            {/* Franja */}
            <path d="M54 42 L56 38 L60 40 L64 38 L68 40 L72 38 L74 42" fill="#78350f" />

            {/* Rosto detalhado */}
            <circle cx="58" cy="47" r="2" fill="#1f2937" />
            <circle cx="70" cy="47" r="2" fill="#1f2937" />
            <circle cx="58.5" cy="46.5" r="0.8" fill="white" />
            <circle cx="70.5" cy="46.5" r="0.8" fill="white" />
            {/* Sobrancelhas */}
            <path d="M56 44 L60 44" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
            <path d="M68 44 L72 44" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
            {/* Boca */}
            <path d="M60 53 Q64 54 68 53" stroke="#dc2626" strokeWidth="1" fill="none" strokeLinecap="round" />

            {/* Capuz/Hood */}
            <path
              d="M50 40 Q64 34 78 40 L76 46 L52 46 Z"
              fill={color.secondary}
              stroke={color.dark}
              strokeWidth="1"
              opacity="0.7"
            />

            {/* Capa */}
            <path
              d="M52 62 L48 64 L46 90 L52 88 Z"
              fill={color.accent}
              stroke={color.secondary}
              strokeWidth="0.5"
              opacity="0.8"
            />
            <path
              d="M76 62 L80 64 L82 90 L76 88 Z"
              fill={color.accent}
              stroke={color.secondary}
              strokeWidth="0.5"
              opacity="0.8"
            />

            {/* Aljava detalhada nas costas */}
            <rect x="72" y="58" width="6" height="24" rx="1" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
            {/* Flechas na aljava */}
            <rect x="74" y="60" width="2" height="8" fill="#d97706" />
            <path d="M75 60 L73 58 L77 58 Z" fill="#34d399" />
            <rect x="74" y="70" width="2" height="6" fill="#d97706" />
            <path d="M75 70 L73 68 L77 68 Z" fill="#60a5fa" />

            {/* Braço esquerdo */}
            <g transform={animation === "attack" ? "translate(-6, -2)" : "translate(0, 0)"}>
              <rect x="42" y="66" width="10" height="20" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              <ellipse cx="47" cy="75" rx="4" ry="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              {/* Luva/Braçadeira */}
              <rect x="43" y="82" width="8" height="4" fill="#78350f" />
            </g>

            {/* Braço direito e arco */}
            <g transform={animation === "attack" ? "translate(6, -4)" : "translate(0, 0)"}>
              <rect x="76" y="66" width="10" height="20" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              <ellipse cx="81" cy="75" rx="4" ry="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              {/* Luva/Braçadeira */}
              <rect x="77" y="82" width="8" height="4" fill="#78350f" />

              {/* Arco detalhado */}
              <g transform={animation === "attack" ? "translate(0, 0)" : "translate(0, 0)"}>
                {/* Corda do arco */}
                <path
                  d={animation === "attack" ? "M34 60 Q30 76 34 92" : "M34 60 Q34 76 34 92"}
                  stroke="#d4d4d8"
                  strokeWidth="1"
                  fill="none"
                />

                {/* Corpo do arco */}
                <path
                  d="M36 60 Q30 62 28 76 Q30 90 36 92"
                  stroke="#78350f"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M36 60 Q31 62 29 76 Q31 90 36 92"
                  stroke="#92400e"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Flecha */}
                {animation === "attack" && (
                  <>
                    <rect
                      x={frame === 2 ? "36" : "34"}
                      y="75"
                      width={frame === 2 ? "20" : "16"}
                      height="2"
                      fill="#d97706"
                    />
                    <path
                      d={`M${frame === 2 ? "56" : "50"} 76 L${frame === 2 ? "60" : "54"} 74 L${frame === 2 ? "60" : "54"} 78 Z`}
                      fill="#71717a"
                    />
                    {/* Penas da flecha */}
                    <path d="M36 74 L34 73 L34 79 L36 78 Z" fill="#34d399" opacity="0.8" />
                  </>
                )}
              </g>
            </g>

            {/* Efeito de disparo */}
            {animation === "attack" && frame === 2 && (
              <>
                <circle cx="60" cy="76" r="4" fill={color.glow} opacity="0.6">
                  <animate attributeName="r" values="4;8;4" dur="0.3s" repeatCount="1" />
                </circle>
                <path d="M60 76 L70 76" stroke="white" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
              </>
            )}
          </>
        )}

        {characterClass === "Mestre das Feras" && (
          <>
            {/* Sombra */}
            <ellipse cx="64" cy="116" rx="24" ry="6" fill="rgba(0,0,0,0.3)" />

            {/* Lobo companheiro animado */}
            {animation === "attack" && (
              <g transform={`translate(${frame * 8}, 0)`}>
                {/* Corpo do lobo */}
                <ellipse cx="94" cy="100" rx="14" ry="10" fill="#71717a" stroke="#52525b" strokeWidth="1" />
                {/* Cabeça do lobo */}
                <ellipse cx="106" cy="96" rx="8" ry="7" fill="#71717a" stroke="#52525b" strokeWidth="1" />
                {/* Focinho */}
                <ellipse cx="110" cy="98" rx="4" ry="3" fill="#52525b" />
                <circle cx="111" cy="98" r="1.5" fill="#1f2937" />
                {/* Orelhas */}
                <path d="M102 90 L100 86 L104 92 Z" fill="#71717a" stroke="#52525b" strokeWidth="0.5" />
                <path d="M110 90 L112 86 L108 92 Z" fill="#71717a" stroke="#52525b" strokeWidth="0.5" />
                {/* Olhos brilhantes */}
                <circle cx="104" cy="95" r="1.5" fill="#fbbf24" />
                <circle cx="108" cy="95" r="1.5" fill="#fbbf24" />
                <circle cx="104.5" cy="94.5" r="0.5" fill="white" />
                <circle cx="108.5" cy="94.5" r="0.5" fill="white" />
                {/* Pernas */}
                <rect x="88" y="108" width="3" height="8" rx="1" fill="#52525b" />
                <rect x="94" y="108" width="3" height="8" rx="1" fill="#52525b" />
                <rect x="100" y="108" width="3" height="8" rx="1" fill="#52525b" />
                <rect x="106" y="108" width="3" height="8" rx="1" fill="#52525b" />
                {/* Cauda */}
                <path d="M82 98 Q78 94 76 88" stroke="#71717a" strokeWidth="4" fill="none" strokeLinecap="round" />
                {/* Efeito de energia ao redor do lobo */}
                <circle cx="94" cy="100" r="16" stroke={color.glow} strokeWidth="1" fill="none" opacity="0.4">
                  <animate attributeName="r" values="16;20;16" dur="1s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* Pernas */}
            <g transform={animation === "idle" && frame % 2 === 0 ? "translate(-1, 0)" : "translate(0, 0)"}>
              <rect
                x="54"
                y="94"
                width="10"
                height="18"
                rx="2"
                fill={color.primary}
                stroke={color.dark}
                strokeWidth="0.5"
              />
              <rect
                x="64"
                y="94"
                width="10"
                height="18"
                rx="2"
                fill={color.primary}
                stroke={color.dark}
                strokeWidth="0.5"
              />
              {/* Botas de pele */}
              <path d="M53 110 L53 116 L65 116 L65 110" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
              <path d="M63 110 L63 116 L75 116 L75 110" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
              {/* Detalhes de pelo */}
              <path
                d="M54 110 L56 112 L58 110 L60 112 L62 110 L64 112"
                stroke="#92400e"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M64 110 L66 112 L68 110 L70 112 L72 110 L74 112"
                stroke="#92400e"
                strokeWidth="0.5"
                fill="none"
              />
            </g>

            {/* Corpo com armadura de couro e peles */}
            <rect
              x="52"
              y="62"
              width="24"
              height="34"
              rx="2"
              fill={color.primary}
              stroke={color.dark}
              strokeWidth="1"
            />
            {/* Peitoral de couro */}
            <rect x="54" y="64" width="20" height="22" rx="1" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            {/* Textura de couro */}
            <path
              d="M56 68 L72 68 M56 72 L72 72 M56 76 L72 76 M56 80 L72 80"
              stroke="#92400e"
              strokeWidth="0.5"
              opacity="0.5"
            />

            {/* Peles nos ombros */}
            <path d="M50 60 L48 64 L50 70 L54 68 L54 62 Z" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
            <path d="M78 60 L80 64 L78 70 L74 68 L74 62 Z" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
            {/* Garras decorativas */}
            <path d="M48 64 L46 66 L47 68" stroke="#e4e4e7" strokeWidth="1" fill="none" />
            <path d="M80 64 L82 66 L81 68" stroke="#e4e4e7" strokeWidth="1" fill="none" />

            {/* Cinto com totens */}
            <rect x="52" y="88" width="24" height="5" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
            <rect x="56" y="88" width="3" height="8" fill="#92400e" />
            <circle cx="57.5" cy="90" r="1" fill="#34d399" />
            <rect x="64" y="88" width="3" height="8" fill="#92400e" />
            <circle cx="65.5" cy="90" r="1" fill="#fbbf24" />
            <rect x="69" y="88" width="3" height="8" fill="#92400e" />
            <circle cx="70.5" cy="90" r="1" fill="#ef4444" />

            {/* Cabeça */}
            <ellipse cx="64" cy="48" rx="13" ry="14" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

            {/* Capuz com cabeça de lobo */}
            <path d="M48 38 Q64 32 80 38 L78 48 L50 48 Z" fill="#71717a" stroke="#52525b" strokeWidth="1" />
            {/* Focinho do lobo no capuz */}
            <ellipse cx="64" cy="32" rx="8" ry="6" fill="#52525b" stroke="#3f3f46" strokeWidth="0.5" />
            <circle cx="64" cy="34" r="2" fill="#1f2937" />
            {/* Orelhas do capuz */}
            <path d="M54 34 L50 28 L56 36 Z" fill="#71717a" stroke="#52525b" strokeWidth="0.5" />
            <path d="M74 34 L78 28 L72 36 Z" fill="#71717a" stroke="#52525b" strokeWidth="0.5" />
            {/* Presas decorativas */}
            <rect x="60" cy="38" width="2" height="4" fill="white" opacity="0.9" />
            <rect x="66" cy="38" width="2" height="4" fill="white" opacity="0.9" />

            {/* Rosto */}
            <circle cx="58" cy="47" r="2" fill="#1f2937" />
            <circle cx="70" cy="47" r="2" fill="#1f2937" />
            <circle cx="58.5" cy="46.5" r="0.8" fill="white" />
            <circle cx="70.5" cy="46.5" r="0.8" fill="white" />
            {/* Pintura de guerra */}
            <path d="M54 44 L62 48" stroke={color.accent} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M74 44 L66 48" stroke={color.accent} strokeWidth="1.5" strokeLinecap="round" />
            {/* Barba */}
            <path d="M58 54 L60 58 L64 56 L68 58 L70 54" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />

            {/* Braço esquerdo */}
            <g transform={animation === "attack" ? "translate(-2, 2)" : "translate(0, 0)"}>
              <rect x="42" y="66" width="10" height="20" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              <ellipse cx="47" cy="75" rx="4" ry="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              {/* Braçadeira de couro */}
              <rect x="43" y="70" width="8" height="6" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
            </g>

            {/* Braço direito com cajado totêmico */}
            <g transform={animation === "attack" ? "translate(2, -4)" : "translate(0, 0)"}>
              <rect x="76" y="66" width="10" height="20" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              <ellipse cx="81" cy="75" rx="4" ry="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              {/* Braçadeira */}
              <rect x="77" y="70" width="8" height="6" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />

              {/* Cajado totêmico detalhado */}
              <rect x="32" y="52" width="4" height="48" rx="1" fill="#78350f" stroke="#451a03" strokeWidth="0.5" />
              {/* Textura de madeira */}
              <path
                d="M33 56 L35 56 M33 62 L35 62 M33 68 L35 68 M33 74 L35 74 M33 80 L35 80 M33 86 L35 86 M33 92 L35 92"
                stroke="#92400e"
                strokeWidth="0.3"
              />

              {/* Totem do topo - cabeça de águia */}
              <ellipse cx="34" cy="48" rx="5" ry="6" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />
              <path d="M34 48 L38 50 L37 52 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              <circle cx="32" cy="47" r="1" fill="#fbbf24" />
              <circle cx="36" cy="47" r="1" fill="#fbbf24" />
              {/* Penas no totem */}
              <path d="M30 46 L26 44 Q28 46 30 48" fill="#34d399" stroke={color.primary} strokeWidth="0.3" />
              <path d="M38 46 L42 44 Q40 46 38 48" fill="#34d399" stroke={color.primary} strokeWidth="0.3" />
              <path d="M29 50 L25 52 Q27 52 29 52" fill="#60a5fa" stroke={color.primary} strokeWidth="0.3" />
              <path d="M39 50 L43 52 Q41 52 39 52" fill="#60a5fa" stroke={color.primary} strokeWidth="0.3" />

              {/* Cristais de energia ao longo do cajado */}
              <circle cx="34" cy="60" r="2" fill={color.accent} opacity={animation === "idle" ? "0.8" : "1"}>
                {animation === "idle" && (
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                )}
              </circle>
              <circle cx="34" cy="72" r="2" fill="#fbbf24" opacity={animation === "idle" ? "0.7" : "1"}>
                {animation === "idle" && (
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="0.5s" />
                )}
              </circle>
              <circle cx="34" cy="84" r="2" fill={color.glow} opacity={animation === "idle" ? "0.6" : "1"}>
                {animation === "idle" && (
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1s" />
                )}
              </circle>

              {/* Amuletos pendurados */}
              <path d="M34 96 L30 98 L30 102 L32 104 L30 104" stroke="#78350f" strokeWidth="0.5" fill="none" />
              <circle cx="30" cy="104" r="2" fill="#34d399" stroke={color.primary} strokeWidth="0.5" />
              <path d="M34 96 L38 98 L38 102 L36 104 L38 104" stroke="#78350f" strokeWidth="0.5" fill="none" />
              <circle cx="38" cy="104" r="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />

              {/* Efeitos mágicos durante ataque */}
              {animation === "attack" && (
                <>
                  <circle
                    cx="34"
                    cy="48"
                    r="8"
                    stroke={color.glow}
                    strokeWidth="1"
                    fill="none"
                    opacity={frame === 1 ? "0.8" : "0.3"}
                  >
                    <animate attributeName="r" values="8;12;8" dur="0.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="28" cy="52" r="2" fill={color.accent} opacity={frame === 0 ? "1" : "0.5"} />
                  <circle cx="40" cy="52" r="2" fill={color.glow} opacity={frame === 1 ? "1" : "0.5"} />
                  <circle cx="34" cy="42" r="1.5" fill="white" opacity={frame === 2 ? "1" : "0.4"} />
                </>
              )}
            </g>

            {/* Aura de energia natural ambiente */}
            {animation === "idle" && (
              <>
                <circle cx={52 + frame} cy={68 + Math.sin(frame) * 2} r="1.5" fill={color.accent} opacity="0.5" />
                <circle cx={76 - frame} cy={72 + Math.cos(frame) * 2} r="1.5" fill={color.glow} opacity="0.5" />
                <circle cx={64} cy={58 + Math.sin(frame * 1.5) * 2} r="1" fill="#fbbf24" opacity="0.6" />
              </>
            )}
          </>
        )}

        {animation === "hit" && (
          <g opacity={frame === 0 ? "0.7" : "0.3"}>
            <rect x="30" y="30" width="68" height="68" fill="#dc2626" opacity="0.4" rx="4" />
            <circle cx="64" cy="64" r="30" stroke="#ef4444" strokeWidth="3" fill="none" opacity="0.6" />
          </g>
        )}
      </svg>

      {animation === "attack" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-ping"
              style={{
                background: `radial-gradient(circle, ${color.glow} 0%, transparent 70%)`,
                left: `${50 + (position === "left" ? 25 : -25)}%`,
                top: `${35 + i * 6}%`,
                animationDelay: `${i * 80}ms`,
                animationDuration: "800ms",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
