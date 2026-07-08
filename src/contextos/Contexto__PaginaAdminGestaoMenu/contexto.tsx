'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { obtemNavegacaoDoBanco, criaMenuNo, editaMenuNo, moveMenuNo, criaMenu, editaMenu } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import type { MenuDoBancoDto, MenuNoDoBancoDto } from 'types-nora-api';
import type { LayoutContextualizadoFecharProps } from 'Componentes/Elementos/FerramentaRetornoPagina/FerramentaRetornoPagina';
import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import type { Contexto__PaginaAdminGestaoNavegacao__Props, RegistroPaginaNavegacao } from '../Contexto__PaginaAdminGestaoNavegacao/contexto';
import { Contexto__PaginaAdminGestaoMenu__Listagem__Provider } from '../Contexto__PaginaAdminGestaoMenu__Listagem/contexto';
import { Contexto__PaginaAdminGestaoMenu__Estrutura__Provider } from '../Contexto__PaginaAdminGestaoMenu__Estrutura/contexto';
import { Contexto__PaginaAdminGestaoMenu__NovoNo__Provider } from '../Contexto__PaginaAdminGestaoMenu__NovoNo/contexto';
import { Contexto__PaginaAdminGestaoMenu__EdicaoNo__Provider } from '../Contexto__PaginaAdminGestaoMenu__EdicaoNo/contexto';
import { Contexto__PaginaAdminGestaoMenu__NovoMenu__Provider } from '../Contexto__PaginaAdminGestaoMenu__NovoMenu/contexto';
import { Contexto__PaginaAdminGestaoMenu__EdicaoMenu__Provider } from '../Contexto__PaginaAdminGestaoMenu__EdicaoMenu/contexto';

export type PayloadNovoNoMenu = { fkMenusId: number; fkMenusNosId?: number | null; tipo: 'item' | 'grupo'; titulo: string; ordem?: number; paginaTemplate?: string | null };
export type PayloadEditarNoMenu = { titulo?: string; ordem?: number; visivel?: boolean };
export type PayloadNovoMenu = { chave: string; tipo: 'principal' | 'interno'; descricao?: string | null };
export type PayloadEditarMenu = { descricao?: string | null; ativo?: boolean };
// Alvo do "adicionar nó": em qual menu e (opcionalmente) sob qual nó pai a criação vai acontecer.
export type AlvoNovoNo = { fkMenusId: number; fkMenusNosId: number | null; tipo: 'item' | 'grupo' };
type SubVista = 'listagem' | 'estrutura' | 'novoNo' | 'edicaoNo' | 'novoMenu' | 'edicaoMenu';

interface Contexto__PaginaAdminGestaoMenu__Props {
    listagemMenus: ReturnType<typeof obtemListagemMenus>;
    navegacao: MenuDoBancoDto[] | null;
    paginas: readonly RegistroPaginaNavegacao[];
    salvando: boolean;
    erro: string | null;
    subVista: SubVista;
    menuSelecionado: MenuDoBancoDto | null;
    alvoNovoNo: AlvoNovoNo | null;
    noEmEdicao: MenuNoDoBancoDto | null;
    menuEmEdicao: MenuDoBancoDto | null;
    selecionarMenu: (idMenu: number) => void;
    irParaNovoNo: (alvo: AlvoNovoNo) => void;
    irParaEdicaoNo: (no: MenuNoDoBancoDto) => void;
    irParaNovoMenu: () => void;
    irParaEdicaoMenu: (menu: MenuDoBancoDto) => void;
    voltarParaListagem: () => void;
    voltarParaEstrutura: () => void;
    adicionarNo: (payload: PayloadNovoNoMenu) => Promise<void>;
    editarNo: (id: number, payload: PayloadEditarNoMenu) => Promise<void>;
    reordenar: (idsEmOrdem: number[]) => Promise<void>;
    reparentar: (id: number, novoPaiId: number | null) => Promise<void>;
    moverParaPosicao: (id: number, novoPaiId: number | null, idsEmOrdem: number[]) => Promise<void>;
    criarMenu: (payload: PayloadNovoMenu) => Promise<void>;
    editarMenu: (id: number, payload: PayloadEditarMenu) => Promise<void>;
};

