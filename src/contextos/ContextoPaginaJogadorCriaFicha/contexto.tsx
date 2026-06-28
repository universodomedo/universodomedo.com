'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DadosEvolucaoFicha, PASSES } from 'types-nora-api';

import { PAGINAS_CRIA_FICHA, PAGINAS_SPA__CRIA_FICHA } from 'Componentes/FluxosSPA/CriaFicha/types';
import { me_criaEVinculaFicha__FichaTemporaria, me_temFichaTemporaria } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { useVerificadorPasse } from 'Hooks/useVerificadorPasse';

type MODO_CRIACAO_FICHA = 'NOVA_FICHA' | 'CLONAR_FICHA_PERSONAGEM';

// Finalidade injetada por quem monta o centralizador. Sem finalidade => fluxo padrão do jogador (Ficha Temporária).
export type FinalidadeCriaFicha = {
    metodoSalvarFicha: (dadosEvolucaoFicha: DadosEvolucaoFicha) => Promise<number>;
    metodoSair: () => void;
    metodoAposSalvar?: (idFicha: number) => void | Promise<void>;
    pularInicial: boolean;
    nomeFicha?: string;
    descricaoFicha?: string;
};

interface ContextoPaginaJogadorCriaFichaProps {
    navegarPara: (pagina: PAGINAS_SPA__CRIA_FICHA) => void;
    podeCriarNovaFicha: boolean;
    nomeFicha: string;
    setNomeFicha: (v: string) => void;
    descricaoFicha: string;
    setDescricaoFicha: (v: string) => void;
    modoCriacao: MODO_CRIACAO_FICHA;
    selecionarModoCriacao: (modo: MODO_CRIACAO_FICHA) => void;
    podeComecarCriacao: boolean;
    metodoSalvarFicha: (dadosEvolucaoFicha: DadosEvolucaoFicha) => Promise<number>;
    metodoSair: () => void;
    metodoAposSalvar?: (idFicha: number) => void | Promise<void>;
};

const ContextoPaginaJogadorCriaFicha = createContext<ContextoPaginaJogadorCriaFichaProps | undefined>(undefined);

export const useContextoPaginaJogadorCriaFicha = (): ContextoPaginaJogadorCriaFichaProps => {
    const context = useContext(ContextoPaginaJogadorCriaFicha);
    if (!context) throw new Error('useContextoPaginaJogadorCriaFicha precisa estar dentro de um ContextoPaginaJogadorCriaFicha');
    return context;
};

export function SPA_PaginaJogadorCriaFicha({ finalidade }: { finalidade?: FinalidadeCriaFicha } = {}) {
    return <ContextoPaginaJogadorCriaFichaProvider finalidade={finalidade} />;
};

const ContextoPaginaJogadorCriaFichaProvider = ({ finalidade }: { finalidade?: FinalidadeCriaFicha }) => {
    const { verificarPasse } = useVerificadorPasse();
    const [carregando, setCarregando] = useState<string | null>(null);

    const [paginaAtual, setPaginaAtual] = useState<PAGINAS_SPA__CRIA_FICHA>(finalidade?.pularInicial ? 'EVOLUCAO_INICIAL' : 'INICIAL');

    const [possuiFicha, setPossuiFicha] = useState<boolean | null>(null);
    const [nomeFicha, setNomeFicha] = useState<string>(finalidade?.nomeFicha ?? '');
    const [descricaoFicha, setDescricaoFicha] = useState<string>(finalidade?.descricaoFicha ?? '');
    const [modoCriacao, setModoCriacao] = useState<MODO_CRIACAO_FICHA>('NOVA_FICHA');

    const verificacaoPasseFundador = verificarPasse(PASSES.PASSE_DE_FUNDADOR);
    const podeCriarNovaFicha: boolean = verificacaoPasseFundador.temPasse || (possuiFicha === false);
    const podeComecarCriacao: boolean = podeCriarNovaFicha && nomeFicha.trim() !== '' && descricaoFicha.trim() !== '';

    function selecionarModoCriacao(modo: MODO_CRIACAO_FICHA) {
        if (modoCriacao === modo) return;
        setModoCriacao(modo);
    };

    async function obtemSeTemFicha() {
        setCarregando('Verificando Processo de Criação de Ficha');

        try {
            setPossuiFicha(await me_temFichaTemporaria());
        } catch {
            setPossuiFicha(null);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        if (finalidade) { setPossuiFicha(false); return; }
        obtemSeTemFicha();
    }, []);

    function navegarPara(pagina: PAGINAS_SPA__CRIA_FICHA) { setPaginaAtual(pagina); };

    const metodoSalvarFicha = finalidade?.metodoSalvarFicha ?? ((dadosEvolucaoFicha: DadosEvolucaoFicha) => me_criaEVinculaFicha__FichaTemporaria(nomeFicha, descricaoFicha, dadosEvolucaoFicha));
    const metodoSair = finalidade?.metodoSair ?? (() => navegarPara('INICIAL'));
    const metodoAposSalvar = finalidade?.metodoAposSalvar;

    const Pagina = PAGINAS_CRIA_FICHA[paginaAtual];

    if (carregando) return <div>{carregando}</div>;

    if (possuiFicha === null) return null;

    return (
        <ContextoPaginaJogadorCriaFicha.Provider value={{ navegarPara, podeCriarNovaFicha, nomeFicha, setNomeFicha, descricaoFicha, setDescricaoFicha, modoCriacao, selecionarModoCriacao, podeComecarCriacao, metodoSalvarFicha, metodoSair, metodoAposSalvar }}>
            <Pagina />
        </ContextoPaginaJogadorCriaFicha.Provider>
    );
};