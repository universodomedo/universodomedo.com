'use client';

import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { ComunicacaoTipoSer, DTO__CREATE__TipoSer, OpcoesAtributosGeraisTipoSerDto, RaciocinioTipoSer, TamanhoTipoSer, ValorParametroAcaoInata } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaTipoSer, editaTipoSer as editaTipoSerBackend, obtemOpcoesAtributosGeraisTipoSer } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/paginas/SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer/SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer';
import { atualizaValorParametro, criaValoresFormulario, montaValoresParametros, type FormularioTipoSer, type FormularioTipoSerCapacidade } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/contexto';
import { useListagemCapacidadesInatas, type RegistroTipoSer } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

type ParametrosAcoesTipoSerFormulario = readonly { readonly idAcaoInata: number; readonly parametros: readonly ValorParametroAcaoInata[]; }[];

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer__Props {
    tipoSerInicial: RegistroTipoSer | null;
    aoVoltar: () => void;
};

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer__Valor {
    formularioTipoSer: FormularioTipoSer;
    setFormularioTipoSer: Dispatch<SetStateAction<FormularioTipoSer>>;
    listagemCapacidades: ReturnType<typeof useListagemCapacidadesInatas>;
    opcoesTipoSer: OpcoesAtributosGeraisTipoSerDto | null;
    idCapacidadeSelecionada: string;
    setIdCapacidadeSelecionada: Dispatch<SetStateAction<string>>;
    aoVoltar: () => void;
    adicionaCapacidadeSelecionada: () => void;
    removeCapacidadeTipoSer: (idCapacidadeInata: number) => void;
    atualizaParametroTipoSer: (idCapacidadeInata: number, idAcaoInata: number, chave: string, valor: string) => void;
    salvaTipoSer: () => Promise<void>;
};

const Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer = createContext<Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer__Valor | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer = (): Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer__Valor => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer__Provider = (props: Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: props.tipoSerInicial ? props.tipoSerInicial.nome : 'Novo Tipo de Ser', fecharProps: { tipo: 'acao', executar: props.aoVoltar, tituloTooltip: 'Voltar para Listagem' } });

    const listagemCapacidades = useListagemCapacidadesInatas();
    const [opcoesTipoSer, setOpcoesTipoSer] = useState<OpcoesAtributosGeraisTipoSerDto | null>(null);
    const [formularioTipoSer, setFormularioTipoSer] = useState<FormularioTipoSer>(() => criaFormularioTipoSer(props.tipoSerInicial, listagemCapacidades, null));
    const [idCapacidadeSelecionada, setIdCapacidadeSelecionada] = useState('');
    const [capacidadesIniciaisSincronizadas, setCapacidadesIniciaisSincronizadas] = useState(false);

    useEffect(() => {
        obtemOpcoesAtributosGeraisTipoSer().then(opcoes => {
            setOpcoesTipoSer(opcoes);
            setFormularioTipoSer(formularioAtual => props.tipoSerInicial ? formularioAtual : preencheOpcoesPadraoFormularioTipoSer(formularioAtual, opcoes));
        }).catch(() => setOpcoesTipoSer(null));
    }, [props.tipoSerInicial]);

    useEffect(() => {
        if (!props.tipoSerInicial) return;
        if (capacidadesIniciaisSincronizadas) return;
        if (listagemCapacidades.registros.length === 0) return;

        setFormularioTipoSer(criaFormularioTipoSer(props.tipoSerInicial, listagemCapacidades, opcoesTipoSer));
        setCapacidadesIniciaisSincronizadas(true);
    }, [capacidadesIniciaisSincronizadas, listagemCapacidades, opcoesTipoSer, props.tipoSerInicial]);

    function adicionaCapacidadeSelecionada(): void {
        const idCapacidadeInata = Number(idCapacidadeSelecionada);
        if (!Number.isInteger(idCapacidadeInata) || idCapacidadeInata < 1) return;
        if (formularioTipoSer.capacidades.some(capacidade => capacidade.idCapacidadeInata === idCapacidadeInata)) return;

        const capacidade = criaCapacidadeFormularioTipoSer(idCapacidadeInata, [], listagemCapacidades);
        if (!capacidade) return;

        setFormularioTipoSer(formularioAtual => ({ ...formularioAtual, capacidades: [...formularioAtual.capacidades, capacidade] }));
        setIdCapacidadeSelecionada('');
    };

    function removeCapacidadeTipoSer(idCapacidadeInata: number): void {
        setFormularioTipoSer(formularioAtual => ({ ...formularioAtual, capacidades: formularioAtual.capacidades.filter(capacidade => capacidade.idCapacidadeInata !== idCapacidadeInata) }));
    };

    function atualizaParametroTipoSer(idCapacidadeInata: number, idAcaoInata: number, chave: string, valor: string): void {
        setFormularioTipoSer(formularioAtual => ({
            ...formularioAtual,
            capacidades: formularioAtual.capacidades.map(capacidade => capacidade.idCapacidadeInata === idCapacidadeInata ? { ...capacidade, parametrosAcoes: capacidade.parametrosAcoes.map(acao => acao.idAcaoInata === idAcaoInata ? { ...acao, parametros: atualizaValorParametro(acao.parametros, chave, valor) } : acao) } : capacidade),
        }));
    };

    async function salvaTipoSer(): Promise<void> {
        try {
            if (formularioTipoSer.id === null) await criaTipoSer(montaPayloadTipoSer(formularioTipoSer, opcoesTipoSer));
            else await editaTipoSerBackend({ ...montaPayloadTipoSer(formularioTipoSer, opcoesTipoSer), idTipoSer: formularioTipoSer.id });

            await toast.sucesso(formularioTipoSer.id === null ? 'Tipo de ser criado' : 'Tipo de ser atualizado', formularioTipoSer.nome.trim());
            props.aoVoltar();
        } catch {
            await toast.erro('Falha ao salvar tipo de ser', 'Confira os campos e tente novamente.');
        }
    };

    return (
        <Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer.Provider value={{ formularioTipoSer, setFormularioTipoSer, listagemCapacidades, opcoesTipoSer, idCapacidadeSelecionada, setIdCapacidadeSelecionada, aoVoltar: props.aoVoltar, adicionaCapacidadeSelecionada, removeCapacidadeTipoSer, atualizaParametroTipoSer, salvaTipoSer }}>
            <SPA__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer />
        </Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer.Provider>
    );
};

function criaFormularioTipoSer(tipoSerInicial: RegistroTipoSer | null, listagemCapacidades: ReturnType<typeof useListagemCapacidadesInatas>, opcoesTipoSer: OpcoesAtributosGeraisTipoSerDto | null): FormularioTipoSer {
    if (!tipoSerInicial) return { id: null, nome: '', descricao: '', tamanho: opcoesTipoSer?.tamanhos[0]?.chave ?? '', pesoKg: '', limiteCargaKg: '', raciocinio: opcoesTipoSer?.raciocinios[0]?.chave ?? '', comunicacao: opcoesTipoSer?.comunicacoes[0]?.chave ?? '', capacidades: [] };

    const capacidades: FormularioTipoSerCapacidade[] = [];

    for (const capacidade of tipoSerInicial.capacidades.itens) {
        const capacidadeFormulario = criaCapacidadeFormularioTipoSer(capacidade.capacidadeInata.id, capacidade.parametrosAcoes, listagemCapacidades);
        if (capacidadeFormulario) capacidades.push(capacidadeFormulario);
    }

    return {
        id: tipoSerInicial.id,
        nome: tipoSerInicial.nome,
        descricao: tipoSerInicial.descricao,
        tamanho: tipoSerInicial.tamanho,
        pesoKg: String(tipoSerInicial.pesoKg),
        limiteCargaKg: String(tipoSerInicial.limiteCargaKg),
        raciocinio: tipoSerInicial.raciocinio,
        comunicacao: tipoSerInicial.comunicacao,
        capacidades,
    };
};

