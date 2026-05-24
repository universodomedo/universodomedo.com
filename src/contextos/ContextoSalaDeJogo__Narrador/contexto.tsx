'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Eventos_EnviaERecebe, LogicaJogoUsuario_ObjetoInicialSalaDto__Narrador, PericiaCompletaDto } from 'types-nora-api';

import { eventoWs, getSocket } from 'Hooks/useEventoWs';
import { useToast } from 'Hooks/useToast';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectCache } from 'Redux/slices/cacheSlice';
import SPA_SalaDeJogo__Narrador from 'Conteineres/EmJogo/paginas/SPA_SalaDeJogo__Narrador/SPA_SalaDeJogo__Narrador';

interface ContextoSalaDeJogo__NarradorProps {
    dadosSalaDeJogo__Narrador: LogicaJogoUsuario_ObjetoInicialSalaDto__Narrador;
    periciasDisponiveis: PericiaCompletaDto[];
    idPericiaSelecionadaParaTeste: number | null;
    idsUsuariosParticipantesSelecionadosParaTeste: number[];
    estaSolicitandoTestePericiaParticipantes: boolean;
    selecionarPericiaParaTesteParticipantes: (idPericia: number | null) => void;
    alternarSelecaoParticipanteParaTestePericia: (idUsuario: number) => void;
    solicitarTestePericiaParticipantesSelecionados: () => void;
};

const ContextoSalaDeJogo__Narrador = createContext<ContextoSalaDeJogo__NarradorProps | undefined>(undefined);

export const useContextoSalaDeJogo__Narrador = (): ContextoSalaDeJogo__NarradorProps => {
    const context = useContext(ContextoSalaDeJogo__Narrador);
    if (!context) throw new Error('useContextoSalaDeJogo__Narrador precisa estar dentro de um ContextoSalaDeJogo__Narrador');
    return context;
};

export const ContextoSalaDeJogo__NarradorProvider = ({ dadosSalaDeJogo__Narrador }: { dadosSalaDeJogo__Narrador: LogicaJogoUsuario_ObjetoInicialSalaDto__Narrador; }) => {
    const toast = useToast();
    const cache = useAppSelector(selectCache);
    const periciasDisponiveis = useMemo(() => cache?.pericias ?? [], [cache?.pericias]);

    const [idPericiaSelecionadaParaTeste, setIdPericiaSelecionadaParaTeste] = useState<number | null>(null);
    const [idsUsuariosParticipantesSelecionadosParaTeste, setIdsUsuariosParticipantesSelecionadosParaTeste] = useState<number[]>([]);
    const [estaSolicitandoTestePericiaParticipantes, setEstaSolicitandoTestePericiaParticipantes] = useState(false);

    const selecionarPericiaParaTesteParticipantes = useCallback((idPericia: number | null) => {
        setIdPericiaSelecionadaParaTeste(idPericia);
    }, []);

    const alternarSelecaoParticipanteParaTestePericia = useCallback((idUsuario: number) => {
        setIdsUsuariosParticipantesSelecionadosParaTeste((idsAtuais) => idsAtuais.includes(idUsuario) ? idsAtuais.filter(idUsuarioAtual => idUsuarioAtual !== idUsuario) : [...idsAtuais, idUsuario]);
    }, []);

    const solicitarTestePericiaParticipantesSelecionados = useCallback(() => {
        if (idPericiaSelecionadaParaTeste === null) {
            void toast.aviso('Pericia nao selecionada', 'Escolha uma pericia antes de solicitar o teste.');
            return;
        }

        if (idsUsuariosParticipantesSelecionadosParaTeste.length === 0) {
            void toast.aviso('Participante nao selecionado', 'Escolha ao menos um participante para receber o teste.');
            return;
        }

        if (!getSocket()) {
            void toast.erro('WebSocket indisponivel', 'Nao foi possivel solicitar o teste agora.');
            return;
        }

        setEstaSolicitandoTestePericiaParticipantes(true);

        // eventoWs(Eventos_Envia.Jogo.eventos.executaTestePericia_PROTOTIPO, { tipo: 'TESTE_JOGADOR', valorAtributo: valorAtributo, valorPericia: valorPericia, abrevPericia: abrevPericia });
        eventoWs(Eventos_EnviaERecebe.ExecucaoDeJogo.eventos.NARRADOR_solicitaTestePericiaParticipantes, {
            codigoSala: dadosSalaDeJogo__Narrador.codigoSalaDeJogo,
            idPericia: idPericiaSelecionadaParaTeste,
            idsUsuariosParticipantes: idsUsuariosParticipantesSelecionadosParaTeste,
        }, {
            onSuccess: () => {
                setEstaSolicitandoTestePericiaParticipantes(false);
                void toast.sucesso('Teste executado', 'Resultado registrado nas mensagens da sessao.');
            },
            onError: (error) => {
                setEstaSolicitandoTestePericiaParticipantes(false);
                void toast.erro('Falha ao executar teste', error.mensagem);
            },
        });
    }, [dadosSalaDeJogo__Narrador.codigoSalaDeJogo, idPericiaSelecionadaParaTeste, idsUsuariosParticipantesSelecionadosParaTeste, toast]);

    const contexto = useMemo<ContextoSalaDeJogo__NarradorProps>(() => ({
        dadosSalaDeJogo__Narrador,
        periciasDisponiveis,
        idPericiaSelecionadaParaTeste,
        idsUsuariosParticipantesSelecionadosParaTeste,
        estaSolicitandoTestePericiaParticipantes,
        selecionarPericiaParaTesteParticipantes,
        alternarSelecaoParticipanteParaTestePericia,
        solicitarTestePericiaParticipantesSelecionados,
    }), [dadosSalaDeJogo__Narrador, periciasDisponiveis, idPericiaSelecionadaParaTeste, idsUsuariosParticipantesSelecionadosParaTeste, estaSolicitandoTestePericiaParticipantes, selecionarPericiaParaTesteParticipantes, alternarSelecaoParticipanteParaTestePericia, solicitarTestePericiaParticipantesSelecionados]);

    return (
        <ContextoSalaDeJogo__Narrador.Provider value={contexto}>
            <SPA_SalaDeJogo__Narrador />
        </ContextoSalaDeJogo__Narrador.Provider>
    );
};
