'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { EventosApiRest, type PainelDesafiosAtivos } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';

// Contexto do Inspetor de Desafios — SOMENTE LEITURA (painel de Desafios Ativos no instante atual).
// As FERRAMENTAS DE TESTE foram retiradas porque os domínios rotativos (Diário/Semanal/Mensal) e a
// participação/leaderboard só serão exercitados quando o jogo (runtime) existir. Para reativá-las (histórico git
// da sessão de certificação F2/F3), restaurar:
//   - estado `instanteIso` + `alterarInstanteIso` e o parâmetro `{ instanteIso }` nas chamadas (simular a virada de período);
//   - carregamento extra de EventosApiRest.GET.DesafiosParticipacao.painel/politicas e GET.DesafiosLeaderboard.instancia/historico;
//   - ações `garantir` (POST DesafiosAtivos.garantir), `salvarPolitica` / `registrarTentativa` (POST DesafiosParticipacao.*),
//     e `registrarResultado` (POST DesafiosLeaderboard.registrarResultado).

export interface Contexto__PaginaGameDesignerDesafiosAtivos__Props {
    painel: PainelDesafiosAtivos | null;
    carregando: boolean;
    erro: string | null;
    carregarPainel: () => Promise<void>;
};

const Contexto__PaginaGameDesignerDesafiosAtivos = createContext<Contexto__PaginaGameDesignerDesafiosAtivos__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerDesafiosAtivos = (): Contexto__PaginaGameDesignerDesafiosAtivos__Props => {
    const context = useContext(Contexto__PaginaGameDesignerDesafiosAtivos);
    if (!context) throw new Error('useContexto__PaginaGameDesignerDesafiosAtivos precisa estar dentro de um Contexto__PaginaGameDesignerDesafiosAtivos');
    return context;
};

export const Contexto__PaginaGameDesignerDesafiosAtivos__Provider = ({ children }: { children: ReactNode; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Inspetor de Desafios', fecharProps: undefined });

    const [painel, setPainel] = useState<PainelDesafiosAtivos | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const carregarPainel = useCallback(async () => {
        setCarregando(true);
        setErro(null);

        try {
            const resposta = await NoraApi.RestGET(EventosApiRest.GET.DesafiosAtivos.painel, {}, { mensagemErro: 'Não foi possível carregar o painel de Desafios Ativos.' });
            setPainel(resposta);
        } catch {
            setErro('Não foi possível carregar o painel de Desafios Ativos.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => { void carregarPainel(); }, [carregarPainel]);

    return (
        <Contexto__PaginaGameDesignerDesafiosAtivos.Provider value={{ painel, carregando, erro, carregarPainel }}>
            {children}
        </Contexto__PaginaGameDesignerDesafiosAtivos.Provider>
    );
};
