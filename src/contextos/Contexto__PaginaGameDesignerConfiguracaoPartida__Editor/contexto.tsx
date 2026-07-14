'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ConfiguracaoPartida, PartidaResumo, Projeto3DMinimoPersistido } from 'types-nora-api';

import { dimensoesMapaDaCena, type ElementoDoMapaJogavel } from 'Funcionalidades/MapaJogavel/mapaJogavel.helpers';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { criaConfiguracaoVazia, criaCondicaoVitoria, configuracaoEstaPreenchida, controladorDoGrupo, garanteTemporal, LUZ_PADRAO, rotuloSer, rotuloObjeto, rotuloLuz, TAMANHO_OBJETO_PADRAO_MILIMETROS, type GrupoControle, type InteragivelObjeto, type InteragivelSer, type Luz, type TipoCondicaoVitoria } from './editorConfiguracao.compartilhado';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Formulario__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Formulario/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoMapa__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoMapa/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoElementoMapa__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoElementoMapa/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto/contexto';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigLuz__Provider } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigLuz/contexto';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao/contexto';

type SubVista = 'formulario' | 'selecaoMapa' | 'selecaoElementoMapa' | 'selecaoSer' | 'configSer' | 'configObjeto' | 'configLuz';

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props {
    partida: PartidaResumo;
    config: ConfiguracaoPartida;
    nomesPorIdSer: Record<number, string>;
    salvando: boolean;
    podeSalvar: boolean;
    alteracoesPendentes: boolean;
    subVista: SubVista;
    grupoEmFoco: GrupoControle;
    chaveEmEdicao: string | null;
    irParaSelecaoMapa: () => void;
    selecionaMapa: (projeto: Projeto3DMinimoPersistido) => void;
    irParaSelecaoElementoMapa: () => void;
    adicionaObjetoDoMapa: (elemento: ElementoDoMapaJogavel) => void;
    irParaSelecaoSer: (grupo: GrupoControle) => void;
    adicionaSer: (grupo: GrupoControle, idSer: number) => void;
    irParaConfigSer: (chave: string) => void;
    adicionaEConfiguraObjeto: () => void;
    irParaConfigObjeto: (chave: string) => void;
    voltarParaFormulario: () => void;
    atualizaConfig: (parcial: Partial<ConfiguracaoPartida>) => void;
    selecionaTipoCondicaoVitoria: (tipo: TipoCondicaoVitoria) => void;
    atualizaCenario: (parcial: Partial<ConfiguracaoPartida['cenario']>) => void;
    atualizaMapaLogico: (parcial: Partial<ConfiguracaoPartida['cenario']['mapaLogico']>) => void;
    removeInteragivel: (chave: string) => void;
    atualizaObjeto: (chave: string, parcial: Partial<InteragivelObjeto>) => void;
    atualizaSer: (chave: string, parcial: Partial<InteragivelSer>) => void;
    adicionaEConfiguraLuz: () => void;
    irParaConfigLuz: (chave: string) => void;
    atualizaLuz: (chave: string, parcial: Partial<Luz>) => void;
    removeLuz: (chave: string) => void;
    salvarConfiguracao: () => Promise<void>;
};

type PropsProvider = {
    partida: PartidaResumo;
    configuracaoInicial: ConfiguracaoPartida | null;
    salvando: boolean;
    salvar: (configuracao: ConfiguracaoPartida) => Promise<boolean>;
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Editor = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Editor precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Editor');
    return context;
};

