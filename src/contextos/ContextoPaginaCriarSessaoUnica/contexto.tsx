'use client';

import { toast } from 'Hooks/useToast';
import { createContext, useContext, useEffect, useState } from 'react';
import { MomentoFormatado24, PAGINAS, RascunhoDto } from 'types-nora-api';
import { me_criaSessaoUnicaNaoCanonica, me_obtemRascunhosParaSessaoUnicaNaoCanonica } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaCriarSessaoUnicaProps {
    rascunhosDoUsuario: RascunhoDto[];
    idsUsuariosSelecionados: number[];
    setIdsUsuariosSelecionados: (v: number[]) => void;
    data: Date | null;
    setData: (v: Date | null) => void;
    horaInicio: MomentoFormatado24;
    setHoraInicio: (v: MomentoFormatado24) => void;
    horaFim: MomentoFormatado24;
    setHoraFim: (v: MomentoFormatado24) => void;
    idRascunhoSelecionado: number | null;
    setIdRascunhoSelecionado: (v: number | null) => void;
    rascunhoSelecionado: RascunhoDto | null;
    podeCriar: boolean;
    criarSessao: () => void;
};

const ContextoPaginaCriarSessaoUnica = createContext<ContextoPaginaCriarSessaoUnicaProps | undefined>(undefined);

export const useContextoPaginaCriarSessaoUnica = (): ContextoPaginaCriarSessaoUnicaProps => {
    const context = useContext(ContextoPaginaCriarSessaoUnica);
    if (!context) throw new Error('useContextoPaginaCriarSessaoUnica precisa estar dentro de um ContextoPaginaCriarSessaoUnica');
    return context;
};

export const ContextoPaginaCriarSessaoUnicaProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);

    const [rascunhosDoUsuario, setRascunhosDoUsuario] = useState<RascunhoDto[] | null>(null);

    const [idsUsuariosSelecionados, setIdsUsuariosSelecionados] = useState<number[]>([]);
    const [data, setData] = useState<Date | null>(null);
    const [horaInicio, setHoraInicio] = useState<MomentoFormatado24>('00:00');
    const [horaFim, setHoraFim] = useState<MomentoFormatado24>('23:59');
    const [idRascunhoSelecionado, setIdRascunhoSelecionado] = useState<number | null>(null);

    const rascunhoSelecionado: RascunhoDto | null = idRascunhoSelecionado ? rascunhosDoUsuario?.find(rascunho => rascunho.id === idRascunhoSelecionado)! : null;

    const podeCriar: boolean = idsUsuariosSelecionados.length > 0 && data !== null && horaInicio && horaFim && idRascunhoSelecionado !== null;

    async function buscaRascunhos() {
        setCarregando('Buscando seus Rascunhos');

        try {
            setRascunhosDoUsuario(await me_obtemRascunhosParaSessaoUnicaNaoCanonica());
        } catch {
            setRascunhosDoUsuario(null);
        } finally {
            setCarregando(null);
        }
    };

    async function criarSessao() {
        if (!podeCriar) return;

        setCarregando('Criando sessao');
        
        try {
            const retorno = await me_criaSessaoUnicaNaoCanonica({ idsUsuariosParticipantes: idsUsuariosSelecionados, idRascunho: idRascunhoSelecionado!, dadosDataParaSessao: { data: data!, horaInicio: horaInicio, horaFim: horaFim } });
            await toast.sucesso('Ficha salva com sucesso!', `A Ficha foi criada`, { redirecionaLinkInterno: { pagina: PAGINAS.minhasPaginas.mestre.sessao, params: { id: retorno.id } } });
        } catch {
            await toast.erro('Erro ao criar a Sessão.');
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaRascunhos();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    if (!rascunhosDoUsuario) return;

    return (
        <ContextoPaginaCriarSessaoUnica.Provider value={{ rascunhosDoUsuario, idsUsuariosSelecionados, setIdsUsuariosSelecionados, data, setData, horaInicio, setHoraInicio, horaFim, setHoraFim, idRascunhoSelecionado, setIdRascunhoSelecionado, rascunhoSelecionado, podeCriar, criarSessao }}>
            {children}
        </ContextoPaginaCriarSessaoUnica.Provider>
    );
};