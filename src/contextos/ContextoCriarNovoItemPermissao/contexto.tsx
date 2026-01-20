'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ItemPermissaoDto } from 'types-nora-api';

import { me_criaItem } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import { useContextoArvoreItensPermissoes } from 'Contextos/ContextoArvoreItensPermissoes/contexto';

interface ContextoCriarNovoItemPermissaoProps {
    parentIdCriacao: number | null;
    paiCriacao: ItemPermissaoDto | null;
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
    const { arvorePermissoes, obtemItemPermissaoPorId } = useContextoArvoreItensPermissoes();

    const [codigo, setCodigo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [salvando, setSalvando] = useState(false);

    const codigoNormalizado = useMemo(() => String(codigo || '').trim().toUpperCase(), [codigo]);
    const descricaoNormalizada = useMemo(() => String(descricao || '').trim(), [descricao]);

    const codigoValido = useMemo(() => !!codigoNormalizado && /^[A-Z_]+$/.test(codigoNormalizado), [codigoNormalizado]);
    const descricaoValida = useMemo(() => !!descricaoNormalizada, [descricaoNormalizada]);

    const podeSalvar = useMemo(() => codigoValido && descricaoValida && !salvando, [codigoValido, descricaoValida, salvando]);

    function reset() { setCodigo(''); setDescricao(''); setSalvando(false); }

    const paiCriacao: ItemPermissaoDto | null = useMemo(() => {
        if (parentIdCriacao === null) return null;
        return obtemItemPermissaoPorId(parentIdCriacao);
    }, [parentIdCriacao, arvorePermissoes]);

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        const ok = await me_criaItem(parentIdCriacao, codigo, descricao);

        if (!ok) await toast.erro('Falha ao criar permissão', 'Backend rejeitou a criação');
        else await toast.sucesso('Permissão criada', `Item ${codigo} criado com sucesso.`, { recarregaPagina: true });
    };

    useEffect(() => {
        if (isModalOpen) reset();
    }, [isModalOpen, parentIdCriacao]);

    return (
        <ContextoCriarNovoItemPermissao.Provider value={{ parentIdCriacao, paiCriacao, codigo, setCodigo, descricao, setDescricao, codigoNormalizado, descricaoNormalizada, codigoValido, descricaoValida, podeSalvar, salvando, salvar, reset }}>
            {children}
        </ContextoCriarNovoItemPermissao.Provider>
    );
};