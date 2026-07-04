'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import type { MenuDoBancoDto, MenuNoDoBancoDto } from 'types-nora-api';
import type { AlvoNovoNo } from 'Contextos/Contexto__PaginaAdminGestaoMenu/contexto';

type Props = {
    navegacao: MenuDoBancoDto[] | null;
    erro: string | null;
    irParaNovoNo: (alvo: AlvoNovoNo) => void;
    irParaEdicaoNo: (no: MenuNoDoBancoDto) => void;
    irParaNovoMenu: () => void;
    irParaEdicaoMenu: (menu: MenuDoBancoDto) => void;
    reordenar: (idsEmOrdem: number[]) => Promise<void>;
    reparentar: (id: number, novoPaiId: number | null) => Promise<void>;
};

type DragProps = {
    arrastoId: number | null;
    setArrastoId: (id: number | null) => void;
    reordenar: Props['reordenar'];
    reparentar: Props['reparentar'];
    idsProibidos: Set<number>;
    menuDoArrastado: number | null;
};

// Vista CUSTOM da estrutura de menus: mostra a árvore, reordena irmãos e reaninha nós por drag, e dá os pontos de entrada das ações (adicionar/editar nó/menu).
// Reorder = soltar SOBRE a linha de um irmão. Reparent (aninhar) = soltar numa "zona de aninhar" (dentro de um grupo, ou no topo do menu). Ações de form são subfluxos ConteudoForm.
export default function SPA__PaginaAdminGestaoMenu({ navegacao, erro, irParaNovoNo, irParaEdicaoNo, irParaNovoMenu, irParaEdicaoMenu, reordenar, reparentar }: Props) {
    const [arrastoId, setArrastoId] = useState<number | null>(null);

    if (navegacao === null) return <p className={styles.info}>Carregando menus…</p>;

    // Alvos proibidos de aninhar: o próprio nó arrastado + sua subárvore (evita ciclo já na UI; o backend também guarda).
    let idsProibidos = new Set<number>();
    let menuDoArrastado: number | null = null;
    if (arrastoId !== null) {
        for (const menu of navegacao) {
            const subarvore = coletarSubarvore(menu.nos, arrastoId);
            if (subarvore) { idsProibidos = subarvore; menuDoArrastado = menu.id; break; }
        }
    }
    const drag: DragProps = { arrastoId, setArrastoId, reordenar, reparentar, idsProibidos, menuDoArrastado };

    return (
        <div className={styles.host}>
            <div className={styles.barra_topo}>
                <button type="button" className={styles.botao_novo_menu} onClick={irParaNovoMenu}>+ Novo menu</button>
                <p className={styles.dica}>Arraste um item: solte sobre a linha de um irmão para reordenar, ou numa zona “colocar dentro/no topo” para reaninhar.</p>
            </div>
            {erro && <p className={styles.erro}>{erro}</p>}
            {navegacao.length < 1 && <p className={styles.info}>Nenhum menu cadastrado.</p>}
            {navegacao.map(menu => <MenuBloco key={menu.id} menu={menu} irParaNovoNo={irParaNovoNo} irParaEdicaoNo={irParaEdicaoNo} irParaEdicaoMenu={irParaEdicaoMenu} drag={drag} />)}
        </div>
    );
};

