'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { atualizaVinculoNecessidadeDocumentacao, removeVinculoNecessidadeDocumentacao, vinculaNecessidadeDocumentacao } from 'Uteis/ApiConsumer/DocumentacaoProdutoMiddleware';
import type { CamposEditoriaisDocumentacao, Contexto__PaginaDocumentacaoProduto__Props, RegistroDocumentacaoPagina, RegistroNecessidade, RegistroPaginaParaDocumentar } from '../Contexto__PaginaDocumentacaoProduto/contexto';
import SPA__PaginaDocumentacaoProduto__Documentacao from 'Conteineres/PaginaDocumentacaoProduto/paginas/SPA__PaginaDocumentacaoProduto__Documentacao/SPA__PaginaDocumentacaoProduto__Documentacao';

export type RegistroVinculoNecessidade = ReturnType<typeof obtemListagemVinculos>['registros'][number];

import type { ComposicaoPagina } from 'types-nora-api';

// composicao: '' = ainda não definido; senão o enum de mutabilidade da página.
export type FormDocumentacao = { objetivo: string; informacoesConsumidas: string; informacoesGeradas: string; statusImplementacao: string; composicao: '' | ComposicaoPagina; composicaoDescricao: string };

export interface Contexto__PaginaDocumentacaoProduto__Documentacao__Props {
    documentacaoExiste: boolean;
    form: FormDocumentacao;
    salvando: boolean;
    erro: string | null;
    setCampo: <K extends keyof FormDocumentacao>(campo: K, valor: FormDocumentacao[K]) => void;
    salvar: () => Promise<void>;
    listagemVinculos: ReturnType<typeof obtemListagemVinculos>;
    necessidadesDisponiveis: RegistroNecessidade[];
    nomePersonaPorId: (idPersona: number) => string;
    vincular: (fkNecessidadesId: number, motivo: string, atendida: boolean) => Promise<void>;
    alternarAtendida: (vinculo: RegistroVinculoNecessidade) => Promise<void>;
    removerVinculo: (idVinculo: number) => Promise<void>;
    idPagina: number;
    listagemPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemPersonas'];
    listagemCtas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtas'];
    listagemTiposSecao: Contexto__PaginaDocumentacaoProduto__Props['listagemTiposSecao'];
};

type PropsProvider = {
    pagina: RegistroPaginaParaDocumentar;
    documentacao: RegistroDocumentacaoPagina | null;
    listagemPersonas: Contexto__PaginaDocumentacaoProduto__Props['listagemPersonas'];
    listagemNecessidades: Contexto__PaginaDocumentacaoProduto__Props['listagemNecessidades'];
    listagemCtas: Contexto__PaginaDocumentacaoProduto__Props['listagemCtas'];
    listagemTiposSecao: Contexto__PaginaDocumentacaoProduto__Props['listagemTiposSecao'];
    salvarDocumentacao: (campos: CamposEditoriaisDocumentacao) => Promise<void>;
    voltar: () => void;
};

const Contexto__PaginaDocumentacaoProduto__Documentacao = createContext<Contexto__PaginaDocumentacaoProduto__Documentacao__Props | undefined>(undefined);

export const useContexto__PaginaDocumentacaoProduto__Documentacao = (): Contexto__PaginaDocumentacaoProduto__Documentacao__Props => {
    const context = useContext(Contexto__PaginaDocumentacaoProduto__Documentacao);
    if (!context) throw new Error('useContexto__PaginaDocumentacaoProduto__Documentacao precisa estar dentro de um Contexto__PaginaDocumentacaoProduto__Documentacao');
    return context;
};

function formDeDocumentacao(documentacao: RegistroDocumentacaoPagina | null): FormDocumentacao {
    return { objetivo: documentacao?.objetivo ?? '', informacoesConsumidas: documentacao?.informacoesConsumidas ?? '', informacoesGeradas: documentacao?.informacoesGeradas ?? '', statusImplementacao: documentacao?.statusImplementacao ?? '', composicao: (documentacao?.composicao as '' | ComposicaoPagina | undefined) ?? '', composicaoDescricao: documentacao?.composicaoDescricao ?? '' };
};