type PropsProvider = {
    listagemPaginas: Contexto__PaginaAdminGestaoNavegacao__Props['listagemPaginas'];
};

const Contexto__PaginaAdminGestaoMenu = createContext<Contexto__PaginaAdminGestaoMenu__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoMenu = (): Contexto__PaginaAdminGestaoMenu__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoMenu);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoMenu precisa estar dentro de um Contexto__PaginaAdminGestaoMenu');
    return context;
};

// Listagem GraphQL dos menus nomeados (leitura Menu): alimenta a vista de listagem em grade. A árvore de nós NÃO vem daqui — vem da navegação completa (montaNavegacao), carregada uma vez.
export function obtemListagemMenus() {
    return useNoraGraphQLListagem('Menu', {
        select: ['id', 'chave', 'tipo', 'descricao'],
        camposFiltroConsulta: ['chave', 'tipo'],
        camposFiltroVisualizacao: ['chave', 'tipo'],
        itensPorPagina: 100,
        carregando: 'Buscando menus',
        mensagemErro: 'Houve um erro recuperando os menus',
        mensagemListaVazia: 'Nenhum menu cadastrado.',
        mensagemListaVaziaComFiltro: 'Nenhum menu encontrado com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({
            where: params.where,
            order: { chave: 'ASC' },
            limit: params.limit,
            offset: params.offset,
        }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};

export type RegistroMenuGestao = ReturnType<typeof obtemListagemMenus>['registros'][number];

// Controle de Fluxo do menu: dono da navegação (dado), das ações (criar/editar/mover) e da sub-vista ativa.
// Fluxo: listagem (grade de menus) → estrutura (a árvore de UM menu) → subfluxos ConteudoForm (novo/editar nó/menu). Quem decide a sub-vista é o resolveSaida abaixo, nunca uma SPA.
// A navegação completa (todas as árvores) é carregada UMA vez e reusada ao trocar de menu — trocar de menu em vista não refaz consulta; só mutação recarrega.
export const Contexto__PaginaAdminGestaoMenu__Provider = ({ listagemPaginas }: PropsProvider) => {
    const listagemMenus = obtemListagemMenus();
    const [navegacao, setNavegacao] = useState<MenuDoBancoDto[] | null>(null);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [subVista, setSubVista] = useState<SubVista>('listagem');
    const [menuSelecionadoId, setMenuSelecionadoId] = useState<number | null>(null);
    const [alvoNovoNo, setAlvoNovoNo] = useState<AlvoNovoNo | null>(null);
    const [noEmEdicao, setNoEmEdicao] = useState<MenuNoDoBancoDto | null>(null);
    const [menuEmEdicao, setMenuEmEdicao] = useState<MenuDoBancoDto | null>(null);

    const recarregar = useCallback(() => {
        obtemNavegacaoDoBanco().then(setNavegacao).catch(capturado => setErro(capturado instanceof Error ? capturado.message : 'Erro ao montar a navegação do banco.'));
    }, []);
    useEffect(() => { recarregar(); }, [recarregar]);

    const menuSelecionado = useMemo(() => (navegacao ?? []).find(menu => menu.id === menuSelecionadoId) ?? null, [navegacao, menuSelecionadoId]);

    const selecionarMenu = useCallback((idMenu: number) => { setMenuSelecionadoId(idMenu); setSubVista('estrutura'); }, []);
    const irParaNovoNo = useCallback((alvo: AlvoNovoNo) => { setAlvoNovoNo(alvo); setSubVista('novoNo'); }, []);
    const irParaEdicaoNo = useCallback((no: MenuNoDoBancoDto) => { setNoEmEdicao(no); setSubVista('edicaoNo'); }, []);
    const irParaNovoMenu = useCallback(() => setSubVista('novoMenu'), []);
    const irParaEdicaoMenu = useCallback((menu: MenuDoBancoDto) => { setMenuEmEdicao(menu); setSubVista('edicaoMenu'); }, []);
    const voltarParaListagem = useCallback(() => { setSubVista('listagem'); setMenuSelecionadoId(null); setAlvoNovoNo(null); setNoEmEdicao(null); setMenuEmEdicao(null); }, []);
    const voltarParaEstrutura = useCallback(() => { setSubVista('estrutura'); setAlvoNovoNo(null); setNoEmEdicao(null); setMenuEmEdicao(null); }, []);

    const adicionarNo = useCallback(async (payload: PayloadNovoNoMenu): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            await criaMenuNo(payload);
            recarregar();
            setSubVista('estrutura');
            setAlvoNovoNo(null);
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível adicionar o item ao menu.');
            throw capturado;
        } finally {
            setSalvando(false);
        }
    }, [recarregar]);

    const editarNo = useCallback(async (id: number, payload: PayloadEditarNoMenu): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            await editaMenuNo(id, payload);
            recarregar();
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível editar o item do menu.');
            throw capturado;
        } finally {
            setSalvando(false);
        }
    }, [recarregar]);

    // Reordenar irmãos: reatribui ordem sequencial (0..N-1) na nova ordem visual; um editaMenuNo por nó + um recarregar só no fim.
    const reordenar = useCallback(async (idsEmOrdem: number[]): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            await Promise.all(idsEmOrdem.map((id, indice) => editaMenuNo(id, { ordem: indice })));
            recarregar();
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível reordenar o menu.');
        } finally {
            setSalvando(false);
        }
    }, [recarregar]);

    // Reparent puro: move um nó pra dentro de um grupo (fim dos filhos) ou pro topo do menu (novoPaiId=null). Validação/guarda de ciclo é no backend.
    const reparentar = useCallback(async (id: number, novoPaiId: number | null): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            await moveMenuNo(id, { fkMenusNosId: novoPaiId });
            recarregar();
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível mover o nó.');
        } finally {
            setSalvando(false);
        }
    }, [recarregar]);

    // Reparent posicional: move o nó pra outro pai E já o posiciona entre os novos irmãos (idsEmOrdem inclui o nó movido). Um recarregar só no fim.
    const moverParaPosicao = useCallback(async (id: number, novoPaiId: number | null, idsEmOrdem: number[]): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            await moveMenuNo(id, { fkMenusNosId: novoPaiId });
            await Promise.all(idsEmOrdem.map((idIrmao, indice) => editaMenuNo(idIrmao, { ordem: indice })));
            recarregar();
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível mover o nó.');
        } finally {
            setSalvando(false);
        }
    }, [recarregar]);

    const recarregarListagemMenus = listagemMenus.recarregar;

    const criarMenu = useCallback(async (payload: PayloadNovoMenu): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            await criaMenu(payload);
            recarregar();
            recarregarListagemMenus();
            setSubVista('listagem');
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível criar o menu.');
            throw capturado;
        } finally {
            setSalvando(false);
        }
    }, [recarregar, recarregarListagemMenus]);

    const editarMenu = useCallback(async (id: number, payload: PayloadEditarMenu): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            await editaMenu(id, payload);
            recarregar();
            recarregarListagemMenus();
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível editar o menu.');
            throw capturado;
        } finally {
            setSalvando(false);
        }
    }, [recarregar, recarregarListagemMenus]);

    // Dono único do layout contextual das subVistas: re-aplica subtítulo + fecharProps a cada troca de subVista (o hook não restaura no unmount). Identidade do alvo mora no subtítulo, não no corpo.
    useConfigurarLayoutContextualizado(layoutContextualDaSubVista({ subVista, menuSelecionado, alvoNovoNo, noEmEdicao, menuEmEdicao, voltarParaListagem, voltarParaEstrutura }));

    return (
        <Contexto__PaginaAdminGestaoMenu.Provider value={{ listagemMenus, navegacao, paginas: listagemPaginas.registros, salvando, erro, subVista, menuSelecionado, alvoNovoNo, noEmEdicao, menuEmEdicao, selecionarMenu, irParaNovoNo, irParaEdicaoNo, irParaNovoMenu, irParaEdicaoMenu, voltarParaListagem, voltarParaEstrutura, adicionarNo, editarNo, reordenar, reparentar, moverParaPosicao, criarMenu, editarMenu }}>
            <ConteinerInterno__GestaoMenu />
        </Contexto__PaginaAdminGestaoMenu.Provider>
    );
};

