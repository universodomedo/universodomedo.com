'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { CLASSES, EventosApiRest, type AtributoCompletaDto, type EstatisticaDanificavelCompletaDto, type PatentePericiaCompletaDto, type PericiaCompletaDto } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useCache } from 'Redux/hooks/useCache';
import SPA__PaginaGameDesignerSeres__CriarFicha from 'Conteineres/PaginaGameDesignerSeres/paginas/SPA__PaginaGameDesignerSeres__CriarFicha/SPA__PaginaGameDesignerSeres__CriarFicha';
import { montaFichaEmClientDoSer } from './fichaSerEditor';

// Classe dedicada a Seres (não selecionável por jogadores; o carrossel do jogador é 2/3/4).
const ID_CLASSE_SER = CLASSES.GENERICO.id;

type GrupoPericiasPorAtributo = { atributo: AtributoCompletaDto; pericias: readonly PericiaCompletaDto[]; };

interface Contexto__PaginaGameDesignerSeres__CriarFicha__Props {
    pronto: boolean;
    classeSerDisponivel: boolean;
    atributos: readonly AtributoCompletaDto[];
    periciasPorAtributo: readonly GrupoPericiasPorAtributo[];
    patentes: readonly PatentePericiaCompletaDto[];
    estatisticas: readonly EstatisticaDanificavelCompletaDto[];
    valoresAtributos: Record<number, number>;
    patentesPericias: Record<number, number>;
    valoresEstatisticas: Record<number, number>;
    salvando: boolean;
    podeSalvar: boolean;
    setValorAtributo: (idAtributo: number, valor: number) => void;
    setPatentePericia: (idPericia: number, idPatente: number) => void;
    setValorEstatistica: (idEstatistica: number, valor: number) => void;
    salvar: () => Promise<void>;
    voltar: () => void;
};

type PropsProvider = {
    fkSerId: number;
    voltar: () => void;
};

const Contexto__PaginaGameDesignerSeres__CriarFicha = createContext<Contexto__PaginaGameDesignerSeres__CriarFicha__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerSeres__CriarFicha = (): Contexto__PaginaGameDesignerSeres__CriarFicha__Props => {
    const context = useContext(Contexto__PaginaGameDesignerSeres__CriarFicha);
    if (!context) throw new Error('useContexto__PaginaGameDesignerSeres__CriarFicha precisa estar dentro de um Contexto__PaginaGameDesignerSeres__CriarFicha');
    return context;
};

export const Contexto__PaginaGameDesignerSeres__CriarFicha__Provider = ({ fkSerId, voltar }: PropsProvider) => {
    const cache = useCache();
    const [valoresAtributos, setValoresAtributos] = useState<Record<number, number>>({});
    const [patentesPericias, setPatentesPericias] = useState<Record<number, number>>({});
    const [valoresEstatisticas, setValoresEstatisticas] = useState<Record<number, number>>({});
    const [salvando, setSalvando] = useState(false);

    const atributos = cache.pronto ? cache.atributos : [];
    const pericias = cache.pronto ? cache.pericias : [];
    const patentes = cache.pronto ? cache.patentesPericia : [];
    const estatisticas = cache.pronto ? cache.estatisticasDanificaveis : [];
    const classeSer = cache.pronto ? cache.classes.find(classe => classe.id === ID_CLASSE_SER) ?? null : null;

    const periciasPorAtributo = useMemo<readonly GrupoPericiasPorAtributo[]>(() => atributos.map(atributo => ({ atributo, pericias: pericias.filter(pericia => pericia.atributo.id === atributo.id) })), [atributos, pericias]);

    const classeSerDisponivel = classeSer !== null;
    const podeSalvar = cache.pronto && classeSerDisponivel && !salvando;

    function setValorAtributo(idAtributo: number, valor: number): void { setValoresAtributos(atuais => ({ ...atuais, [idAtributo]: valor })); };
    function setPatentePericia(idPericia: number, idPatente: number): void { setPatentesPericias(atuais => ({ ...atuais, [idPericia]: idPatente })); };
    function setValorEstatistica(idEstatistica: number, valor: number): void { setValoresEstatisticas(atuais => ({ ...atuais, [idEstatistica]: valor })); };

    async function salvar(): Promise<void> {
        if (!podeSalvar || !classeSer) return;
        setSalvando(true);

        try {
            const fichaDeJogo = montaFichaEmClientDoSer({ atributos, pericias, patentes, estatisticas }, { valoresAtributos, patentesPericias, valoresEstatisticas }, classeSer);
            await NoraApi.RestPOST(EventosApiRest.POST.SeresJogaveisFichas.criar, { fkSerId, dadosEvolucaoFicha: { fichaDeJogo, detalhesEvolucao: [] } }, { mensagemErro: 'Não foi possível salvar a Ficha do Ser.' });
            voltar();
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Contexto__PaginaGameDesignerSeres__CriarFicha.Provider value={{ pronto: cache.pronto, classeSerDisponivel, atributos, periciasPorAtributo, patentes, estatisticas, valoresAtributos, patentesPericias, valoresEstatisticas, salvando, podeSalvar, setValorAtributo, setPatentePericia, setValorEstatistica, salvar, voltar }}>
            <SPA__PaginaGameDesignerSeres__CriarFicha />
        </Contexto__PaginaGameDesignerSeres__CriarFicha.Provider>
    );
};
