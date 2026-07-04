'use client';

import { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { ConfiguracaoPartida, KeySerEmSala, PartidaResumo, SerEmSala } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { criaConfiguracaoVazia, criaCondicaoVitoria, configuracaoEstaPreenchida, garanteTemporal, rotuloSer, rotuloObjeto, rotuloDescoberta, type DescobertaCondicionada, type GrupoSeres, type Interagivel, type TipoCondicaoVitoria } from './editorConfiguracao.compartilhado';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Formulario__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Formulario/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigDescoberta__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigDescoberta/contexto';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao/contexto';

type SubVista = 'formulario' | 'selecaoSer' | 'configSer' | 'configObjeto' | 'configDescoberta';

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props {
    partida: PartidaResumo;
    config: ConfiguracaoPartida;
    nomesPorIdSer: Record<number, string>;
    salvando: boolean;
    podeSalvar: boolean;
    subVista: SubVista;
    grupoEmFoco: GrupoSeres;
    serEmEdicaoKey: KeySerEmSala | null;
    objetoEmEdicaoKey: string | null;
    descobertaEmEdicaoKey: string | null;
    irParaSelecaoSer: (grupo: GrupoSeres) => void;
    adicionaSerComReferencia: (grupo: GrupoSeres, idSer: number) => void;
    irParaConfigSer: (grupo: GrupoSeres, key: KeySerEmSala) => void;
    adicionaEConfiguraObjeto: () => void;
    irParaConfigObjeto: (key: string) => void;
    adicionaEConfiguraDescoberta: () => void;
    irParaConfigDescoberta: (key: string) => void;
    voltarParaFormulario: () => void;
    atualizaConfig: (parcial: Partial<ConfiguracaoPartida>) => void;
    selecionaTipoCondicaoVitoria: (tipo: TipoCondicaoVitoria) => void;
    atualizaCenario: (parcial: Partial<ConfiguracaoPartida['cenario']>) => void;
    atualizaMapaLogico: (parcial: Partial<ConfiguracaoPartida['cenario']['mapaLogico']>) => void;
    removeSerEmSala: (grupo: GrupoSeres, key: KeySerEmSala) => void;
    atualizaSerEmSala: (grupo: GrupoSeres, key: KeySerEmSala, parcial: Partial<SerEmSala>) => void;
    removeDescoberta: (key: string) => void;
    atualizaDescoberta: (key: string, parcial: Partial<DescobertaCondicionada>) => void;
    removeObjeto: (key: string) => void;
    atualizaObjeto: (key: string, parcial: Partial<Interagivel>) => void;
    salvarConfiguracao: () => Promise<void>;
};

type PropsProvider = {
    partida: PartidaResumo;
    configuracaoInicial: ConfiguracaoPartida | null;
    salvando: boolean;
    salvar: (configuracao: ConfiguracaoPartida) => Promise<void>;
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Editor = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Editor precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Editor');
    return context;
};

// Controlador de Fluxo do Runtime: dono do config (dado), dos helpers de edição e da sub-vista ativa.
// O resolveSaida abaixo decide qual vista renderiza (formulário / seleção de Ser / config do Ser / objeto / descoberta) — nunca uma SPA.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider = ({ partida, configuracaoInicial, salvando, salvar }: PropsProvider) => {
    // Contador inicia acima do maior índice já existente no config carregado — senão uma key nova (ex.: CONTROLAVEL_1) colide com uma key salva.
    const contadorKeysRef = useRef(configuracaoInicial ? maiorIndiceKeyConfig(configuracaoInicial) : 0);
    const [config, setConfig] = useState<ConfiguracaoPartida>(() => garanteTemporal(configuracaoInicial ?? criaConfiguracaoVazia()));
    const [subVista, setSubVista] = useState<SubVista>('formulario');
    const [grupoEmFoco, setGrupoEmFoco] = useState<GrupoSeres>('controlaveis');
    const [serEmEdicaoKey, setSerEmEdicaoKey] = useState<KeySerEmSala | null>(null);
    const [objetoEmEdicaoKey, setObjetoEmEdicaoKey] = useState<string | null>(null);
    const [descobertaEmEdicaoKey, setDescobertaEmEdicaoKey] = useState<string | null>(null);
    const { setAba } = useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao();
    // Mapa id->nome dos Seres, carregado UMA vez aqui e exposto a todos os subfluxos — nunca exibir id em tela.
    const nomesPorIdSer = useNomesPorIdSer();

    function criaKeySerEmSala(grupo: GrupoSeres): KeySerEmSala {
        contadorKeysRef.current += 1;
        return `SER_EM_SALA:${grupo === 'controlaveis' ? 'CONTROLAVEL' : 'NAO_CONTROLAVEL'}_${contadorKeysRef.current}`;
    };

    function atualizaConfig(parcial: Partial<ConfiguracaoPartida>): void { setConfig(atual => ({ ...atual, ...parcial })); };
    function selecionaTipoCondicaoVitoria(tipo: TipoCondicaoVitoria): void { atualizaConfig({ condicaoVitoria: criaCondicaoVitoria(tipo) }); };
    function atualizaCenario(parcial: Partial<ConfiguracaoPartida['cenario']>): void { setConfig(atual => ({ ...atual, cenario: { ...atual.cenario, ...parcial } })); };
    function atualizaMapaLogico(parcial: Partial<ConfiguracaoPartida['cenario']['mapaLogico']>): void { setConfig(atual => ({ ...atual, cenario: { ...atual.cenario, mapaLogico: { ...atual.cenario.mapaLogico, ...parcial } } })); };

    function removeSerEmSala(grupo: GrupoSeres, key: KeySerEmSala): void { setConfig(atual => ({ ...atual, [grupo]: atual[grupo].filter(ser => ser.key !== key) })); };
    function atualizaSerEmSala(grupo: GrupoSeres, key: KeySerEmSala, parcial: Partial<SerEmSala>): void { setConfig(atual => ({ ...atual, [grupo]: atual[grupo].map(ser => ser.key === key ? { ...ser, ...parcial } : ser) })); };
    function adicionaSerComReferencia(grupo: GrupoSeres, idSer: number): void {
        const novo: SerEmSala = grupo === 'naoControlaveis'
            ? { key: criaKeySerEmSala(grupo), referencia: { tipo: 'Ser', id: idSer }, posicaoInicial: { x: 0, y: 0 }, percepcaoInicial: 'DESPERCEBIDO' }
            : { key: criaKeySerEmSala(grupo), referencia: { tipo: 'Ser', id: idSer }, posicaoInicial: { x: 0, y: 0 } };
        setConfig(atual => ({ ...atual, [grupo]: [...atual[grupo], novo] }));
    };

    function criaDescobertaVazia(): DescobertaCondicionada {
        contadorKeysRef.current += 1;
        return { key: `DESCOBERTA:${contadorKeysRef.current}`, nome: '', descricaoInterna: '', idCapacidadeInata: 0, recompensas: [] };
    };
    function removeDescoberta(key: string): void { setConfig(atual => ({ ...atual, descobertasCondicionadas: atual.descobertasCondicionadas.filter(descoberta => descoberta.key !== key) })); };
    function atualizaDescoberta(key: string, parcial: Partial<DescobertaCondicionada>): void { setConfig(atual => ({ ...atual, descobertasCondicionadas: atual.descobertasCondicionadas.map(descoberta => descoberta.key === key ? { ...descoberta, ...parcial } : descoberta) })); };

    function criaObjetoVazio(): Interagivel {
        contadorKeysRef.current += 1;
        return { key: `OBJETO:${contadorKeysRef.current}`, nome: '', tipo: 'objeto', descricao: '', posicao: { x: 0, y: 0 }, estadoPercepcaoInicial: 'PERCEBIDO', durabilidadeMaxima: 1 };
    };
    function removeObjeto(key: string): void { setConfig(atual => ({ ...atual, interagiveis: atual.interagiveis.filter(objeto => objeto.key !== key) })); };
    function atualizaObjeto(key: string, parcial: Partial<Interagivel>): void { setConfig(atual => ({ ...atual, interagiveis: atual.interagiveis.map(objeto => objeto.key === key ? { ...objeto, ...parcial } : objeto) })); };

    function irParaSelecaoSer(grupo: GrupoSeres): void { setGrupoEmFoco(grupo); setSubVista('selecaoSer'); };
    function irParaConfigSer(grupo: GrupoSeres, key: KeySerEmSala): void { setGrupoEmFoco(grupo); setSerEmEdicaoKey(key); setSubVista('configSer'); };
    function irParaConfigObjeto(key: string): void { setObjetoEmEdicaoKey(key); setSubVista('configObjeto'); };
    function adicionaEConfiguraObjeto(): void {
        const novo = criaObjetoVazio();
        setConfig(atual => ({ ...atual, interagiveis: [...atual.interagiveis, novo] }));
        irParaConfigObjeto(novo.key);
    };
    function irParaConfigDescoberta(key: string): void { setDescobertaEmEdicaoKey(key); setSubVista('configDescoberta'); };
    function adicionaEConfiguraDescoberta(): void {
        const nova = criaDescobertaVazia();
        setConfig(atual => ({ ...atual, descobertasCondicionadas: [...atual.descobertasCondicionadas, nova] }));
        irParaConfigDescoberta(nova.key);
    };
    function voltarParaFormulario(): void { setSerEmEdicaoKey(null); setObjetoEmEdicaoKey(null); setDescobertaEmEdicaoKey(null); setSubVista('formulario'); };

    async function salvarConfiguracao(): Promise<void> { if (configuracaoEstaPreenchida(config) && !salvando) await salvar(config); };

    const podeSalvar = configuracaoEstaPreenchida(config) && !salvando;

    // Dono único do layout contextual das subVistas: este contexto re-renderiza a cada troca de subVista, então re-aplica subtítulo + fecharProps e nunca deixa o estado obsoleto que sobraria se cada subfluxo escrevesse por conta própria (o hook não restaura no unmount). Identidade do alvo mora no subtítulo, não no corpo.
    useConfigurarLayoutContextualizado(layoutContextualDaSubVista({ subVista, grupoEmFoco, partida, config, nomesPorIdSer, serEmEdicaoKey, objetoEmEdicaoKey, descobertaEmEdicaoKey, voltarParaFormulario, voltarParaVisao: () => setAba('visao') }));

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Editor.Provider value={{ partida, config, nomesPorIdSer, salvando, podeSalvar, subVista, grupoEmFoco, serEmEdicaoKey, objetoEmEdicaoKey, descobertaEmEdicaoKey, irParaSelecaoSer, adicionaSerComReferencia, irParaConfigSer, adicionaEConfiguraObjeto, irParaConfigObjeto, adicionaEConfiguraDescoberta, irParaConfigDescoberta, voltarParaFormulario, atualizaConfig, selecionaTipoCondicaoVitoria, atualizaCenario, atualizaMapaLogico, removeSerEmSala, atualizaSerEmSala, removeDescoberta, atualizaDescoberta, removeObjeto, atualizaObjeto, salvarConfiguracao }}>
            <ConteinerInterno__Editor />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Editor.Provider>
    );
};

