'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { PAYLOAD__CriarProduto, PAYLOAD__AtualizarProduto } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { RegistroProduto } from '../Contexto__PaginaAdminCatalogoAssinatura/contexto';
import SPA__PaginaAdminCatalogoAssinatura__FormularioProduto from 'Conteineres/PaginaAdminCatalogoAssinatura/paginas/SPA__PaginaAdminCatalogoAssinatura__FormularioProduto/SPA__PaginaAdminCatalogoAssinatura__FormularioProduto';

export type FormProduto = {
    codigoInterno: string;
    nome: string;
    descricao: string;
    valorLivre: boolean;
    valorCentavos: number;
};

interface Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto__Props {
    form: FormProduto;
    ehEdicao: boolean;
    salvando: boolean;
    erro: string | null;
    podeSalvar: boolean;
    setCampo: <K extends keyof FormProduto>(campo: K, valor: FormProduto[K]) => void;
    salvar: () => Promise<void>;
    ativo: boolean;
    definirAtivo: (valor: boolean) => Promise<void>;
    cancelar: () => void;
};

type PropsProvider = {
    produtoEmEdicao: RegistroProduto | null;
    salvarNovoProduto: (dados: PAYLOAD__CriarProduto) => Promise<void>;
    salvarEdicaoProduto: (dados: PAYLOAD__AtualizarProduto) => Promise<void>;
    definirAtivoProduto: (id: number, ativo: boolean) => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto = createContext<Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto__Props | undefined>(undefined);

export const useContexto__PaginaAdminCatalogoAssinatura__FormularioProduto = (): Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto__Props => {
    const context = useContext(Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto);
    if (!context) throw new Error('useContexto__PaginaAdminCatalogoAssinatura__FormularioProduto precisa estar dentro de um Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto');
    return context;
};

export const Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto__Provider = ({ produtoEmEdicao, salvarNovoProduto, salvarEdicaoProduto, definirAtivoProduto, cancelar }: PropsProvider) => {
    const ehEdicao = produtoEmEdicao !== null;
    const [form, setForm] = useState<FormProduto>(() => produtoEmEdicao !== null
        ? { codigoInterno: produtoEmEdicao.codigoInterno, nome: produtoEmEdicao.nome, descricao: produtoEmEdicao.descricao ?? '', valorLivre: produtoEmEdicao.valorCentavos === null, valorCentavos: produtoEmEdicao.valorCentavos ?? 0 }
        : { codigoInterno: '', nome: '', descricao: '', valorLivre: false, valorCentavos: 0 });
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [ativo, setAtivo] = useState<boolean>(produtoEmEdicao?.ativo ?? true);

    useConfigurarLayoutContextualizado({
        subtitulo: ehEdicao && produtoEmEdicao !== null ? `Editar · ${produtoEmEdicao.nome}` : 'Novo Produto',
        fecharProps: { tipo: 'acao', executar: cancelar, tituloTooltip: 'Cancelar' },
    });

    const setCampo = useCallback(<K extends keyof FormProduto>(campo: K, valor: FormProduto[K]) => setForm(f => ({ ...f, [campo]: valor })), []);

    const podeSalvar = form.nome.trim().length > 0 && (ehEdicao || form.codigoInterno.trim().length > 0) && (form.valorLivre || form.valorCentavos > 0) && !salvando;

    const salvar = useCallback(async (): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            const valorCentavos = form.valorLivre ? null : Math.round(form.valorCentavos);
            const descricao = form.descricao.trim().length > 0 ? form.descricao.trim() : null;
            if (ehEdicao && produtoEmEdicao !== null) await salvarEdicaoProduto({ id: produtoEmEdicao.id, nome: form.nome.trim(), descricao, valorCentavos });
            else await salvarNovoProduto({ codigoInterno: form.codigoInterno.trim(), nome: form.nome.trim(), descricao, valorCentavos });
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível salvar o produto.');
        } finally {
            setSalvando(false);
        }
    }, [form, ehEdicao, produtoEmEdicao, salvarNovoProduto, salvarEdicaoProduto]);

    const definirAtivo = useCallback(async (valor: boolean): Promise<void> => {
        if (produtoEmEdicao === null) return;
        await definirAtivoProduto(produtoEmEdicao.id, valor);
        setAtivo(valor);
    }, [produtoEmEdicao, definirAtivoProduto]);

    return (
        <Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto.Provider value={{ form, ehEdicao, salvando, erro, podeSalvar, setCampo, salvar, ativo, definirAtivo, cancelar }}>
            <SPA__PaginaAdminCatalogoAssinatura__FormularioProduto />
        </Contexto__PaginaAdminCatalogoAssinatura__FormularioProduto.Provider>
    );
};
