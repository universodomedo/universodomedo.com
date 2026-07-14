'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { PAYLOAD__CriarSalaChat, PAYLOAD__AtualizarSalaChat, EstadoSalaChat } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { RegistroSalaChat } from '../Contexto__PaginaAdminSalasChat/contexto';
import SPA__PaginaAdminSalasChat__FormularioSala from 'Conteineres/PaginaAdminSalasChat/paginas/SPA__PaginaAdminSalasChat__FormularioSala/SPA__PaginaAdminSalasChat__FormularioSala';

export type FormSalaChat = {
    nome: string;
    leituraPublica: boolean;
    escritaPublica: boolean;
};

interface Contexto__PaginaAdminSalasChat__FormularioSala__Props {
    form: FormSalaChat;
    ehEdicao: boolean;
    salvando: boolean;
    erro: string | null;
    podeSalvar: boolean;
    setCampo: <K extends keyof FormSalaChat>(campo: K, valor: FormSalaChat[K]) => void;
    salvar: () => Promise<void>;
    trancada: boolean;
    definirTrancada: (valor: boolean) => Promise<void>;
    cancelar: () => void;
};

type PropsProvider = {
    salaEmEdicao: RegistroSalaChat | null;
    salvarNovaSala: (dados: PAYLOAD__CriarSalaChat) => Promise<void>;
    salvarEdicaoSala: (dados: PAYLOAD__AtualizarSalaChat) => Promise<void>;
    definirEstadoSala: (id: number, estado: EstadoSalaChat) => Promise<void>;
    cancelar: () => void;
};

const Contexto__PaginaAdminSalasChat__FormularioSala = createContext<Contexto__PaginaAdminSalasChat__FormularioSala__Props | undefined>(undefined);

export const useContexto__PaginaAdminSalasChat__FormularioSala = (): Contexto__PaginaAdminSalasChat__FormularioSala__Props => {
    const context = useContext(Contexto__PaginaAdminSalasChat__FormularioSala);
    if (!context) throw new Error('useContexto__PaginaAdminSalasChat__FormularioSala precisa estar dentro de um Contexto__PaginaAdminSalasChat__FormularioSala');
    return context;
};

export const Contexto__PaginaAdminSalasChat__FormularioSala__Provider = ({ salaEmEdicao, salvarNovaSala, salvarEdicaoSala, definirEstadoSala, cancelar }: PropsProvider) => {
    const ehEdicao = salaEmEdicao !== null;
    const [form, setForm] = useState<FormSalaChat>(() => salaEmEdicao !== null
        ? { nome: salaEmEdicao.nome, leituraPublica: salaEmEdicao.leituraPublica, escritaPublica: salaEmEdicao.escritaPublica }
        : { nome: '', leituraPublica: true, escritaPublica: true });
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [trancada, setTrancada] = useState<boolean>(salaEmEdicao?.estado === 'TRANCADA');

    useConfigurarLayoutContextualizado({
        subtitulo: ehEdicao && salaEmEdicao !== null ? `Editar · ${salaEmEdicao.nome}` : 'Nova Sala',
        fecharProps: { tipo: 'acao', executar: cancelar, tituloTooltip: 'Cancelar' },
    });

    const setCampo = useCallback(<K extends keyof FormSalaChat>(campo: K, valor: FormSalaChat[K]) => setForm(f => ({ ...f, [campo]: valor })), []);

    const podeSalvar = form.nome.trim().length > 0 && !salvando;

    const salvar = useCallback(async (): Promise<void> => {
        setSalvando(true);
        setErro(null);
        try {
            if (ehEdicao && salaEmEdicao !== null) await salvarEdicaoSala({ id: salaEmEdicao.id, nome: form.nome.trim(), leituraPublica: form.leituraPublica, escritaPublica: form.escritaPublica });
            else await salvarNovaSala({ nome: form.nome.trim(), leituraPublica: form.leituraPublica, escritaPublica: form.escritaPublica });
        } catch (capturado) {
            setErro(capturado instanceof Error ? capturado.message : 'Não foi possível salvar a sala.');
        } finally {
            setSalvando(false);
        }
    }, [form, ehEdicao, salaEmEdicao, salvarNovaSala, salvarEdicaoSala]);

    const definirTrancada = useCallback(async (valor: boolean): Promise<void> => {
        if (salaEmEdicao === null) return;
        await definirEstadoSala(salaEmEdicao.id, valor ? 'TRANCADA' : 'ABERTA');
        setTrancada(valor);
    }, [salaEmEdicao, definirEstadoSala]);

    return (
        <Contexto__PaginaAdminSalasChat__FormularioSala.Provider value={{ form, ehEdicao, salvando, erro, podeSalvar, setCampo, salvar, trancada, definirTrancada, cancelar }}>
            <SPA__PaginaAdminSalasChat__FormularioSala />
        </Contexto__PaginaAdminSalasChat__FormularioSala.Provider>
    );
};
