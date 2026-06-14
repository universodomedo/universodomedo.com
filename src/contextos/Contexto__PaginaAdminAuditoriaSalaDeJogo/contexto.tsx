'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Eventos_Emite, Eventos_Envia, type AcaoSalaJogoAuditoriaVisualizada } from 'types-nora-api';

import { eventoWs, useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import { toast } from 'Hooks/useToast';

export interface Contexto__PaginaAdminAuditoriaSalaDeJogo__Props {
    acoes: AcaoSalaJogoAuditoriaVisualizada[];
    carregando: boolean;
    erro: string | null;
};

const Contexto__PaginaAdminAuditoriaSalaDeJogo = createContext<Contexto__PaginaAdminAuditoriaSalaDeJogo__Props | undefined>(undefined);

export const useContexto__PaginaAdminAuditoriaSalaDeJogo = (): Contexto__PaginaAdminAuditoriaSalaDeJogo__Props => {
    const context = useContext(Contexto__PaginaAdminAuditoriaSalaDeJogo);
    if (!context) throw new Error('useContexto__PaginaAdminAuditoriaSalaDeJogo precisa estar dentro de um Contexto__PaginaAdminAuditoriaSalaDeJogo');
    return context;
};

export const Contexto__PaginaAdminAuditoriaSalaDeJogo__Provider = ({ children }: { children: ReactNode; }) => {
    const [acoes, setAcoes] = useState<AcaoSalaJogoAuditoriaVisualizada[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEmitWsComDisparoInicial(Eventos_Emite.ExecucaoDeJogo.eventos.emitirAuditoriaAcoesSalaJogo, {}, {
        onSuccess: data => {
            setAcoes(acoesAtuais => data.modo === 'historico' ? mesclarAcoesAuditoria([], data.acoes) : mesclarAcoesAuditoria(acoesAtuais, data.acoes));
            setCarregando(false);
            setErro(null);
        },
        onError: error => {
            setCarregando(false);
            setErro(error.mensagem);
            toast.erro('Houve um erro recebendo a auditoria da Sala de Jogo');
        },
    });

    useEffect(() => {
        return () => {
            eventoWs(Eventos_Envia.ExecucaoDeJogo.eventos.encerrarAcompanhamentoAuditoriaAcoesSalaJogo, {});
        };
    }, []);

    return (
        <Contexto__PaginaAdminAuditoriaSalaDeJogo.Provider value={{ acoes, carregando, erro }}>
            {children}
        </Contexto__PaginaAdminAuditoriaSalaDeJogo.Provider>
    );
};

function mesclarAcoesAuditoria(acoesAtuais: AcaoSalaJogoAuditoriaVisualizada[], acoesNovas: AcaoSalaJogoAuditoriaVisualizada[]): AcaoSalaJogoAuditoriaVisualizada[] {
    const acoesPorReferencia = new Map<string, AcaoSalaJogoAuditoriaVisualizada>();
    for (const acao of [...acoesAtuais, ...acoesNovas]) acoesPorReferencia.set(`${acao.referenciaAcao.codigoSala}:${acao.referenciaAcao.idAcao}`, acao);
    return Array.from(acoesPorReferencia.values()).sort((a, b) => b.acao.timestampReal.localeCompare(a.acao.timestampReal) || b.referenciaAcao.codigoSala.localeCompare(a.referenciaAcao.codigoSala) || b.referenciaAcao.idAcao - a.referenciaAcao.idAcao);
};