function MenuBloco({ menu, irParaNovoNo, irParaEdicaoNo, irParaEdicaoMenu, drag }: { menu: MenuDoBancoDto; irParaNovoNo: Props['irParaNovoNo']; irParaEdicaoNo: Props['irParaEdicaoNo']; irParaEdicaoMenu: Props['irParaEdicaoMenu']; drag: DragProps }) {
    const mostrarZonaTopo = drag.arrastoId !== null && drag.menuDoArrastado === menu.id;
    return (
        <div className={`${styles.menu_bloco}${menu.ativo ? '' : ` ${styles.menu_inativo}`}`}>
            <div className={styles.cabecalho_menu}>
                <span className={styles.rotulo_menu}>
                    <strong className={styles.menu_chave}>{menu.chave}</strong>
                    {!menu.ativo && <span className={styles.oculto}>inativo</span>}
                </span>
                <span className={styles.acoes_no}>
                    <button type="button" className={styles.botao_mini} onClick={() => irParaEdicaoMenu(menu)}>Editar</button>
                    <BotoesAdicionar fkMenusId={menu.id} fkMenusNosId={null} irParaNovoNo={irParaNovoNo} />
                </span>
            </div>
            {mostrarZonaTopo && <ZonaNest rotulo="colocar no topo deste menu" aoSoltar={() => { if (drag.arrastoId !== null) drag.reparentar(drag.arrastoId, null); }} />}
            {menu.nos.length < 1
                ? <p className={styles.info}>Sem itens.</p>
                : <ArvoreNos nos={menu.nos} fkMenusId={menu.id} irParaNovoNo={irParaNovoNo} irParaEdicaoNo={irParaEdicaoNo} drag={drag} />}
        </div>
    );
};

function ArvoreNos({ nos, fkMenusId, irParaNovoNo, irParaEdicaoNo, drag }: { nos: readonly MenuNoDoBancoDto[]; fkMenusId: number; irParaNovoNo: Props['irParaNovoNo']; irParaEdicaoNo: Props['irParaEdicaoNo']; drag: DragProps }) {
    const [sobreId, setSobreId] = useState<number | null>(null);
    const ordenados = [...nos].sort((a, b) => a.ordem - b.ordem);
    const arrastadoEhIrmao = drag.arrastoId !== null && ordenados.some(n => n.id === drag.arrastoId);

    // Solta o nó arrastado sobre um irmão-alvo e reatribui a ordem visual. Posicional: arrastar pra baixo insere DEPOIS do alvo (permite ir pro fim), pra cima insere ANTES.
    function aoSoltarNoAlvo(alvoId: number): void {
        setSobreId(null);
        if (drag.arrastoId === null || drag.arrastoId === alvoId || !arrastadoEhIrmao) return;
        const idArrastado = drag.arrastoId;
        const indiceArrastado = ordenados.findIndex(n => n.id === idArrastado);
        const indiceAlvo = ordenados.findIndex(n => n.id === alvoId);
        const arrastado = ordenados[indiceArrastado];
        const sem = ordenados.filter(n => n.id !== idArrastado);
        const posAlvoEmSem = sem.findIndex(n => n.id === alvoId);
        const insercao = indiceAlvo > indiceArrastado ? posAlvoEmSem + 1 : posAlvoEmSem;
        const nova = [...sem.slice(0, insercao), arrastado, ...sem.slice(insercao)];
        drag.reordenar(nova.map(n => n.id));
    };

    return (
        <ul className={styles.lista_nos}>
            {ordenados.map(no => (
                <NoItem
                    key={no.id}
                    no={no}
                    fkMenusId={fkMenusId}
                    irParaNovoNo={irParaNovoNo}
                    irParaEdicaoNo={irParaEdicaoNo}
                    drag={drag}
                    ehAlvoSolta={arrastadoEhIrmao && drag.arrastoId !== no.id && sobreId === no.id}
                    aoEntrarComoAlvo={() => { if (arrastadoEhIrmao && drag.arrastoId !== no.id) setSobreId(no.id); }}
                    aoSoltarNoAlvo={aoSoltarNoAlvo}
                />
            ))}
        </ul>
    );
};