// Controlador de Fluxo do Runtime: dono do config (dado), dos helpers de edição e da sub-vista ativa.
// Interagiveis unificados (Objeto|Ser+controlador); descobertas moram DENTRO de cada interagivel (editadas no ConfigObjeto/ConfigSer).
// O resolveSaida abaixo decide qual vista renderiza (formulário / seleção de Ser / config do Ser / config do Objeto) — nunca uma SPA.
// O config é RASCUNHO em memória: os subfluxos APLICAM nele; só "Salvar Configuração" persiste. A pendência (rascunho ≠ último salvo)
// alimenta o indicador do formulário e as proteções de descarte (beforeunload no F5/fechar aba; confirm no X de sair do Runtime).
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Provider = ({ partida, configuracaoInicial, salvando, salvar }: PropsProvider) => {
    // Config sem carimbo versaoShape = jsonb legado (pré-shape novo): não é editável nem lível aqui — o editor parte do zero, espelhando o backend (obtemDefinicaoRuntime rejeita shape legado). Salvar substitui o jsonb inteiro.
    const configuracaoCarregavel = configuracaoInicial && configuracaoInicial.versaoShape != null ? configuracaoInicial : null;
    // Contador inicia acima do maior índice já existente no config carregado — senão uma chave nova colide com uma salva.
    const contadorChavesRef = useRef(configuracaoCarregavel ? maiorIndiceChaveConfig(configuracaoCarregavel) : 0);
    const [config, setConfig] = useState<ConfiguracaoPartida>(() => garanteTemporal(configuracaoCarregavel ?? criaConfiguracaoVazia()));
    // Último estado confirmado pelo banco (parte do carregado); pendência = rascunho divergiu dele.
    const [configReferencia, setConfigReferencia] = useState<ConfiguracaoPartida>(config);
    const [subVista, setSubVista] = useState<SubVista>('formulario');
    const [grupoEmFoco, setGrupoEmFoco] = useState<GrupoControle>('jogador');
    const [chaveEmEdicao, setChaveEmEdicao] = useState<string | null>(null);
    const { setAba } = useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao();
    // Nome do Ser jogavel e dominio futuro (cada dominio tera o nome no seu lugar); ate la os rotulos derivam do id/nome-em-jogo (rotuloSer), sem consulta ao catalogo.
    const nomesPorIdSer = NOMES_POR_ID_SER_INDISPONIVEL;

    function criaChave(prefixo: string): string {
        contadorChavesRef.current += 1;
        return `${prefixo}_${contadorChavesRef.current}`;
    };

    function atualizaConfig(parcial: Partial<ConfiguracaoPartida>): void { setConfig(atual => ({ ...atual, ...parcial })); };
    function selecionaTipoCondicaoVitoria(tipo: TipoCondicaoVitoria): void { atualizaConfig({ condicaoVitoria: criaCondicaoVitoria(tipo) }); };
    function atualizaCenario(parcial: Partial<ConfiguracaoPartida['cenario']>): void { setConfig(atual => ({ ...atual, cenario: { ...atual.cenario, ...parcial } })); };
    function atualizaMapaLogico(parcial: Partial<ConfiguracaoPartida['cenario']['mapaLogico']>): void { setConfig(atual => ({ ...atual, cenario: { ...atual.cenario, mapaLogico: { ...atual.cenario.mapaLogico, ...parcial } } })); };

    function removeInteragivel(chave: string): void { setConfig(atual => ({ ...atual, interagiveis: atual.interagiveis.filter(interagivel => interagivel.chave !== chave) })); };
    function atualizaObjeto(chave: string, parcial: Partial<InteragivelObjeto>): void { setConfig(atual => ({ ...atual, interagiveis: atual.interagiveis.map(interagivel => interagivel.chave === chave && interagivel.tipo === 'objeto' ? { ...interagivel, ...parcial } : interagivel) })); };
    function atualizaSer(chave: string, parcial: Partial<InteragivelSer>): void { setConfig(atual => ({ ...atual, interagiveis: atual.interagiveis.map(interagivel => interagivel.chave === chave && interagivel.tipo === 'ser' ? { ...interagivel, ...parcial } : interagivel) })); };
    function atualizaLuz(chave: string, parcial: Partial<Luz>): void { setConfig(atual => ({ ...atual, luzes: (atual.luzes ?? []).map(luz => luz.chave === chave ? { ...luz, ...parcial } : luz) })); };
    function removeLuz(chave: string): void { setConfig(atual => ({ ...atual, luzes: (atual.luzes ?? []).filter(luz => luz.chave !== chave) })); };

    function adicionaSer(grupo: GrupoControle, idSer: number): void {
        const novo: InteragivelSer = { chave: criaChave('SER'), tipo: 'ser', idSer, controlador: controladorDoGrupo(grupo), nome: '', descricao: '', posicao: { x: 0, y: 0 }, estadoPercepcaoInicial: grupo === 'sistema' ? 'DESPERCEBIDO' : 'PERCEBIDO', descobertas: [] };
        setConfig(atual => ({ ...atual, interagiveis: [...atual.interagiveis, novo] }));
    };

    function criaObjetoVazio(): InteragivelObjeto {
        return { chave: criaChave('OBJETO'), tipo: 'objeto', nome: '', descricao: '', posicao: { x: 0, y: 0 }, estadoPercepcaoInicial: 'PERCEBIDO', pontosDurabilidadeMaximo: 1, larguraMilimetros: TAMANHO_OBJETO_PADRAO_MILIMETROS.largura, alturaMilimetros: TAMANHO_OBJETO_PADRAO_MILIMETROS.altura, profundidadeMilimetros: TAMANHO_OBJETO_PADRAO_MILIMETROS.profundidade, descobertas: [] };
    };
    function adicionaEConfiguraObjeto(): void {
        const novo = criaObjetoVazio();
        setConfig(atual => ({ ...atual, interagiveis: [...atual.interagiveis, novo] }));
        irParaConfigObjeto(novo.chave);
    };

    function criaLuzVazia(): Luz {
        return { chave: criaChave('LUZ'), nome: '', posicao: { x: 0, y: 0 }, alcanceMilimetros: LUZ_PADRAO.alcanceMilimetros, intensidade: LUZ_PADRAO.intensidade };
    };
    function adicionaEConfiguraLuz(): void {
        const nova = criaLuzVazia();
        setConfig(atual => ({ ...atual, luzes: [...(atual.luzes ?? []), nova] }));
        irParaConfigLuz(nova.chave);
    };

    function irParaSelecaoMapa(): void { setSubVista('selecaoMapa'); };

    // Selecionar o mapa É a autoria do cenário: nome e dimensões lógicas DERIVAM do projeto (bbox XZ da cena, em mm) — nada é digitado à mão.
    function selecionaMapa(projeto: Projeto3DMinimoPersistido): void {
        const dimensoes = dimensoesMapaDaCena(projeto.cenaCanonica);
        if (dimensoes === null) return;
        setConfig(atual => ({ ...atual, cenario: { nome: projeto.nome, mapaLogico: { ...atual.cenario.mapaLogico, larguraMilimetros: dimensoes.larguraMilimetros, alturaMilimetros: dimensoes.alturaMilimetros, idProjetoMapa: projeto.id } } }));
        voltarParaFormulario();
    };

    function irParaSelecaoElementoMapa(): void { setSubVista('selecaoElementoMapa'); };

    // Elemento do mapa vira Interagivel OBJETO como qualquer outro — a diferença: posição/dimensões DERIVADAS do bbox do elemento e o vínculo idElementoMapa.
    function adicionaObjetoDoMapa(elemento: ElementoDoMapaJogavel): void {
        const novo: InteragivelObjeto = { chave: criaChave('OBJETO'), tipo: 'objeto', nome: elemento.nome, descricao: '', posicao: elemento.posicao, estadoPercepcaoInicial: 'PERCEBIDO', pontosDurabilidadeMaximo: 1, larguraMilimetros: elemento.larguraMilimetros, alturaMilimetros: elemento.alturaMilimetros, profundidadeMilimetros: elemento.profundidadeMilimetros, idElementoMapa: elemento.idLocal, acoes: [], descobertas: [] };
        setConfig(atual => ({ ...atual, interagiveis: [...atual.interagiveis, novo] }));
        irParaConfigObjeto(novo.chave);
    };

    function irParaSelecaoSer(grupo: GrupoControle): void { setGrupoEmFoco(grupo); setSubVista('selecaoSer'); };
    function irParaConfigSer(chave: string): void { setChaveEmEdicao(chave); setSubVista('configSer'); };
    function irParaConfigObjeto(chave: string): void { setChaveEmEdicao(chave); setSubVista('configObjeto'); };
    function irParaConfigLuz(chave: string): void { setChaveEmEdicao(chave); setSubVista('configLuz'); };
    function voltarParaFormulario(): void { setChaveEmEdicao(null); setSubVista('formulario'); };

    async function salvarConfiguracao(): Promise<void> {
        if (!configuracaoEstaPreenchida(config) || salvando) return;
        const salvou = await salvar(config);
        if (salvou) setConfigReferencia(config);
    };

    const alteracoesPendentes = useMemo(() => JSON.stringify(config) !== JSON.stringify(configReferencia), [config, configReferencia]);
    const podeSalvar = configuracaoEstaPreenchida(config) && !salvando && alteracoesPendentes;

    // F5/fechar aba com pendência = perda silenciosa do rascunho — dispara o diálogo nativo do navegador.
    useEffect(() => {
        if (!alteracoesPendentes) return;
        function protegeDescarte(evento: BeforeUnloadEvent): void { evento.preventDefault(); };
        window.addEventListener('beforeunload', protegeDescarte);
        return () => window.removeEventListener('beforeunload', protegeDescarte);
    }, [alteracoesPendentes]);

    // Sair do Runtime pelo X descarta o rascunho — com pendência, só depois de confirmar.
    function voltarParaVisao(): void {
        if (alteracoesPendentes && !window.confirm('O Runtime tem alterações não salvas. Sair mesmo assim?')) return;
        setAba('visao');
    };

    // Dono único do layout contextual das subVistas: re-aplica subtítulo + fecharProps a cada troca de subVista (o hook não restaura no unmount). Identidade do alvo mora no subtítulo, não no corpo.
    useConfigurarLayoutContextualizado(layoutContextualDaSubVista({ subVista, grupoEmFoco, partida, config, nomesPorIdSer, chaveEmEdicao, voltarParaFormulario, voltarParaVisao }));

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Editor.Provider value={{ partida, config, nomesPorIdSer, salvando, podeSalvar, alteracoesPendentes, subVista, grupoEmFoco, chaveEmEdicao, irParaSelecaoMapa, selecionaMapa, irParaSelecaoElementoMapa, adicionaObjetoDoMapa, irParaSelecaoSer, adicionaSer, irParaConfigSer, adicionaEConfiguraObjeto, irParaConfigObjeto, voltarParaFormulario, atualizaConfig, selecionaTipoCondicaoVitoria, atualizaCenario, atualizaMapaLogico, removeInteragivel, atualizaObjeto, atualizaSer, adicionaEConfiguraLuz, irParaConfigLuz, atualizaLuz, removeLuz, salvarConfiguracao }}>
            <ConteinerInterno__Editor />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Editor.Provider>
    );
};