// Nomes dos Seres (id -> nome) — carregado uma vez no Editor; todos os cards/seletores/subtítulos usam pra nunca exibir id.
function useNomesPorIdSer(): Record<number, string> {
    const listagem = useNoraGraphQLListagem('SerDetalhe', {
        select: ['fkSerId', 'nome'],
        itensPorPagina: 200,
        carregando: 'Buscando Seres',
        mensagemErro: 'Houve um erro recuperando os Seres',
        mensagemListaVazia: 'Nenhum Ser cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum Ser encontrado com os filtros atuais.',
        carregamento: 'BARRA',
        montaParametrosConsulta: params => ({ where: params.where, order: { nome: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    return useMemo(() => Object.fromEntries(listagem.registros.map(ser => [ser.fkSerId, ser.nome])), [listagem.registros]);
};

// Maior índice numérico já usado nas keys do config (todas terminam em _N ou :N) — pra o contador de novas keys começar acima e não colidir.
function maiorIndiceKeyConfig(config: ConfiguracaoPartida): number {
    const keys = [...config.controlaveis, ...config.naoControlaveis].map(ser => ser.key as string)
        .concat(config.interagiveis.map(objeto => objeto.key))
        .concat(config.descobertasCondicionadas.map(descoberta => descoberta.key));
    return keys.reduce((maior, key) => {
        const casado = key.match(/(\d+)$/);
        return Math.max(maior, casado ? Number(casado[1]) : 0);
    }, 0);
};

type EntradaLayoutSubVista = {
    subVista: SubVista;
    grupoEmFoco: GrupoSeres;
    partida: PartidaResumo;
    config: ConfiguracaoPartida;
    nomesPorIdSer: Record<number, string>;
    serEmEdicaoKey: KeySerEmSala | null;
    objetoEmEdicaoKey: string | null;
    descobertaEmEdicaoKey: string | null;
    voltarParaFormulario: () => void;
    voltarParaVisao: () => void;
};

function layoutContextualDaSubVista({ subVista, grupoEmFoco, partida, config, nomesPorIdSer, serEmEdicaoKey, objetoEmEdicaoKey, descobertaEmEdicaoKey, voltarParaFormulario, voltarParaVisao }: EntradaLayoutSubVista) {
    const base = `${partida.nome} · Runtime`;
    const voltarConfig = { tipo: 'acao' as const, executar: voltarParaFormulario, tituloTooltip: 'Voltar para a configuração' };
    if (subVista === 'selecaoSer') return { subtitulo: `${base} · Escolher Ser ${grupoEmFoco === 'controlaveis' ? 'controlável' : 'não-controlável'}`, fecharProps: voltarConfig };
    if (subVista === 'configSer') return { subtitulo: `${base} · Configurando ${rotuloSer(config[grupoEmFoco].find(ser => ser.key === serEmEdicaoKey) ?? null, nomesPorIdSer)}`, fecharProps: voltarConfig };
    if (subVista === 'configObjeto') return { subtitulo: `${base} · Configurando ${rotuloObjeto(config.interagiveis.find(objeto => objeto.key === objetoEmEdicaoKey) ?? null)}`, fecharProps: voltarConfig };
    if (subVista === 'configDescoberta') return { subtitulo: `${base} · Configurando ${rotuloDescoberta(config.descobertasCondicionadas.find(descoberta => descoberta.key === descobertaEmEdicaoKey) ?? null)}`, fecharProps: voltarConfig };
    return { subtitulo: base, fecharProps: { tipo: 'acao' as const, executar: voltarParaVisao, tituloTooltip: 'Voltar para Dados de Exibição' } };
};

// Conteiner aninhado: o resolveSaida escolhe a sub-vista a partir do estado de fluxo do contexto.
const ConteinerInterno__Editor = criaConteiner<Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props>({ useEstado: useContexto__PaginaGameDesignerConfiguracaoPartida__Editor, resolveSaida });

function resolveSaida(props: Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props): SaidaConteiner {
    if (props.subVista === 'selecaoSer') return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer__Provider, {});
    if (props.subVista === 'configSer' && props.serEmEdicaoKey !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala__Provider, {});
    if (props.subVista === 'configObjeto' && props.objetoEmEdicaoKey !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto__Provider, {});
    if (props.subVista === 'configDescoberta' && props.descobertaEmEdicaoKey !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigDescoberta__Provider, {});
    return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Formulario__Provider, {});
};
