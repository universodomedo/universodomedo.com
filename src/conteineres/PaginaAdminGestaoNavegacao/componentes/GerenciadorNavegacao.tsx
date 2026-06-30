'use client';

import { useCallback, useEffect, useState } from 'react';

import { obtemNavegacaoDoBanco, criaMenuNo, editaMenuNo, type MenuDoBancoDto, type MenuNoDoBancoDto } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export default function GerenciadorNavegacao() {
    const [navegacao, setNavegacao] = useState<MenuDoBancoDto[] | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    const recarregar = useCallback(() => {
        obtemNavegacaoDoBanco().then(setNavegacao).catch(capturado => setErro(capturado instanceof Error ? capturado.message : 'Erro ao montar a navegação do banco.'));
    }, []);

    useEffect(() => { recarregar(); }, [recarregar]);

    return (
        <div>
            <h3>Navegação (montada do banco)</h3>
            {erro && <div>Erro ao montar a navegação do banco: {erro}</div>}
            {navegacao === null && !erro && <div>Montando navegação a partir do banco…</div>}
            {navegacao !== null && navegacao.length < 1 && <div>Nenhum menu no banco ainda.</div>}
            {navegacao !== null && navegacao.map(menu => <MenuDoBanco key={menu.id} menu={menu} aoMudar={recarregar} />)}
        </div>
    );
};

function MenuDoBanco({ menu, aoMudar }: { menu: MenuDoBancoDto; aoMudar: () => void }) {
    return (
        <div>
            <strong>{menu.chave}</strong> ({menu.tipo})
            {menu.nos.length < 1 ? <div>— sem itens —</div> : <ArvoreNos nos={menu.nos} aoMudar={aoMudar} />}
            <FormNovoItem fkMenusId={menu.id} aoCriar={aoMudar} />
        </div>
    );
};

function ArvoreNos({ nos, aoMudar }: { nos: MenuNoDoBancoDto[]; aoMudar: () => void }) {
    return (
        <ul>
            {nos.map(no => <ItemNo key={no.id} no={no} aoMudar={aoMudar} />)}
        </ul>
    );
};

function ItemNo({ no, aoMudar }: { no: MenuNoDoBancoDto; aoMudar: () => void }) {
    const [editando, setEditando] = useState(false);
    const [titulo, setTitulo] = useState(no.titulo);
    const [salvando, setSalvando] = useState(false);

    async function salvar() {
        setSalvando(true);
        try {
            await editaMenuNo(no.id, { titulo: titulo.trim() });
            setEditando(false);
            aoMudar();
        } finally {
            setSalvando(false);
        }
    };

    return (
        <li>
            {editando ? (
                <>
                    <input type="text" value={titulo} onChange={evento => setTitulo(evento.target.value)} disabled={salvando} />
                    <button type="button" onClick={salvar} disabled={salvando || titulo.trim().length < 1}>{salvando ? '...' : 'Salvar'}</button>
                    <button type="button" onClick={() => { setTitulo(no.titulo); setEditando(false); }} disabled={salvando}>Cancelar</button>
                </>
            ) : (
                <>
                    {no.titulo}{no.tipo === 'item' && no.paginaTemplate ? ` → ${no.paginaTemplate}` : ''}{!no.visivel ? ' (oculto)' : ''}
                    <button type="button" onClick={() => { setTitulo(no.titulo); setEditando(true); }}>editar</button>
                </>
            )}
            {no.filhos.length > 0 && <ArvoreNos nos={no.filhos} aoMudar={aoMudar} />}
        </li>
    );
};

function FormNovoItem({ fkMenusId, aoCriar }: { fkMenusId: number; aoCriar: () => void }) {
    const [titulo, setTitulo] = useState('');
    const [tipo, setTipo] = useState<'item' | 'grupo'>('item');
    const [paginaTemplate, setPaginaTemplate] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const podeSalvar = titulo.trim().length > 0 && (tipo === 'grupo' || paginaTemplate.trim().length > 0) && !salvando;

    async function adicionar() {
        setSalvando(true);
        setErro(null);
        try {
            await criaMenuNo({ fkMenusId, tipo, titulo: titulo.trim(), paginaTemplate: tipo === 'item' ? paginaTemplate.trim() : null, ordem: 0 });
            setTitulo('');
            setPaginaTemplate('');
            aoCriar();
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Erro ao adicionar item.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div>
            <input type="text" placeholder="título do item" value={titulo} onChange={evento => setTitulo(evento.target.value)} disabled={salvando} />
            <select value={tipo} onChange={evento => setTipo(evento.target.value as 'item' | 'grupo')} disabled={salvando}>
                <option value="item">item</option>
                <option value="grupo">grupo</option>
            </select>
            {tipo === 'item' && <input type="text" placeholder="página destino (ex.: /minhas-paginas/admin/gestao-navegacao)" value={paginaTemplate} onChange={evento => setPaginaTemplate(evento.target.value)} disabled={salvando} />}
            <button type="button" onClick={adicionar} disabled={!podeSalvar}>{salvando ? 'Adicionando...' : 'Adicionar item'}</button>
            {erro && <small>{erro}</small>}
        </div>
    );
};
