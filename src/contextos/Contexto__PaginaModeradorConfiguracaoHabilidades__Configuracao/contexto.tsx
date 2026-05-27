'use client';

import { createContext, useContext, useState } from 'react';
import type { AtributoCompletaDto, DTO__CREATE__ModificadorHabilidade } from 'types-nora-api';

import useFormularioCreate, { defineFormularioCreate, type FormularioCreateEstado } from 'Hooks/useFormularioCreate';
import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useToast } from 'Hooks/useToast';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectCache } from 'Redux/slices/cacheSlice';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaModificadorHabilidade, deletaModificadorHabilidade } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { Contexto__PaginaModeradorConfiguracaoHabilidades__Props } from '../Contexto__PaginaModeradorConfiguracaoHabilidades/contexto';
import SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao from 'Conteineres/PaginaModeradorConfiguracaoHabilidades/paginas/SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao/SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao';

type FormularioNovoModificador = {
    nome: string;
    valor: string;
};

const FORMULARIO_CREATE_MODIFICADOR_HABILIDADE = defineFormularioCreate<FormularioNovoModificador>({
    valoresIniciais: { nome: '', valor: '' },
    campos: {
        nome: { tipo: 'text', label: 'Nome', obrigatorio: true, placeholder: 'Ex: Inteligência ampliada' },
        valor: { tipo: 'text', label: 'Valor', obrigatorio: true, placeholder: 'Ex: 1 ou -1' },
    },
});

interface Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props {
    habilidade: NonNullable<Contexto__PaginaModeradorConfiguracaoHabilidades__Props['habilidadeSelecionada']>;
    atributos: AtributoCompletaDto[];
    listagemModificadores: ReturnType<typeof useListagemModificadores>;
    idAtributoSelecionado: number | null;
    selecionaAtributo: (idAtributo: number | null) => void;
    formularioNovoModificador: FormularioCreateEstado<FormularioNovoModificador>;
    valorEhValido: boolean;
    podeSalvar: boolean;
    salvar: () => Promise<void>;
    excluirModificador: (idModificadorHabilidade: number, nome: string) => Promise<void>;
};

const Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao = createContext<Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao = (): Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Provider = ({ habilidade, deselecionaHabilidade }: { habilidade: Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Props['habilidade']; deselecionaHabilidade: Contexto__PaginaModeradorConfiguracaoHabilidades__Props['deselecionaHabilidade']; }) => {
    useConfigurarLayoutContextualizado({ subtitulo: habilidade.nome, fecharProps: { tipo: 'acao', executar: deselecionaHabilidade, tituloTooltip: 'Voltar para Listagem' } });

    const toast = useToast();
    const cache = useAppSelector(selectCache);
    const atributos = cache?.atributos ?? [];
    const listagemModificadores = useListagemModificadores(habilidade.id);
    const [idAtributoSelecionado, setIdAtributoSelecionado] = useState<number | null>(null);
    const formularioNovoModificador = useFormularioNovoModificador(habilidade.id, idAtributoSelecionado, listagemModificadores.recarregar);
    const valorEhValido = ehValorModificadorValido(formularioNovoModificador.valores.valor);
    const podeSalvar = idAtributoSelecionado !== null && valorEhValido && formularioNovoModificador.podeSalvar;

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        try {
            await formularioNovoModificador.salvar();
            formularioNovoModificador.reset();
            setIdAtributoSelecionado(null);
            await toast.sucesso('Modificador cadastrado', 'O modificador passivo foi vinculado à habilidade.');
        } catch (error) {
            await toast.erro('Falha ao cadastrar modificador', error instanceof Error ? error.message : 'Falha ao cadastrar modificador.');
        }
    };

    async function excluirModificador(idModificadorHabilidade: number, nome: string): Promise<void> {
        if (!window.confirm(`Deseja realmente excluir o modificador ${nome}?`)) return;

        try {
            await deletaModificadorHabilidade(idModificadorHabilidade);
            listagemModificadores.recarregar();
            await toast.sucesso('Modificador excluído', 'O modificador foi removido da habilidade.');
        } catch (error) {
            await toast.erro('Falha ao excluir modificador', error instanceof Error ? error.message : 'Falha ao excluir modificador.');
        }
    };

    return (
        <Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao.Provider value={{ habilidade, atributos, listagemModificadores, idAtributoSelecionado, selecionaAtributo: setIdAtributoSelecionado, formularioNovoModificador, valorEhValido, podeSalvar, salvar, excluirModificador }}>
            <SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao />
        </Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao.Provider>
    );
};

function useListagemModificadores(idHabilidade: number) {
    return useNoraGraphQLListagem('ModificadorHabilidade', {
        select: ['id', 'nome', 'propriedades'],
        whereFixo: { habilidade: { id: idHabilidade } },
        itensPorPagina: 20,
        carregando: 'Buscando Modificadores',
        mensagemErro: 'Houve um erro recuperando os Modificadores da Habilidade',
        mensagemListaVazia: 'Nenhum modificador passivo cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum modificador passivo cadastrado.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

function useFormularioNovoModificador(idHabilidade: number, idAtributoSelecionado: number | null, recarregaListagem: () => void): FormularioCreateEstado<FormularioNovoModificador> {
    return useFormularioCreate(FORMULARIO_CREATE_MODIFICADOR_HABILIDADE, async payload => {
        if (idAtributoSelecionado === null || !ehValorModificadorValido(payload.valor)) return;

        const payloadCreate: DTO__CREATE__ModificadorHabilidade = { idHabilidade, nome: payload.nome, propriedades: { tipo: 'atributo', idAtributo: idAtributoSelecionado, valor: Number(payload.valor) } };
        await criaModificadorHabilidade(payloadCreate);
        recarregaListagem();
    });
};

function ehValorModificadorValido(valorInformado: string): boolean {
    const valor = Number(valorInformado);

    return valorInformado.trim().length > 0 && Number.isInteger(valor) && valor !== 0;
};
