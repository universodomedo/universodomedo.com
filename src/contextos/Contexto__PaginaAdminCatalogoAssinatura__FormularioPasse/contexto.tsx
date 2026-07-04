'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { PAYLOAD__CriarPasse, PAYLOAD__AtualizarPasse } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { RegistroPasse } from '../Contexto__PaginaAdminCatalogoAssinatura/contexto';
import SPA__PaginaAdminCatalogoAssinatura__FormularioPasse from 'Conteineres/PaginaAdminCatalogoAssinatura/paginas/SPA__PaginaAdminCatalogoAssinatura__FormularioPasse/SPA__PaginaAdminCatalogoAssinatura__FormularioPasse';

export type FormPasse = {
    codigoInterno: string;
    nome: string;
    descricao: string;
};

interface Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse__Props {
    form: FormPasse;
    ehEdicao: boolean;
    salvando: boolean;
    erro: string | null;
    podeSalvar: boolean;
    setCampo: <K extends keyof FormPasse>(campo: K, valor: FormPasse[K]) => void;
    salvar: () => Promise<void>;
    ativo: boolean;
    definirAtivo: (valor: boolean) => Promise<void>;
    cancelar: () => void;
};

type PropsProvider = {
    passeEmEdicao: RegistroPasse | null;
    salvarNovoPasse: (dados: PAYLOAD__CriarPasse) => Promise<void>;
    salvarEdicaoPasse: (dados: PAYLOAD__AtualizarPasse) => Promise<void>;
    definirAtivoPasse: (id: number, ativo: boolean) => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse = createContext<Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse__Props | undefined>(undefined);

export const useContexto__PaginaAdminCatalogoAssinatura__FormularioPasse = (): Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse__Props => {
    const context = useContext(Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse);
    if (!context) throw new Error('useContexto__PaginaAdminCatalogoAssinatura__FormularioPasse precisa estar dentro de um Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse');
    return context;
};

export const Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse__Provider = ({ passeEmEdicao, salvarNovoPasse, salvarEdicaoPasse, definirAtivoPasse, cancelar }: PropsProvider) => {
    const ehEdicao = passeEmEdicao !== null;
    const [form, setForm] = useState<FormPasse>(() => passeEmEdicao !== null
        ? { codigoInterno: passeEmEdicao.codigoInterno, nome: passeEmEdicao.nome, descricao: passeEmEdicao.descricao ?? '' }
        : { codigoInterno: '', nome: '', descricao: '' });
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [ativo, setAtivo] = useState<boolean>(passeEmEdicao?.ativo ?? true);

    useConfigurarLayoutContextualizado({
        subtitulo: ehEdicao && passeEmEdicao !== null ? `Editar · ${passeEmEdicao.nome}` : 'Novo Passe',
        fecharProps: { tipo: 'acao', executar: cancelar, tituloTooltip: 'Cancelar' },
    });

    const setCampo = useCallback(<K extends keyof FormPasse>(campo: K, valor: FormPasse[K]) => setForm(f => ({ ...f, [campo]: valor })), []);

    const podeSalvar = form.nome.trim().length > 0 && (ehEdicao || form.codigoInterno.trim().length > 0) && !salvando;

    const salvar = useCallback(async (): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            const descricao = form.descricao.trim().length > 0 ? form.descricao.trim() : null;
            if (ehEdicao && passeEmEdicao !== null) await salvarEdicaoPasse({ id: passeEmEdicao.id, nome: form.nome.trim(), descricao });
            else await salvarNovoPasse({ codigoInterno: form.codigoInterno.trim(), nome: form.nome.trim(), descricao });
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível salvar o passe.');
        } finally {
            setSalvando(false);
        }
    }, [form, ehEdicao, passeEmEdicao, salvarNovoPasse, salvarEdicaoPasse]);

    const definirAtivo = useCallback(async (valor: boolean): Promise<void> => {
        if (passeEmEdicao === null) return;
        await definirAtivoPasse(passeEmEdicao.id, valor);
        setAtivo(valor);
    }, [passeEmEdicao, definirAtivoPasse]);

    return (
        <Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse.Provider value={{ form, ehEdicao, salvando, erro, podeSalvar, setCampo, salvar, ativo, definirAtivo, cancelar }}>
            <SPA__PaginaAdminCatalogoAssinatura__FormularioPasse />
        </Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse.Provider>
    );
};
