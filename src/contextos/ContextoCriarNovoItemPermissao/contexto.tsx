'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ItemPermissaoDto, ArvoreItensPermissaoDto } from 'types-nora-api';
import { useContextoArvoreItensPermissoes } from 'Contextos/ContextoArvoreItensPermissoes/contexto';
import { useContextoPaginaPermissoes } from 'Contextos/ContextoPaginaPermissoes/contexto';

type NodePermissao = ArvoreItensPermissaoDto['tree'][number];

interface ContextoCriarNovoItemPermissaoProps {
    parentIdCriacao: number | null;
    paiCriacao: ItemPermissaoDto | null;
    labelPaiCriacao: string;
    codigo: string;
    setCodigo: (v: string) => void;
    descricao: string;
    setDescricao: (v: string) => void;
    codigoNormalizado: string;
    descricaoNormalizada: string;
    codigoValido: boolean;
    descricaoValida: boolean;
    podeSalvar: boolean;
    salvando: boolean;
    salvar: () => Promise<void>;
    reset: () => void;
};

const ContextoCriarNovoItemPermissao = createContext<ContextoCriarNovoItemPermissaoProps | undefined>(undefined);

export function useContextoCriarNovoItemPermissao(): ContextoCriarNovoItemPermissaoProps {
    const ctx = useContext(ContextoCriarNovoItemPermissao);
    if (!ctx) throw new Error('useContextoCriarNovoItemPermissao precisa estar dentro de ContextoCriarNovoItemPermissaoProvider');
    return ctx;
};

export function ContextoCriarNovoItemPermissaoProvider({ children, isModalOpen, parentIdCriacao }: { children: React.ReactNode; isModalOpen: boolean; parentIdCriacao: number | null }) {
    const { arvorePermissoes } = useContextoArvoreItensPermissoes();
    const { criaItem } = useContextoPaginaPermissoes();

    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [salvando, setSalvando] = useState(false);

    const codigoNormalizado = useMemo(() => String(codigo || '').trim().toUpperCase(), [codigo]);
    const descricaoNormalizada = useMemo(() => String(descricao || '').trim(), [descricao]);

    const codigoValido = useMemo(() => !!codigoNormalizado && /^[A-Z_]+$/.test(codigoNormalizado), [codigoNormalizado]);
    const descricaoValida = useMemo(() => !!descricaoNormalizada, [descricaoNormalizada]);

    const podeSalvar = useMemo(() => codigoValido && descricaoValida && !salvando, [codigoValido, descricaoValida, salvando]);

    function reset() { setCodigo(''); setDescricao(''); setSalvando(false); }

    function obtemItemPorId(id: number): NodePermissao | null {
        function walk(lista: NodePermissao[]): NodePermissao | null {
            for (const n of lista) {
                if (n.id === id) return n;
                const achou = walk(n.children || []);
                if (achou) return achou;
            }
            return null;
        }
        return walk(arvorePermissoes.tree);
    }

    const paiCriacao: ItemPermissaoDto | null = useMemo(() => {
        if (parentIdCriacao === null) return null;
        return obtemItemPorId(parentIdCriacao);
    }, [parentIdCriacao, arvorePermissoes]);

    const labelPaiCriacao = useMemo(() => (parentIdCriacao === null ? 'RAIZ' : (paiCriacao ? paiCriacao.path : `#${parentIdCriacao}`)), [parentIdCriacao, paiCriacao]);

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        setSalvando(true);
        try {
            await criaItem(parentIdCriacao, codigoNormalizado, descricaoNormalizada);
        } finally {
            setSalvando(false);
        }
    }

    useEffect(() => {
        if (isModalOpen) reset();
    }, [isModalOpen, parentIdCriacao]);

    return (
        <ContextoCriarNovoItemPermissao.Provider value={{ parentIdCriacao, paiCriacao, labelPaiCriacao, codigo, setCodigo, descricao, setDescricao, codigoNormalizado, descricaoNormalizada, codigoValido, descricaoValida, podeSalvar, salvando, salvar, reset }}>
            {children}
        </ContextoCriarNovoItemPermissao.Provider>
    );
};