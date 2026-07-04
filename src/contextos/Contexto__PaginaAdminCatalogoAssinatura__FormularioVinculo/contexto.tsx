'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { PAYLOAD__CriarVinculoProdutoPasse, PAYLOAD__AtualizarVinculoProdutoPasse } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { RegistroVinculo } from '../Contexto__PaginaAdminCatalogoAssinatura/contexto';
import SPA__PaginaAdminCatalogoAssinatura__FormularioVinculo from 'Conteineres/PaginaAdminCatalogoAssinatura/paginas/SPA__PaginaAdminCatalogoAssinatura__FormularioVinculo/SPA__PaginaAdminCatalogoAssinatura__FormularioVinculo';

export type FormVinculo = {
    fkProdutosId: number | null;
    nomeProduto: string;
    fkPassesId: number | null;
    nomePasse: string;
    diasDeValidade: number;
};

interface Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo__Props {
    form: FormVinculo;
    ehEdicao: boolean;
    salvando: boolean;
    erro: string | null;
    podeSalvar: boolean;
    setCampo: <K extends keyof FormVinculo>(campo: K, valor: FormVinculo[K]) => void;
    salvar: () => Promise<void>;
    ativo: boolean;
    definirAtivo: (valor: boolean) => Promise<void>;
    cancelar: () => void;
};

type PropsProvider = {
    vinculoEmEdicao: RegistroVinculo | null;
    salvarNovoVinculo: (dados: PAYLOAD__CriarVinculoProdutoPasse) => Promise<void>;
    salvarEdicaoVinculo: (dados: PAYLOAD__AtualizarVinculoProdutoPasse) => Promise<void>;
    definirAtivoVinculo: (id: number, ativo: boolean) => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo = createContext<Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo__Props | undefined>(undefined);

export const useContexto__PaginaAdminCatalogoAssinatura__FormularioVinculo = (): Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo__Props => {
    const context = useContext(Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo);
    if (!context) throw new Error('useContexto__PaginaAdminCatalogoAssinatura__FormularioVinculo precisa estar dentro de um Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo');
    return context;
};

export const Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo__Provider = ({ vinculoEmEdicao, salvarNovoVinculo, salvarEdicaoVinculo, definirAtivoVinculo, cancelar }: PropsProvider) => {
    const ehEdicao = vinculoEmEdicao !== null;
    const [form, setForm] = useState<FormVinculo>(() => vinculoEmEdicao !== null
        ? { fkProdutosId: vinculoEmEdicao.produto.id, nomeProduto: vinculoEmEdicao.produto.nome, fkPassesId: vinculoEmEdicao.passe.id, nomePasse: vinculoEmEdicao.passe.nome, diasDeValidade: vinculoEmEdicao.diasDeValidade }
        : { fkProdutosId: null, nomeProduto: '', fkPassesId: null, nomePasse: '', diasDeValidade: 30 });
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [ativo, setAtivo] = useState<boolean>(vinculoEmEdicao?.ativo ?? true);

    useConfigurarLayoutContextualizado({
        subtitulo: ehEdicao && vinculoEmEdicao !== null ? `Editar · ${vinculoEmEdicao.produto.nome} → ${vinculoEmEdicao.passe.nome}` : 'Novo Vínculo',
        fecharProps: { tipo: 'acao', executar: cancelar, tituloTooltip: 'Cancelar' },
    });

    const setCampo = useCallback(<K extends keyof FormVinculo>(campo: K, valor: FormVinculo[K]) => setForm(f => ({ ...f, [campo]: valor })), []);

    const podeSalvar = (ehEdicao || (form.fkProdutosId !== null && form.fkPassesId !== null)) && form.diasDeValidade > 0 && form.diasDeValidade <= 365 && !salvando;

    const salvar = useCallback(async (): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            if (ehEdicao && vinculoEmEdicao !== null) await salvarEdicaoVinculo({ id: vinculoEmEdicao.id, diasDeValidade: Math.round(form.diasDeValidade) });
            else if (form.fkProdutosId !== null && form.fkPassesId !== null) await salvarNovoVinculo({ fkProdutosId: form.fkProdutosId, fkPassesId: form.fkPassesId, diasDeValidade: Math.round(form.diasDeValidade) });
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível salvar o vínculo.');
        } finally {
            setSalvando(false);
        }
    }, [form, ehEdicao, vinculoEmEdicao, salvarNovoVinculo, salvarEdicaoVinculo]);

    const definirAtivo = useCallback(async (valor: boolean): Promise<void> => {
        if (vinculoEmEdicao === null) return;
        await definirAtivoVinculo(vinculoEmEdicao.id, valor);
        setAtivo(valor);
    }, [vinculoEmEdicao, definirAtivoVinculo]);

    return (
        <Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo.Provider value={{ form, ehEdicao, salvando, erro, podeSalvar, setCampo, salvar, ativo, definirAtivo, cancelar }}>
            <SPA__PaginaAdminCatalogoAssinatura__FormularioVinculo />
        </Contexto__PaginaAdminCatalogoAssinatura__FormularioVinculo.Provider>
    );
};