type EntradaLayoutSubVista = {
    subVista: SubVista;
    menuSelecionado: MenuDoBancoDto | null;
    alvoNovoNo: AlvoNovoNo | null;
    noEmEdicao: MenuNoDoBancoDto | null;
    menuEmEdicao: MenuDoBancoDto | null;
    voltarParaListagem: () => void;
    voltarParaEstrutura: () => void;
};

function layoutContextualDaSubVista({ subVista, menuSelecionado, alvoNovoNo, noEmEdicao, menuEmEdicao, voltarParaListagem, voltarParaEstrutura }: EntradaLayoutSubVista): { subtitulo: string | null; fecharProps: LayoutContextualizadoFecharProps | undefined } {
    const voltarListagem: LayoutContextualizadoFecharProps = { tipo: 'acao', executar: voltarParaListagem, tituloTooltip: 'Voltar para a listagem de menus' };
    const voltarEstrutura: LayoutContextualizadoFecharProps = { tipo: 'acao', executar: voltarParaEstrutura, tituloTooltip: 'Voltar para a estrutura' };
    if (subVista === 'estrutura') return { subtitulo: `Estrutura · ${menuSelecionado?.chave ?? ''}`, fecharProps: voltarListagem };
    if (subVista === 'novoNo') return { subtitulo: `Novo ${alvoNovoNo?.tipo === 'grupo' ? 'grupo' : 'item'} · ${menuSelecionado?.chave ?? ''}`, fecharProps: voltarEstrutura };
    if (subVista === 'edicaoNo') return { subtitulo: `Editar ${noEmEdicao?.tipo === 'grupo' ? 'grupo' : 'item'} · ${noEmEdicao?.titulo ?? ''}`, fecharProps: voltarEstrutura };
    if (subVista === 'novoMenu') return { subtitulo: 'Novo menu', fecharProps: voltarListagem };
    if (subVista === 'edicaoMenu') return { subtitulo: `Editar menu · ${menuEmEdicao?.chave ?? ''}`, fecharProps: voltarEstrutura };
    return { subtitulo: null, fecharProps: undefined };
};

// Nested conteiner: escolhe a sub-vista (listagem/estrutura custom / subfluxos ConteudoForm) a partir da sub-vista do contexto.
const ConteinerInterno__GestaoMenu = criaConteiner<Contexto__PaginaAdminGestaoMenu__Props>({ useEstado: useContexto__PaginaAdminGestaoMenu, resolveSaida });

function resolveSaida(props: Contexto__PaginaAdminGestaoMenu__Props): SaidaConteiner {
    if (props.subVista === 'novoNo' && props.alvoNovoNo !== null) return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__NovoNo__Provider, {});
    if (props.subVista === 'edicaoNo' && props.noEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__EdicaoNo__Provider, {});
    if (props.subVista === 'novoMenu') return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__NovoMenu__Provider, {});
    if (props.subVista === 'edicaoMenu' && props.menuEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__EdicaoMenu__Provider, {});
    if (props.subVista === 'estrutura' && props.menuSelecionado !== null) return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__Estrutura__Provider, {});
    return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__Listagem__Provider, {});
};
