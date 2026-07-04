'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { obtemNavegacaoDoBanco, criaMenuNo, editaMenuNo, moveMenuNo, criaMenu, editaMenu } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import type { MenuDoBancoDto, MenuNoDoBancoDto } from 'types-nora-api';
import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import type { Contexto__PaginaAdminGestaoNavegacao__Props, RegistroPaginaNavegacao } from '../Contexto__PaginaAdminGestaoNavegacao/contexto';
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
type SubVista = 'estrutura' | 'novoNo' | 'edicaoNo' | 'novoMenu' | 'edicaoMenu';

interface Contexto__PaginaAdminGestaoMenu__Props {
    navegacao: MenuDoBancoDto[] | null;
    paginas: readonly RegistroPaginaNavegacao[];
    salvando: boolean;
    erro: string | null;
    subVista: SubVista;
    alvoNovoNo: AlvoNovoNo | null;
    noEmEdicao: MenuNoDoBancoDto | null;
    menuEmEdicao: MenuDoBancoDto | null;
    irParaNovoNo: (alvo: AlvoNovoNo) => void;
    irParaEdicaoNo: (no: MenuNoDoBancoDto) => void;
    irParaNovoMenu: () => void;
    irParaEdicaoMenu: (menu: MenuDoBancoDto) => void;
    voltarParaEstrutura: () => void;
    adicionarNo: (payload: PayloadNovoNoMenu) => Promise<void>;
    editarNo: (id: number, payload: PayloadEditarNoMenu) => Promise<void>;
    reordenar: (idsEmOrdem: number[]) => Promise<void>;
    reparentar: (id: number, novoPaiId: number | null) => Promise<void>;
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

// Controle de Fluxo do menu: dono da navegação (dado), das ações (criar/editar nó) e da sub-vista ativa.
// A estrutura (árvore) é uma vista custom; novoNo/edicaoNo são subfluxos ConteudoForm. Quem decide a sub-vista é o resolveSaida abaixo, nunca uma SPA.
export const Contexto__PaginaAdminGestaoMenu__Provider = ({ listagemPaginas }: PropsProvider) => {
    const [navegacao, setNavegacao] = useState<MenuDoBancoDto[] | null>(null);
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [subVista, setSubVista] = useState<SubVista>('estrutura');
    const [alvoNovoNo, setAlvoNovoNo] = useState<AlvoNovoNo | null>(null);
    const [noEmEdicao, setNoEmEdicao] = useState<MenuNoDoBancoDto | null>(null);
    const [menuEmEdicao, setMenuEmEdicao] = useState<MenuDoBancoDto | null>(null);

    const recarregar = useCallback(() => {
        obtemNavegacaoDoBanco().then(setNavegacao).catch(capturado => setErro(capturado instanceof Error ? capturado.message : 'Erro ao montar a navegação do banco.'));
    }, []);
    useEffect(() => { recarregar(); }, [recarregar]);

    const irParaNovoNo = useCallback((alvo: AlvoNovoNo) => { setAlvoNovoNo(alvo); setSubVista('novoNo'); }, []);
    const irParaEdicaoNo = useCallback((no: MenuNoDoBancoDto) => { setNoEmEdicao(no); setSubVista('edicaoNo'); }, []);
    const irParaNovoMenu = useCallback(() => setSubVista('novoMenu'), []);
    const irParaEdicaoMenu = useCallback((menu: MenuDoBancoDto) => { setMenuEmEdicao(menu); setSubVista('edicaoMenu'); }, []);
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

    // Reparent: move um nó pra dentro de outro grupo (ou pro topo, novoPaiId=null). Validação/guarda de ciclo é no backend.
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

    const criarMenu = useCallback(async (payload: PayloadNovoMenu): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            await criaMenu(payload);
            recarregar();
            setSubVista('estrutura');
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível criar o menu.');
            throw capturado;
        } finally {
            setSalvando(false);
        }
    }, [recarregar]);

    const editarMenu = useCallback(async (id: number, payload: PayloadEditarMenu): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            await editaMenu(id, payload);
            recarregar();
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível editar o menu.');
            throw capturado;
        } finally {
            setSalvando(false);
        }
    }, [recarregar]);

    return (
        <Contexto__PaginaAdminGestaoMenu.Provider value={{ navegacao, paginas: listagemPaginas.registros, salvando, erro, subVista, alvoNovoNo, noEmEdicao, menuEmEdicao, irParaNovoNo, irParaEdicaoNo, irParaNovoMenu, irParaEdicaoMenu, voltarParaEstrutura, adicionarNo, editarNo, reordenar, reparentar, criarMenu, editarMenu }}>
            <ConteinerInterno__GestaoMenu />
        </Contexto__PaginaAdminGestaoMenu.Provider>
    );
};

// Nested conteiner: escolhe a sub-vista (estrutura custom / subfluxos ConteudoForm) a partir da sub-vista do contexto.
const ConteinerInterno__GestaoMenu = criaConteiner<Contexto__PaginaAdminGestaoMenu__Props>({ useEstado: useContexto__PaginaAdminGestaoMenu, resolveSaida });

function resolveSaida(props: Contexto__PaginaAdminGestaoMenu__Props): SaidaConteiner {
    if (props.subVista === 'novoNo' && props.alvoNovoNo !== null) return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__NovoNo__Provider, {});
    if (props.subVista === 'edicaoNo' && props.noEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__EdicaoNo__Provider, {});
    if (props.subVista === 'novoMenu') return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__NovoMenu__Provider, {});
    if (props.subVista === 'edicaoMenu' && props.menuEmEdicao !== null) return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__EdicaoMenu__Provider, {});
    return criaSaidaConteiner(Contexto__PaginaAdminGestaoMenu__Estrutura__Provider, {});
};
