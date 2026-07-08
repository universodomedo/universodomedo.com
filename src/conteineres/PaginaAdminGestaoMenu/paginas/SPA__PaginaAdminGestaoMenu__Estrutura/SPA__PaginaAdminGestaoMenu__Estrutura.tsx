'use client';

import styles from './styles.module.css';

import { useState, type DragEvent } from 'react';
import type { MenuDoBancoDto, MenuNoDoBancoDto } from 'types-nora-api';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import type { AlvoNovoNo } from 'Contextos/Contexto__PaginaAdminGestaoMenu/contexto';

type Props = {
    menu: MenuDoBancoDto;
    erro: string | null;
    irParaNovoNo: (alvo: AlvoNovoNo) => void;
    irParaEdicaoNo: (no: MenuNoDoBancoDto) => void;
    irParaEdicaoMenu: (menu: MenuDoBancoDto) => void;
    reordenar: (idsEmOrdem: number[]) => Promise<void>;
    reparentar: (id: number, novoPaiId: number | null) => Promise<void>;
    moverParaPosicao: (id: number, novoPaiId: number | null, idsEmOrdem: number[]) => Promise<void>;
};

type PosicaoAlvo = 'antes' | 'depois' | 'dentro';

type DragProps = {
    idArrastado: number | null;
    alvo: { id: number; posicao: PosicaoAlvo } | null;
    aoIniciar: (id: number) => void;
    aoTerminar: () => void;
    aoPairar: (evento: DragEvent<HTMLDivElement>, no: MenuNoDoBancoDto) => void;
    aoSoltar: (evento: DragEvent<HTMLDivElement>, no: MenuNoDoBancoDto, paiId: number | null, irmaos: readonly MenuNoDoBancoDto[]) => void;
};

// Vista CUSTOM da estrutura de UM menu: árvore limpa em repouso (ações por linha só no hover), affordâncias de arrasto só DURANTE o arrasto.
// Soltar na metade de cima/baixo de uma linha = posicionar antes/depois dela (mesmo mudando de pai); soltar no MIOLO de um grupo = colocar dentro (fim dos filhos).
export default function SPA__PaginaAdminGestaoMenu__Estrutura({ menu, erro, irParaNovoNo, irParaEdicaoNo, irParaEdicaoMenu, reordenar, reparentar, moverParaPosicao }: Props) {
    const [idArrastado, setIdArrastado] = useState<number | null>(null);
    const [alvo, setAlvo] = useState<{ id: number; posicao: PosicaoAlvo } | null>(null);

    // Alvos proibidos: o nó arrastado + sua subárvore (soltar dentro/ao lado de um descendente criaria ciclo; o backend também guarda).
    const idsProibidos = idArrastado !== null ? coletarSubarvore(menu.nos, idArrastado) ?? new Set<number>() : new Set<number>();

    function aoPairar(evento: DragEvent<HTMLDivElement>, no: MenuNoDoBancoDto): void {
        if (idArrastado === null || idsProibidos.has(no.id)) return;
        evento.preventDefault();
        const area = evento.currentTarget.getBoundingClientRect();
        const fracaoVertical = (evento.clientY - area.top) / area.height;
        const aceitaDentro = no.tipo === 'grupo' && fracaoVertical > 0.3 && fracaoVertical < 0.7;
        const posicao: PosicaoAlvo = aceitaDentro ? 'dentro' : (fracaoVertical < 0.5 ? 'antes' : 'depois');
        if (alvo === null || alvo.id !== no.id || alvo.posicao !== posicao) setAlvo({ id: no.id, posicao });
    };

    function aoSoltar(evento: DragEvent<HTMLDivElement>, no: MenuNoDoBancoDto, paiId: number | null, irmaos: readonly MenuNoDoBancoDto[]): void {
        evento.preventDefault();
        evento.stopPropagation();
        const posicao = alvo !== null && alvo.id === no.id ? alvo.posicao : null;
        const idNoArrastado = idArrastado;
        setAlvo(null);
        setIdArrastado(null);
        if (idNoArrastado === null || posicao === null || idsProibidos.has(no.id)) return;
        if (posicao === 'dentro') {
            reparentar(idNoArrastado, no.id);
            return;
        }
        const idsIrmaos = [...irmaos].sort((a, b) => a.ordem - b.ordem).map(irmao => irmao.id);
        const semArrastado = idsIrmaos.filter(id => id !== idNoArrastado);
        const indiceAlvo = semArrastado.indexOf(no.id);
        const insercao = posicao === 'antes' ? indiceAlvo : indiceAlvo + 1;
        const novaOrdem = [...semArrastado.slice(0, insercao), idNoArrastado, ...semArrastado.slice(insercao)];
        if (idsIrmaos.includes(idNoArrastado)) reordenar(novaOrdem);
        else moverParaPosicao(idNoArrastado, paiId, novaOrdem);
    };

    const drag: DragProps = {
        idArrastado,
        alvo,
        aoIniciar: setIdArrastado,
        aoTerminar: () => { setIdArrastado(null); setAlvo(null); },
        aoPairar,
        aoSoltar,
    };

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.host} onDragOver={evento => { if (!(evento.target as HTMLElement).closest(`.${styles.linha_no}`)) setAlvo(null); }}>
                    {erro && <p className={styles.erro}>{erro}</p>}
                    {menu.nos.length < 1
                        ? <p className={styles.info}>Sem itens.</p>
                        : <ArvoreNos nos={menu.nos} paiId={null} irParaNovoNo={irParaNovoNo} irParaEdicaoNo={irParaEdicaoNo} fkMenusId={menu.id} drag={drag} />}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={() => irParaEdicaoMenu(menu)}>Editar Menu</button>
                <button type="button" data-variante="secundario" onClick={() => irParaNovoNo({ fkMenusId: menu.id, fkMenusNosId: null, tipo: 'grupo' })}>Novo Grupo</button>
                <button type="button" onClick={() => irParaNovoNo({ fkMenusId: menu.id, fkMenusNosId: null, tipo: 'item' })}>Novo Item</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};

