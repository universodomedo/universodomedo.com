'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { EventosApiRest, type AtributoCompletaDto, type PAYLOAD__AtualizarCoeficienteGanhoEstatistica } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useCache } from 'Redux/hooks/useCache';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props } from '../Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica/contexto';
import SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao from 'Conteineres/PaginaGameDesignerCoeficientesGanhoEstatistica/paginas/SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao/SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao';

type RegistroCoeficiente = NonNullable<Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props['coeficienteSelecionado']>;

const TOLERANCIA_SOMA_PESOS = 0.011;

interface Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao__Props {
    classeNome: string;
    estatisticaNome: string;
    atributos: readonly AtributoCompletaDto[];
    valorCoeficiente: string;
    setValorCoeficiente: (valor: string) => void;
    pesoDoAtributo: (idAtributo: number) => string;
    setPesoDoAtributo: (idAtributo: number, valor: string) => void;
    somaPesos: number;
    somaValida: boolean;
    salvando: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    voltar: () => void;
};

type PropsProvider = {
    coeficiente: RegistroCoeficiente;
    voltaParaListagem: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props['voltaParaListagem'];
    concluiEdicao: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props['concluiEdicao'];
};

const Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao = createContext<Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao = (): Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao precisa estar dentro de um Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao');
    return context;
};

export const Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao__Provider = ({ coeficiente, voltaParaListagem, concluiEdicao }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Editar Coeficiente', fecharProps: { tipo: 'acao', executar: voltaParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const cache = useCache();
    const atributos = cache.pronto ? cache.atributos : [];
    const [valorCoeficiente, setValorCoeficiente] = useState<string>(String(coeficiente.coeficiente));
    const [pesosEditados, setPesosEditados] = useState<Record<number, string>>({});
    const [salvando, setSalvando] = useState<boolean>(false);

    const pesosIniciais = useMemo<Record<number, string>>(() => {
        const mapa: Record<number, string> = {};
        for (const atributo of atributos) {
            const ganho = coeficiente.ganhosRelativos.find(ganhoRelativo => ganhoRelativo.fkAtributosId === atributo.id);
            mapa[atributo.id] = ganho ? String(ganho.valorPorcentagem) : '0';
        }
        return mapa;
    }, [atributos, coeficiente.ganhosRelativos]);

    function pesoDoAtributo(idAtributo: number): string { return pesosEditados[idAtributo] ?? pesosIniciais[idAtributo] ?? '0'; };
    function setPesoDoAtributo(idAtributo: number, valor: string): void { setPesosEditados(atuais => ({ ...atuais, [idAtributo]: valor })); };

    const somaPesos = atributos.reduce((acumulado, atributo) => acumulado + (Number(pesoDoAtributo(atributo.id)) || 0), 0);
    const somaValida = Math.abs(somaPesos - 1) <= TOLERANCIA_SOMA_PESOS;
    const valorCoeficienteNumero = Number(valorCoeficiente);
    const valorCoeficienteValido = Number.isFinite(valorCoeficienteNumero) && valorCoeficienteNumero >= 0;
    const podeSalvar = cache.pronto && atributos.length > 0 && valorCoeficienteValido && somaValida && !salvando;

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;
        setSalvando(true);

        try {
            const payload: PAYLOAD__AtualizarCoeficienteGanhoEstatistica = { idCoeficiente: coeficiente.id, coeficiente: valorCoeficienteNumero, ganhosRelativos: atributos.map(atributo => ({ fkAtributosId: atributo.id, valorPorcentagem: Number(pesoDoAtributo(atributo.id)) || 0 })) };
            await NoraApi.RestPOST(EventosApiRest.POST.CoeficienteGanhoEstatistica.atualizar, payload, { mensagemErro: 'Não foi possível salvar o Coeficiente.' });
            concluiEdicao();
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao.Provider value={{ classeNome: coeficiente.classe.nome, estatisticaNome: coeficiente.estatisticaDanificavel.nome, atributos, valorCoeficiente, setValorCoeficiente, pesoDoAtributo, setPesoDoAtributo, somaPesos, somaValida, salvando, podeSalvar, salvar, voltar: voltaParaListagem }}>
            <SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao />
        </Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Edicao.Provider>
    );
};