export const Contexto__PaginaDocumentacaoProduto__Documentacao__Provider = ({ pagina, documentacao, listagemPersonas, listagemNecessidades, listagemCtas, listagemTiposSecao, salvarDocumentacao, voltar }: PropsProvider) => {
    const [form, setForm] = useState<FormDocumentacao>(formDeDocumentacao(documentacao));
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);

    const idDocumentacao = documentacao?.id ?? null;

    // Re-inicializa o form quando a documentação materializa/troca (ex.: primeiro salvamento cria o registro e a listagem recarrega).
    useEffect(() => { setForm(formDeDocumentacao(documentacao)); }, [idDocumentacao]);

    // Navegação contextual: título estável (da PÁGINA); subtítulo identifica a EDIÇÃO; o X volta pro verbete em leitura. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: `${pagina.label} — Edição`,
        fecharProps: { tipo: 'acao', executar: voltar, tituloTooltip: 'Voltar para o verbete' },
    });

    const listagemVinculos = obtemListagemVinculos(idDocumentacao);

    const setCampo = useCallback(<K extends keyof FormDocumentacao>(campo: K, valor: FormDocumentacao[K]) => setForm(f => ({ ...f, [campo]: valor })), []);

    const salvar = useCallback(async (): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            const paraNulo = (valor: string): string | null => valor.trim().length > 0 ? valor.trim() : null;
            await salvarDocumentacao({ objetivo: paraNulo(form.objetivo), informacoesConsumidas: paraNulo(form.informacoesConsumidas), informacoesGeradas: paraNulo(form.informacoesGeradas), statusImplementacao: paraNulo(form.statusImplementacao), composicao: form.composicao === '' ? null : form.composicao, composicaoDescricao: form.composicao === 'SUPERFICIE_CONFIGURAVEL' ? paraNulo(form.composicaoDescricao) : null });
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível salvar a documentação.');
        } finally {
            setSalvando(false);
        }
    }, [form, salvarDocumentacao]);

    const nomePersonaPorId = useCallback((idPersona: number): string => listagemPersonas.registros.find(persona => persona.id === idPersona)?.nome ?? `Persona #${idPersona}`, [listagemPersonas.registros]);

    // Opções do dropdown de vínculo: necessidades ainda NÃO vinculadas a esta documentação.
    const necessidadesDisponiveis = useMemo<RegistroNecessidade[]>(() => {
        const jaVinculadas = new Set(listagemVinculos.registros.map(vinculo => vinculo.necessidade.id));
        return listagemNecessidades.registros.filter(necessidade => !jaVinculadas.has(necessidade.id));
    }, [listagemNecessidades.registros, listagemVinculos.registros]);

    const recarregarVinculos = listagemVinculos.recarregar;
    const vincular = useCallback(async (fkNecessidadesId: number, motivo: string, atendida: boolean): Promise<void> => {
        if (idDocumentacao === null) return;
        await vinculaNecessidadeDocumentacao({ fkDocumentacoesPaginasId: idDocumentacao, fkNecessidadesId, motivo, atendida });
        recarregarVinculos();
    }, [idDocumentacao, recarregarVinculos]);
    const alternarAtendida = useCallback(async (vinculo: RegistroVinculoNecessidade): Promise<void> => {
        await atualizaVinculoNecessidadeDocumentacao({ id: vinculo.id, motivo: vinculo.motivo, atendida: !vinculo.atendida });
        recarregarVinculos();
    }, [recarregarVinculos]);
    const removerVinculo = useCallback(async (idVinculo: number): Promise<void> => {
        await removeVinculoNecessidadeDocumentacao({ id: idVinculo });
        recarregarVinculos();
    }, [recarregarVinculos]);

    return (
        <Contexto__PaginaDocumentacaoProduto__Documentacao.Provider value={{ documentacaoExiste: idDocumentacao !== null, form, salvando, erro, setCampo, salvar, listagemVinculos, necessidadesDisponiveis, nomePersonaPorId, vincular, alternarAtendida, removerVinculo, idPagina: pagina.id, listagemPersonas, listagemCtas, listagemTiposSecao }}>
            <SPA__PaginaDocumentacaoProduto__Documentacao />
        </Contexto__PaginaDocumentacaoProduto__Documentacao.Provider>
    );
};

//

// Vínculos de necessidade DESTA documentação (escopo estrutural via whereFixo; id 0 = documentação ainda não criada → lista vazia).
function obtemListagemVinculos(idDocumentacao: number | null) {
    const whereFixo = useMemo(() => ({ fkDocumentacoesPaginasId: { eq: idDocumentacao ?? 0 } }), [idDocumentacao]);
    return useNoraGraphQLListagem('DocumentacaoPaginaNecessidade', {
        select: ['id', 'fkDocumentacoesPaginasId', 'motivo', 'atendida', { necessidade: ['id', 'titulo', 'fkPersonasId'] }],
        whereFixo,
        itensPorPagina: 100,
        carregando: 'Buscando necessidades vinculadas',
        mensagemErro: 'Houve um erro recuperando as necessidades vinculadas',
        mensagemListaVazia: 'Nenhuma necessidade vinculada ainda.',
        mensagemListaVaziaComFiltro: 'Nenhuma necessidade encontrada.',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};