// Nome por id indisponivel ate o dominio de nome do novo_ser existir; referencia estavel pra nao re-renderizar.
const NOMES_POR_ID_SER_INDISPONIVEL: Record<number, string> = {};

// Maior índice numérico já usado nas chaves dos interagiveis (todas terminam em _N) — pra o contador de novas chaves começar acima e não colidir.
function maiorIndiceChaveConfig(config: ConfiguracaoPartida): number {
    return config.interagiveis.reduce((maior, interagivel) => {
        const casado = interagivel.chave.match(/(\d+)$/);
        return Math.max(maior, casado ? Number(casado[1]) : 0);
    }, 0);
};

type EntradaLayoutSubVista = {
    subVista: SubVista;
    grupoEmFoco: GrupoControle;
    partida: PartidaResumo;
    config: ConfiguracaoPartida;
    nomesPorIdSer: Record<number, string>;
    chaveEmEdicao: string | null;
    voltarParaFormulario: () => void;
    voltarParaVisao: () => void;
};

function layoutContextualDaSubVista({ subVista, grupoEmFoco, partida, config, nomesPorIdSer, chaveEmEdicao, voltarParaFormulario, voltarParaVisao }: EntradaLayoutSubVista) {
    const base = `${partida.nome} · Runtime`;
    const voltarConfig = { tipo: 'acao' as const, executar: voltarParaFormulario, tituloTooltip: 'Voltar para a configuração' };
    const interagivelEmEdicao = config.interagiveis.find(interagivel => interagivel.chave === chaveEmEdicao) ?? null;
    const luzEmEdicao = (config.luzes ?? []).find(luz => luz.chave === chaveEmEdicao) ?? null;
    if (subVista === 'selecaoMapa') return { subtitulo: `${base} · Escolher Mapa`, fecharProps: voltarConfig };
    if (subVista === 'selecaoElementoMapa') return { subtitulo: `${base} · Adicionar Objeto do Mapa`, fecharProps: voltarConfig };
    if (subVista === 'selecaoSer') return { subtitulo: `${base} · Escolher Ser ${grupoEmFoco === 'jogador' ? 'de Jogador' : 'do Sistema'}`, fecharProps: voltarConfig };
    if (subVista === 'configSer') return { subtitulo: `${base} · Configurando ${rotuloSer(interagivelEmEdicao !== null && interagivelEmEdicao.tipo === 'ser' ? interagivelEmEdicao : null, nomesPorIdSer)}`, fecharProps: voltarConfig };
    if (subVista === 'configObjeto') return { subtitulo: `${base} · Configurando ${rotuloObjeto(interagivelEmEdicao !== null && interagivelEmEdicao.tipo === 'objeto' ? interagivelEmEdicao : null)}`, fecharProps: voltarConfig };
    if (subVista === 'configLuz') return { subtitulo: `${base} · Configurando ${rotuloLuz(luzEmEdicao)}`, fecharProps: voltarConfig };
    return { subtitulo: base, fecharProps: { tipo: 'acao' as const, executar: voltarParaVisao, tituloTooltip: 'Voltar para Dados de Exibição' } };
};

// Conteiner aninhado: o resolveSaida escolhe a sub-vista a partir do estado de fluxo do contexto.
const ConteinerInterno__Editor = criaConteiner<Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props>({ useEstado: useContexto__PaginaGameDesignerConfiguracaoPartida__Editor, resolveSaida });

function resolveSaida(props: Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Props): SaidaConteiner {
    if (props.subVista === 'selecaoMapa') return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoMapa__Provider, {});
    if (props.subVista === 'selecaoElementoMapa') return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoElementoMapa__Provider, {});
    if (props.subVista === 'selecaoSer') return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__SelecaoSer__Provider, {});
    if (props.subVista === 'configSer' && props.chaveEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala__Provider, {});
    if (props.subVista === 'configObjeto' && props.chaveEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto__Provider, {});
    if (props.subVista === 'configLuz' && props.chaveEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigLuz__Provider, {});
    return criaSaidaConteiner(Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__Formulario__Provider, {});
};
