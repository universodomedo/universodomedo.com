'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DadosCriacaoSessao_Participante, MomentoFormatado24, PAGINAS, PersonagemCompletaDto, RascunhoCompletaDto } from 'types-nora-api';

import { VALOR_MUNDO_ABERTO } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorRascunho/SelecionadorRascunho';
import { me_criaSessaoUnica, me_obtemRascunhosParaSessaoUnicaNaoCanonica, obtemPersonagensPorUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';

type IdRascunhoSelecionado = number | typeof VALOR_MUNDO_ABERTO;

export type DadosParticipanteTela = {
    idUsuarioParticipante: number;
    participaComPersonagem: boolean;
    idPersonagem: number | null;
};

type PersonagensPorUsuario = {
    idUsuario: number;
    personagens: PersonagemCompletaDto[];
};

interface ContextoPaginaCriarSessaoUnicaProps {
    rascunhosDoUsuario: RascunhoCompletaDto[];
    idsUsuariosSelecionados: number[];
    setIdsUsuariosSelecionados: (v: number[]) => void;
    dadosParticipantes: DadosParticipanteTela[];
    setParticipaComPersonagem: (idUsuarioParticipante: number, participaComPersonagem: boolean) => void;
    setIdPersonagemParticipante: (idUsuarioParticipante: number, idPersonagem: number | null) => void;
    obtemListaPersonagensDoUsuario: (idUsuario: number) => PersonagemCompletaDto[];
    data: Date | null;
    setData: (v: Date | null) => void;
    horaInicio: MomentoFormatado24;
    setHoraInicio: (v: MomentoFormatado24) => void;
    idRascunhoSelecionado: IdRascunhoSelecionado | null;
    setIdRascunhoSelecionado: (v: IdRascunhoSelecionado | null) => void;
    flagCanonico: boolean;
    setFlagCanonico: (v: boolean) => void;
    rascunhoSelecionado: RascunhoCompletaDto | null;
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

    const [rascunhosDoUsuario, setRascunhosDoUsuario] = useState<RascunhoCompletaDto[] | null>(null);

    const [idsUsuariosSelecionados, setIdsUsuariosSelecionados] = useState<number[]>([]);
    const [dadosParticipantes, setDadosParticipantes] = useState<DadosParticipanteTela[]>([]);
    const [personagensPorUsuario, setPersonagensPorUsuario] = useState<PersonagensPorUsuario[]>([]);
    const [data, setData] = useState<Date | null>(null);
    const [horaInicio, setHoraInicio] = useState<MomentoFormatado24>('00:00');
    const [idRascunhoSelecionado, setIdRascunhoSelecionado] = useState<IdRascunhoSelecionado | null>(null);
    const [flagCanonico, setFlagCanonico] = useState<boolean>(false);

    const rascunhoSelecionado: RascunhoCompletaDto | null = typeof idRascunhoSelecionado === 'number' ? rascunhosDoUsuario?.find(rascunho => rascunho.id === idRascunhoSelecionado) ?? null : null;

    const participantesValidos: boolean = dadosParticipantes.length === idsUsuariosSelecionados.length && dadosParticipantes.every(dadosParticipante => !dadosParticipante.participaComPersonagem || dadosParticipante.idPersonagem !== null);
    const podeCriar: boolean = idsUsuariosSelecionados.length > 0 && participantesValidos && data !== null && horaInicio && idRascunhoSelecionado !== null;

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

    async function buscaPersonagensPorUsuario(idUsuario: number) {
        try {
            const personagens = await obtemPersonagensPorUsuario(idUsuario);
            setPersonagensPorUsuario(valorAtual => [...valorAtual.filter(item => item.idUsuario !== idUsuario), { idUsuario, personagens }]);
        } catch {
            setPersonagensPorUsuario(valorAtual => [...valorAtual.filter(item => item.idUsuario !== idUsuario), { idUsuario, personagens: [] }]);
            toast.erro('Erro ao carregar personagens', `Não foi possível carregar os personagens do Usuário ${idUsuario}`);
        }
    };

    function setParticipaComPersonagem(idUsuarioParticipante: number, participaComPersonagem: boolean) {
        setDadosParticipantes(valorAtual => valorAtual.map(dadosParticipante => dadosParticipante.idUsuarioParticipante !== idUsuarioParticipante ? dadosParticipante : { ...dadosParticipante, participaComPersonagem, idPersonagem: participaComPersonagem ? dadosParticipante.idPersonagem : null }));
    };

    function setIdPersonagemParticipante(idUsuarioParticipante: number, idPersonagem: number | null) {
        setDadosParticipantes(valorAtual => valorAtual.map(dadosParticipante => dadosParticipante.idUsuarioParticipante !== idUsuarioParticipante ? dadosParticipante : { ...dadosParticipante, idPersonagem }));
    };

    function obtemListaPersonagensDoUsuario(idUsuario: number): PersonagemCompletaDto[] {
        return personagensPorUsuario.find(item => item.idUsuario === idUsuario)?.personagens ?? [];
    };

    async function criarSessao() {
        if (!podeCriar) return;

        setCarregando('Criando sessao');

        try {
            const idSessaoCriada = await me_criaSessaoUnica({
                dadosParticipantes: dadosParticipantes.map((dadosParticipante): DadosCriacaoSessao_Participante => dadosParticipante.participaComPersonagem ? { idUsuarioParticipante: dadosParticipante.idUsuarioParticipante, tipoParticipante: 'PERSONAGEM', idPersonagem: dadosParticipante.idPersonagem! } : { idUsuarioParticipante: dadosParticipante.idUsuarioParticipante, tipoParticipante: 'FICHA' }),
                idRascunho: idRascunhoSelecionado === VALOR_MUNDO_ABERTO ? null : idRascunhoSelecionado,
                dadosDataParaSessao: { data: data!, horaInicio },
                canonica: flagCanonico
            });

            await toast.sucesso('Ficha salva com sucesso!', `A Ficha foi criada`, { redirecionaLinkInterno: { pagina: PAGINAS.minhasPaginas.mestre.sessao, params: { id: idSessaoCriada } } });
        } catch {
            await toast.erro('Erro ao criar a Sessão.');
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaRascunhos();
    }, []);

    useEffect(() => {
        setDadosParticipantes(valorAtual => idsUsuariosSelecionados.map(idUsuarioSelecionado => valorAtual.find(dadosParticipante => dadosParticipante.idUsuarioParticipante === idUsuarioSelecionado) ?? { idUsuarioParticipante: idUsuarioSelecionado, participaComPersonagem: false, idPersonagem: null }));
    }, [idsUsuariosSelecionados]);

    useEffect(() => {
        setPersonagensPorUsuario(valorAtual => valorAtual.filter(item => idsUsuariosSelecionados.includes(item.idUsuario)));
    }, [idsUsuariosSelecionados]);

    useEffect(() => {
        const idsJaCarregados = personagensPorUsuario.map(item => item.idUsuario);
        const idsParaBuscar = idsUsuariosSelecionados.filter(idUsuario => !idsJaCarregados.includes(idUsuario));

        idsParaBuscar.forEach(idUsuario => { void buscaPersonagensPorUsuario(idUsuario); });
    }, [idsUsuariosSelecionados, personagensPorUsuario]);

    if (carregando) return <div>{carregando}</div>;

    if (!rascunhosDoUsuario) return;

    return (
        <ContextoPaginaCriarSessaoUnica.Provider value={{ rascunhosDoUsuario, idsUsuariosSelecionados, setIdsUsuariosSelecionados, dadosParticipantes, setParticipaComPersonagem, setIdPersonagemParticipante, obtemListaPersonagensDoUsuario, data, setData, horaInicio, setHoraInicio, idRascunhoSelecionado, setIdRascunhoSelecionado, flagCanonico, setFlagCanonico, rascunhoSelecionado, podeCriar, criarSessao }}>
            {children}
        </ContextoPaginaCriarSessaoUnica.Provider>
    );
};