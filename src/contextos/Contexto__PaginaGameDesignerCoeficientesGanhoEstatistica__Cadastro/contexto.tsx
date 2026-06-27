'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { CLASSES, EventosApiRest, type AtributoCompletaDto, type ClasseDto, type EstatisticaDanificavelCompletaDto, type PAYLOAD__CriarCoeficienteGanhoEstatistica } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { useCache } from 'Redux/hooks/useCache';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props } from '../Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica/contexto';
import SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro from 'Conteineres/PaginaGameDesignerCoeficientesGanhoEstatistica/paginas/SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro/SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro';

const TOLERANCIA_SOMA_PESOS = 0.011;

interface Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro__Props {
    classesDisponiveis: readonly ClasseDto[];
    estatisticasDisponiveis: readonly EstatisticaDanificavelCompletaDto[];
    atributos: readonly AtributoCompletaDto[];
    idClasse: string;
    setIdClasse: (valor: string) => void;
    idEstatistica: string;
    setIdEstatistica: (valor: string) => void;
    valorCoeficiente: string;
    setValorCoeficiente: (valor: string) => void;
    pesoDoAtributo: (idAtributo: number) => string;
    setPesoDoAtributo: (idAtributo: number, valor: string) => void;
    somaPesos: number;
    somaValida: boolean;
    salvando: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    cancelar: () => void;
};

type PropsProvider = {
    cancelaCadastro: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props['cancelaCadastro'];
    concluiCadastro: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props['concluiCadastro'];
    coeficientesExistentes: Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Props['coeficientesExistentes'];
};

const Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro = createContext<Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro = (): Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro precisa estar dentro de um Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro');
    return context;
};

export const Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro__Provider = ({ cancelaCadastro, concluiCadastro, coeficientesExistentes }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Novo Coeficiente', fecharProps: { tipo: 'acao', executar: cancelaCadastro, tituloTooltip: 'Voltar para Listagem' } });

    const cache = useCache();
    const classes = cache.pronto ? cache.classes : [];
    const estatisticas = cache.pronto ? cache.estatisticasDanificaveis : [];
    const atributos = cache.pronto ? cache.atributos : [];
    const [idClasse, setIdClasse] = useState<string>('');
    const [idEstatistica, setIdEstatistica] = useState<string>('');
    const [valorCoeficiente, setValorCoeficiente] = useState<string>('');
    const [pesos, setPesos] = useState<Record<number, string>>({});
    const [salvando, setSalvando] = useState<boolean>(false);

    const classesDisponiveis = useMemo(() => classes.filter(classe => classe.id !== CLASSES.GENERICO.id && coeficientesExistentes.filter(coeficiente => coeficiente.idClasse === classe.id).length < estatisticas.length), [classes, estatisticas, coeficientesExistentes]);
    const estatisticasDisponiveis = useMemo(() => idClasse === '' ? [] : estatisticas.filter(estatistica => !coeficientesExistentes.some(coeficiente => coeficiente.idClasse === Number(idClasse) && coeficiente.idEstatisticaDanificavel === estatistica.id)), [idClasse, estatisticas, coeficientesExistentes]);

    function selecionaClasse(valor: string): void {
        setIdClasse(valor);
        setIdEstatistica('');
    };

    function pesoDoAtributo(idAtributo: number): string { return pesos[idAtributo] ?? '0'; };
    function setPesoDoAtributo(idAtributo: number, valor: string): void { setPesos(atuais => ({ ...atuais, [idAtributo]: valor })); };

    const somaPesos = atributos.reduce((acumulado, atributo) => acumulado + (Number(pesoDoAtributo(atributo.id)) || 0), 0);
    const somaValida = Math.abs(somaPesos - 1) <= TOLERANCIA_SOMA_PESOS;
    const valorCoeficienteNumero = Number(valorCoeficiente);
    const valorCoeficienteValido = valorCoeficiente.trim() !== '' && Number.isFinite(valorCoeficienteNumero) && valorCoeficienteNumero >= 0;
    const podeSalvar = cache.pronto && idClasse !== '' && idEstatistica !== '' && valorCoeficienteValido && somaValida && !salvando;

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;
        setSalvando(true);

        try {
            const payload: PAYLOAD__CriarCoeficienteGanhoEstatistica = { idClasse: Number(idClasse), idEstatisticaDanificavel: Number(idEstatistica), coeficiente: valorCoeficienteNumero, ganhosRelativos: atributos.map(atributo => ({ fkAtributosId: atributo.id, valorPorcentagem: Number(pesoDoAtributo(atributo.id)) || 0 })) };
            await NoraApi.RestPOST(EventosApiRest.POST.CoeficienteGanhoEstatistica.criar, payload, { mensagemErro: 'Não foi possível criar o Coeficiente.' });
            concluiCadastro();
        } finally {
            setSalvando(false);
        }
    };

    return (
        <Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro.Provider value={{ classesDisponiveis, estatisticasDisponiveis, atributos, idClasse, setIdClasse: selecionaClasse, idEstatistica, setIdEstatistica, valorCoeficiente, setValorCoeficiente, pesoDoAtributo, setPesoDoAtributo, somaPesos, somaValida, salvando, podeSalvar, salvar, cancelar: cancelaCadastro }}>
            <SPA__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro />
        </Contexto__PaginaGameDesignerCoeficientesGanhoEstatistica__Cadastro.Provider>
    );
};
