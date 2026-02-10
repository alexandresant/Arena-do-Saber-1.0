// RpgBattle.tsx
"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import  {BattleArena}  from "@/components/layout/battle/BattleArena"
import { 
  mainPlayer, 
  gameUsers, 
  hydrateAll, 
  GameUser, 
  Character,
  characters
} from "@/lib/CharacterData"
import { Swords, UserCircle, Loader2, Home, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// Interface para estado da batalha
interface BattleState {
  loading: boolean;
  error: string | null;
  player: Character | null;
  opponents: GameUser[];
  selectedUser: GameUser | null;
  battleStarted: boolean;
}

export default function RPGBattle() {
  const [state, setState] = useState<BattleState>({
    loading: true,
    error: null,
    player: null,
    opponents: [],
    selectedUser: null,
    battleStarted: false,
  });

  const router = useRouter();

  // Função para verificar e carregar dados
  const loadData = useCallback(async () => {
    console.log("RPGBattle: Verificando dados...");
    
    // Primeiro verifica se já temos dados em cache
    if (mainPlayer && characters.length > 0) {
      console.log("RPGBattle: Dados já disponíveis em cache");
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        player: mainPlayer,
        opponents: [...gameUsers],
      }));
      return true;
    }

    console.log("RPGBattle: Buscando dados via hydrateAll...");
    
    try {
      // Chama hydrateAll que deve atualizar as variáveis globais
      const result = await hydrateAll();
      
      // Verifica se agora temos dados
      if (mainPlayer && gameUsers.length > 0) {
        console.log("RPGBattle: Dados carregados com sucesso");
        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
          player: mainPlayer,
          opponents: [...gameUsers],
        }));
        return true;
      } else {
        console.warn("RPGBattle: hydrateAll não retornou dados suficientes");
        setState(prev => ({
          ...prev,
          loading: false,
          error: "Não foi possível carregar os personagens. Tente novamente.",
        }));
        return false;
      }
    } catch (error) {
      console.error("RPGBattle: Erro ao carregar dados:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      }));
      return false;
    }
  }, []);

  // Função para escutar atualizações
  const setupUpdateListener = useCallback(() => {
    const handleUpdate = () => {
      console.log("RPGBattle: Evento characters:update recebido!");
      
      if (mainPlayer && gameUsers.length > 0) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
          player: mainPlayer,
          opponents: [...gameUsers],
        }));
      }
    };

    window.addEventListener("characters:update", handleUpdate);
    
    return () => {
      window.removeEventListener("characters:update", handleUpdate);
    };
  }, []);

  useEffect(() => {
    console.log("RPGBattle: useEffect rodando");
    
    // Configura listener para atualizações futuras
    const cleanupListener = setupUpdateListener();
    
    // Tenta carregar dados
    loadData();
    
    // Timeout de fallback para evitar loading infinito
    const timeoutId = setTimeout(() => {
      if (state.loading) {
        console.warn("RPGBattle: Timeout - forçando fim do loading");
        setState(prev => ({
          ...prev,
          loading: false,
          error: mainPlayer && gameUsers.length === 0 
            ? "Não há adversários disponíveis no momento. Tente novamente mais tarde." 
            : "Não foi possível carregar todos os dados. Algumas funcionalidades podem estar limitadas.",
        }));
      }
    }, 5000); // 5 segundos é suficiente

    return () => {
      console.log("RPGBattle: Cleanup");
      cleanupListener();
      clearTimeout(timeoutId);
    };
  }, [loadData, setupUpdateListener, state.loading]);

  // Handler para tentar recarregar dados
  const handleRetry = useCallback(() => {
    console.log("RPGBattle: Recarregando dados...");
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));
    
    // Pequeno delay para mostrar o loading state
    setTimeout(() => {
      loadData();
    }, 300);
  }, [loadData]);

  // Valida se a batalha pode ser iniciada
  const canStartBattle = useCallback(() => {
    if (!state.player) {
      console.error("Player não definido");
      return false;
    }
    
    if (!state.selectedUser?.character) {
      console.error("Character do adversário não definido");
      return false;
    }

    return true;
  }, [state.player, state.selectedUser]);

  // Handler para iniciar batalha com validação
  const handleStartBattle = () => {
    if (!canStartBattle()) {
      setState(prev => ({
        ...prev,
        error: "Não é possível iniciar a batalha. Dados incompletos."
      }));
      return;
    }

    console.log("Iniciando batalha entre:", 
      state.player?.nickName, 
      "vs", 
      state.selectedUser?.character.nickName
    );
    
    setState(prev => ({
      ...prev,
      battleStarted: true,
      error: null,
    }));
  };

  // Handler para resetar batalha
  const handleResetBattle = () => {
    setState(prev => ({
      ...prev,
      battleStarted: false,
    }));
  };

  // Redireciona para home com fallback
  const handleGoHome = () => {
    try {
      router.push("/student-dashboard");
    } catch (error) {
      console.error("Falha ao navegar para home:", error);
      window.location.href = "/student-dashboard";
    }
  };

  // Renderiza estado de carregamento
  if (state.loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white space-y-4 p-4">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
        <p className="font-mono text-primary animate-pulse text-center">
          Buscando heróis na taverna...
        </p>
        <p className="text-sm text-gray-400">
          Aguarde um momento
        </p>
      </div>
    );
  }

  // Renderiza estado de erro
  if (state.error) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white space-y-6 p-6">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-red-400">Erro ao Carregar</h2>
        <p className="text-gray-300 text-center max-w-md">{state.error}</p>
        <div className="flex gap-4 mt-4">
          <Button 
            onClick={handleRetry}
            variant="outline"
            className="text-white"
          >
            Tentar Novamente
          </Button>
          <Button onClick={handleGoHome}>
            <Home className="mr-2" />
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  // Renderiza arena de batalha se tudo estiver válido
  if (state.battleStarted && canStartBattle() && state.player && state.selectedUser) {
    return (
      <BattleArena 
        player1={state.player} 
        player2={state.selectedUser.character} 
        onReset={handleResetBattle}
      />
    );
  }

  // Se não tem personagem principal mesmo após o loading
  if (!state.player) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white space-y-6 p-6">
        <UserCircle className="h-16 w-16 text-yellow-500" />
        <h2 className="text-2xl font-bold text-yellow-400">Personagem Não Encontrado</h2>
        <p className="text-gray-300 text-center max-w-md">
          Você precisa criar um personagem antes de entrar na arena.
        </p>
        <div className="flex gap-4 mt-4">
          <Button 
            onClick={handleRetry}
            variant="outline"
            className="text-white"
          >
            Verificar Novamente
          </Button>
          <Button onClick={handleGoHome}>
            <Home className="mr-2" />
            Voltar para Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#0a0f1e]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-mono">
              ARENA RPG
            </h1>
            <p className="text-gray-400 mt-2">Escolha seu adversário e inicie a batalha</p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>

        {/* Mensagem de erro (se houver) */}
        {state.error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-300 text-sm">{state.error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* PLAYER CARD */}
          <Card className="p-6 border-2 border-primary bg-gray-900/50">
            <h2 className="text-xl font-mono mb-4 flex items-center gap-2 text-white">
              <UserCircle className="text-primary" /> 
              SEU HERÓI
            </h2>
            
            <div className="text-center space-y-4">
              <div className="text-7xl mb-2">{state.player.image}</div>
              <h3 className="text-2xl font-bold text-white">{state.player.nickName}</h3>
              <p className="text-gray-300">{state.player.name}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                <div className="bg-gray-800/50 p-2 rounded">
                  <p className="text-gray-400">Level</p>
                  <p className="text-white font-bold">{state.player.level || 1}</p>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <p className="text-gray-400">HP</p>
                  <p className="text-white font-bold">{state.player.maxHp || 100}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* OPPONENT LIST */}
          <Card className="p-6 border-2 border-gray-700 bg-gray-900/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-mono flex items-center gap-2 text-white">
                <Swords className="text-secondary" /> 
                ADVERSÁRIOS
              </h2>
              <span className="text-sm text-gray-400">
                {state.opponents.length} disponíveis
              </span>
            </div>
            
            {state.opponents.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {state.opponents.map(user => (
                  <div
                    key={user.id}
                    onClick={() => {
                      if (!user.character) {
                        console.warn(`Usuário ${user.username} não tem personagem definido`);
                        return;
                      }
                      setState(prev => ({
                        ...prev,
                        selectedUser: user,
                        error: null,
                      }));
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-800/30 ${
                      state.selectedUser?.id === user.id 
                        ? 'border-secondary bg-secondary/10' 
                        : 'border-gray-700'
                    } ${!user.character ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={!user.character ? "Personagem não disponível" : ""}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">
                        {user.character?.image || "❓"}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-white">
                              {user.username} (Nível {user.level})
                            </p>
                            <p className="text-sm text-gray-300">
                              {user.character?.nickName || "Sem personagem"}
                            </p>
                          </div>
                          {!user.character && (
                            <span className="text-xs text-red-400 px-2 py-1 bg-red-900/30 rounded">
                              Indisponível
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-400">
                <Swords className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhum adversário disponível no momento</p>
                <Button 
                  onClick={handleRetry}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Buscar adversários
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* BATTLE BUTTON */}
        <div className="pt-6">
          <Button
            disabled={!state.selectedUser?.character || !state.player}
            onClick={handleStartBattle}
            className="w-full py-6 md:py-8 text-xl md:text-2xl font-mono bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            size="lg"
          >
            {!state.selectedUser?.character ? (
              "SELECIONE UM ADVERSÁRIO"
            ) : (
              <>
                <Swords className="mr-3 h-6 w-6" />
                INICIAR BATALHA: {state.player.nickName} vs {state.selectedUser.character.nickName}
              </>
            )}
          </Button>
          
          {/* Informações adicionais */}
          <div className="mt-4 text-center text-sm text-gray-400">
            {!state.selectedUser?.character && state.player && (
              <p>Clique em um adversário disponível para selecioná-lo</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