function NoItem({ no, fkMenusId, irParaNovoNo, irParaEdicaoNo, drag, ehAlvoSolta, aoEntrarComoAlvo, aoSoltarNoAlvo }: { no: MenuNoDoBancoDto; fkMenusId: number; irParaNovoNo: Props['irParaNovoNo']; irParaEdicaoNo: Props['irParaEdicaoNo']; drag: DragProps; ehAlvoSolta: boolean; aoEntrarComoAlvo: () => void; aoSoltarNoAlvo: (alvoId: number) => void }) {
    const ehGrupo = no.tipo === 'grupo';
    const arrastando = drag.arrastoId === no.id;
    const classeLinha = `${styles.linha_no}${arrastando ? ` ${styles.arrastando}` : ''}${ehAlvoSolta ? ` ${styles.alvo_solta}` : ''}`;
    const mostrarZonaNest = ehGrupo && drag.arrastoId !== null && !drag.idsProibidos.has(no.id);

    return (
        <li className={styles.no}>
            <div
                className={classeLinha}
                draggable
                onDragStart={() => drag.setArrastoId(no.id)}
                onDragEnd={() => drag.setArrastoId(null)}
                onDragOver={evento => { evento.preventDefault(); aoEntrarComoAlvo(); }}
                onDrop={evento => { evento.stopPropagation(); aoSoltarNoAlvo(no.id); }}
            >
                <span className={styles.rotulo_no}>
                    <span className={styles.manopla} aria-hidden="true">⠿</span>
                    <span className={styles.badge_tipo} data-grupo={ehGrupo}>{ehGrupo ? 'grupo' : 'item'}</span>
                    <span>{no.titulo}</span>
                    {no.tipo === 'item' && no.paginaTemplate && <span className={styles.destino}>→ {no.paginaTemplate}</span>}
                    {!no.visivel && <span className={styles.oculto}>oculto</span>}
                </span>
                <span className={styles.acoes_no}>
                    <button type="button" className={styles.botao_mini} onClick={() => irParaEdicaoNo(no)}>Editar</button>
                    {ehGrupo && <BotoesAdicionar fkMenusId={fkMenusId} fkMenusNosId={no.id} irParaNovoNo={irParaNovoNo} />}
                </span>
            </div>
            {mostrarZonaNest && <ZonaNest rotulo={`colocar dentro de “${no.titulo}”`} aoSoltar={() => { if (drag.arrastoId !== null) drag.reparentar(drag.arrastoId, no.id); }} />}
            {no.filhos.length > 0 && <ArvoreNos nos={no.filhos} fkMenusId={fkMenusId} irParaNovoNo={irParaNovoNo} irParaEdicaoNo={irParaEdicaoNo} drag={drag} />}
        </li>
    );
};

function ZonaNest({ rotulo, aoSoltar }: { rotulo: string; aoSoltar: () => void }) {
    const [sobre, setSobre] = useState<boolean>(false);
    return (
        <div
            className={`${styles.zona_nest}${sobre ? ` ${styles.zona_nest_ativa}` : ''}`}
            onDragOver={evento => { evento.preventDefault(); setSobre(true); }}
            onDragLeave={() => setSobre(false)}
            onDrop={evento => { evento.stopPropagation(); setSobre(false); aoSoltar(); }}
        >
            ↳ {rotulo}
        </div>
    );
};

function BotoesAdicionar({ fkMenusId, fkMenusNosId, irParaNovoNo }: { fkMenusId: number; fkMenusNosId: number | null; irParaNovoNo: Props['irParaNovoNo'] }) {
    return (
        <span className={styles.botoes_adicionar}>
            <button type="button" className={styles.botao_mini} onClick={() => irParaNovoNo({ fkMenusId, fkMenusNosId, tipo: 'item' })}>+ Item</button>
            <button type="button" className={styles.botao_mini} onClick={() => irParaNovoNo({ fkMenusId, fkMenusNosId, tipo: 'grupo' })}>+ Grupo</button>
        </span>
    );
};

// Coleta os ids da subárvore do nó com id 'alvo' (ele + descendentes), procurando em qualquer profundidade. null se não achar.
function coletarSubarvore(nos: readonly MenuNoDoBancoDto[], alvo: number): Set<number> | null {
    for (const no of nos) {
        if (no.id === alvo) { const conjunto = new Set<number>(); acumularIds(no, conjunto); return conjunto; }
        const achado = coletarSubarvore(no.filhos, alvo);
        if (achado) return achado;
    }
    return null;
};

function acumularIds(no: MenuNoDoBancoDto, conjunto: Set<number>): void {
    conjunto.add(no.id);
    no.filhos.forEach(filho => acumularIds(filho, conjunto));
};