function ArvoreNos({ nos, paiId, fkMenusId, irParaNovoNo, irParaEdicaoNo, drag }: { nos: readonly MenuNoDoBancoDto[]; paiId: number | null; fkMenusId: number; irParaNovoNo: Props['irParaNovoNo']; irParaEdicaoNo: Props['irParaEdicaoNo']; drag: DragProps }) {
    const ordenados = [...nos].sort((a, b) => a.ordem - b.ordem);
    return (
        <ul className={styles.lista_nos}>
            {ordenados.map(no => <NoItem key={no.id} no={no} paiId={paiId} irmaos={ordenados} fkMenusId={fkMenusId} irParaNovoNo={irParaNovoNo} irParaEdicaoNo={irParaEdicaoNo} drag={drag} />)}
        </ul>
    );
};

function NoItem({ no, paiId, irmaos, fkMenusId, irParaNovoNo, irParaEdicaoNo, drag }: { no: MenuNoDoBancoDto; paiId: number | null; irmaos: readonly MenuNoDoBancoDto[]; fkMenusId: number; irParaNovoNo: Props['irParaNovoNo']; irParaEdicaoNo: Props['irParaEdicaoNo']; drag: DragProps }) {
    const ehGrupo = no.tipo === 'grupo';
    const ehAlvo = drag.alvo !== null && drag.alvo.id === no.id;
    const inserir = ehAlvo && drag.alvo!.posicao !== 'dentro' ? drag.alvo!.posicao : undefined;

    return (
        <li className={styles.no} data-inserir={inserir}>
            <div
                className={styles.linha_no}
                data-grupo={ehGrupo}
                data-oculto={!no.visivel}
                data-arrastando={drag.idArrastado === no.id}
                data-nest={ehAlvo && drag.alvo!.posicao === 'dentro'}
                draggable
                onDragStart={evento => { evento.stopPropagation(); drag.aoIniciar(no.id); }}
                onDragEnd={drag.aoTerminar}
                onDragOver={evento => drag.aoPairar(evento, no)}
                onDrop={evento => drag.aoSoltar(evento, no, paiId, irmaos)}
            >
                <span className={styles.manopla} aria-hidden="true">⠿</span>
                <span className={styles.titulo_no}>{no.titulo}</span>
                {no.tipo === 'item' && no.paginaTemplate && <span className={styles.destino}>{no.paginaTemplate}</span>}
                {!no.visivel && <span className={styles.tag_oculto}>oculto</span>}
                <span className={styles.acoes_no}>
                    <button type="button" className={styles.botao_mini} onClick={() => irParaEdicaoNo(no)} title={`Editar ${ehGrupo ? 'grupo' : 'item'}`}>✎</button>
                    {ehGrupo && (
                        <>
                            <button type="button" className={styles.botao_mini} onClick={() => irParaNovoNo({ fkMenusId, fkMenusNosId: no.id, tipo: 'item' })} title={`Novo item dentro de “${no.titulo}”`}>+ item</button>
                            <button type="button" className={styles.botao_mini} onClick={() => irParaNovoNo({ fkMenusId, fkMenusNosId: no.id, tipo: 'grupo' })} title={`Novo grupo dentro de “${no.titulo}”`}>+ grupo</button>
                        </>
                    )}
                </span>
            </div>
            {no.filhos.length > 0 && <ArvoreNos nos={no.filhos} paiId={no.id} fkMenusId={fkMenusId} irParaNovoNo={irParaNovoNo} irParaEdicaoNo={irParaEdicaoNo} drag={drag} />}
        </li>
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
