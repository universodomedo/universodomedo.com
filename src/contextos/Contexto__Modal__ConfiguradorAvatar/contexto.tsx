'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import Modal__ConfiguradorAvatar from 'Componentes/ElementosModais/Modal__ConfiguradorAvatar/Modal__ConfiguradorAvatar';
import { ListagemCompostaListagem } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { me_atualizaAvatarPerfilUsuario, me_obtemMinhasChavesNovoAvatar } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from '@/hooks/useToast';

type ChaveAvatar = Awaited<ReturnType<typeof me_obtemMinhasChavesNovoAvatar>>[number];

interface Contexto__Modal__ConfiguradorAvatar__Props {
    listagemChavesAvatar: ListagemCompostaListagem<ChaveAvatar>;
    idChaveNovoAvatarSelecionado: number | null;
    selecionaAvatar: (idChaveNovoAvatar: number) => void;
    executaAtualizacaoAvatarSelecionado: () => Promise<void>;
};

const Contexto__Modal__ConfiguradorAvatar = createContext<Contexto__Modal__ConfiguradorAvatar__Props | undefined>(undefined);

export const useContexto__Modal__ConfiguradorAvatar = (): Contexto__Modal__ConfiguradorAvatar__Props => {
    const context = useContext(Contexto__Modal__ConfiguradorAvatar);
    if (!context) throw new Error('useContexto__Modal__ConfiguradorAvatar precisa estar dentro de um Recipiente__Contexto__Modal__ConfiguradorAvatar__Provider');
    return context;
};

export function Recipiente__Contexto__Modal__ConfiguradorAvatar__Provider({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }) { return <Contexto__Modal__ConfiguradorAvatar__Provider isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />; }

const Contexto__Modal__ConfiguradorAvatar__Provider = ({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }) => {
    const [registros, setRegistros] = useState<ChaveAvatar[]>([]);
    const [carregando, setCarregando] = useState<string | null>('Buscando Avatares');
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        me_obtemMinhasChavesNovoAvatar()
            .then(chaves => { setRegistros(chaves); setCarregando(null); })
            .catch(() => { setErro('Houve um erro recuperando os Avatares'); setCarregando(null); });
    }, []);

    const listagemChavesAvatar: ListagemCompostaListagem<ChaveAvatar> = useMemo(() => ({ registros, carregando, erro, mensagemListaVazia: 'Nenhum avatar disponível.' }), [registros, carregando, erro]);

    const [idChaveNovoAvatarSelecionado, setIdChaveNovoAvatarSelecionado] = useState<number | null>(null);
    const selecionaAvatar = useCallback((idChaveNovoAvatar: number) => { setIdChaveNovoAvatarSelecionado(idChaveNovoAvatar); }, []);

    const executaAtualizacaoAvatarSelecionado = useCallback(async () => {
        if (idChaveNovoAvatarSelecionado === null) return;
        try {
            await me_atualizaAvatarPerfilUsuario(idChaveNovoAvatarSelecionado);
            toast.sucesso('Avatar atualizado', 'Avatar atualizado com sucesso!', { recarregaPagina: true });
        } catch {
            toast.erro('Erro ao atualizar avatar', 'Não foi possível atualizar o avatar.');
        }
        setIsModalOpen(false);
    }, [idChaveNovoAvatarSelecionado, setIsModalOpen]);

    return (
        <Contexto__Modal__ConfiguradorAvatar.Provider value={useMemo(() => ({ listagemChavesAvatar, idChaveNovoAvatarSelecionado, selecionaAvatar, executaAtualizacaoAvatarSelecionado }), [listagemChavesAvatar, idChaveNovoAvatarSelecionado, selecionaAvatar, executaAtualizacaoAvatarSelecionado])}>
            <Modal__ConfiguradorAvatar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </Contexto__Modal__ConfiguradorAvatar.Provider>
    );
};