function criaCapacidadeFormularioTipoSer(idCapacidadeInata: number, parametrosAcoes: ParametrosAcoesTipoSerFormulario, listagemCapacidades: ReturnType<typeof useListagemCapacidadesInatas>): FormularioTipoSerCapacidade | null {
    const capacidade = listagemCapacidades.registros.find(capacidadeAtual => capacidadeAtual.id === idCapacidadeInata);
    if (!capacidade) return null;

    return {
        idCapacidadeInata: capacidade.id,
        nomeCapacidade: capacidade.nome,
        parametrosAcoes: capacidade.acoes.itens.map(acao => {
            const parametrosConfigurados = parametrosAcoes.find(parametrosAcao => parametrosAcao.idAcaoInata === acao.acaoInata.id)?.parametros ?? acao.parametrosPadrao;
            return { idAcaoInata: acao.acaoInata.id, nomeAcao: acao.acaoInata.nome, parametros: criaValoresFormulario(acao.acaoInata.parametros, parametrosConfigurados) };
        }),
    };
};

function montaPayloadTipoSer(formulario: FormularioTipoSer, opcoesTipoSer: OpcoesAtributosGeraisTipoSerDto | null): DTO__CREATE__TipoSer {
    if (!opcoesTipoSer) throw new Error('Opções de tipo de ser não carregadas.');

    return {
        nome: formulario.nome.trim(),
        descricao: formulario.descricao.trim(),
        tamanho: resolveTamanho(formulario.tamanho, opcoesTipoSer),
        pesoKg: resolveNumeroKg(formulario.pesoKg, 'peso'),
        limiteCargaKg: resolveNumeroKg(formulario.limiteCargaKg, 'limite de carga'),
        raciocinio: resolveRaciocinio(formulario.raciocinio, opcoesTipoSer),
        comunicacao: resolveComunicacao(formulario.comunicacao, opcoesTipoSer),
        capacidades: formulario.capacidades.map(capacidade => ({ idCapacidadeInata: capacidade.idCapacidadeInata, parametrosAcoes: capacidade.parametrosAcoes.map(acao => ({ idAcaoInata: acao.idAcaoInata, parametros: montaValoresParametros(acao.parametros, false) })) })),
    };
};

function preencheOpcoesPadraoFormularioTipoSer(formulario: FormularioTipoSer, opcoesTipoSer: OpcoesAtributosGeraisTipoSerDto): FormularioTipoSer {
    return {
        ...formulario,
        tamanho: formulario.tamanho || opcoesTipoSer.tamanhos[0]?.chave || '',
        raciocinio: formulario.raciocinio || opcoesTipoSer.raciocinios[0]?.chave || '',
        comunicacao: formulario.comunicacao || opcoesTipoSer.comunicacoes[0]?.chave || '',
    };
};

function resolveNumeroKg(valorTexto: string, nomeCampo: string): number {
    const valor = Number(valorTexto.trim());
    if (!Number.isFinite(valor)) throw new Error(`Informe ${nomeCampo} em kg.`);

    return valor;
};

function resolveTamanho(valor: string, opcoesTipoSer: OpcoesAtributosGeraisTipoSerDto): TamanhoTipoSer {
    if (!opcoesTipoSer.tamanhos.some(opcao => opcao.chave === valor)) throw new Error('Tamanho inválido.');

    return valor as TamanhoTipoSer;
};

function resolveRaciocinio(valor: string, opcoesTipoSer: OpcoesAtributosGeraisTipoSerDto): RaciocinioTipoSer {
    if (!opcoesTipoSer.raciocinios.some(opcao => opcao.chave === valor)) throw new Error('Raciocínio inválido.');

    return valor as RaciocinioTipoSer;
};

function resolveComunicacao(valor: string, opcoesTipoSer: OpcoesAtributosGeraisTipoSerDto): ComunicacaoTipoSer {
    if (!opcoesTipoSer.comunicacoes.some(opcao => opcao.chave === valor)) throw new Error('Comunicação inválida.');

    return valor as ComunicacaoTipoSer;
};