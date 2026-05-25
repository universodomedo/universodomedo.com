'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CaminhoArquivoArte } from 'types-nora-api';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { me_atualizaArteCapaPerfilUsuario, PROTOTIPO_LUIZ__recupera_capa_perfil_usuario } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { useContextoAutenticacao } from '../ContextoAutenticacao/contexto';
import { toast } from '@/hooks/useToast';

interface Contexto__PaginaPerfilUsuario__Props {
    registroUsuario: NonNullable<ReturnType<typeof obtemUsuarioPaginaPerfil>['data']>;
    caminhoArquivoCapa: CaminhoArquivoArte;
    modoEdicao: boolean;
    atualizarCapaPerfilUsuario: (idArquivoTipadoArte: number) => void;
};

const Contexto__PaginaPerfilUsuario = createContext<Contexto__PaginaPerfilUsuario__Props | undefined>(undefined);

export const useContexto__PaginaPerfilUsuario = (): Contexto__PaginaPerfilUsuario__Props => {
    const context = useContext(Contexto__PaginaPerfilUsuario);
    if (!context) throw new Error('useContexto__PaginaPerfilUsuario precisa estar dentro de um Contexto__PaginaPerfilUsuario');
    return context;
};

export const Contexto__PaginaPerfilUsuario__Provider = ({ children, idUsuario }: { children: React.ReactNode; idUsuario: number; }) => {
    const { usuarioLogado } = useContextoAutenticacao();
    const modoEdicao: boolean = !!usuarioLogado && usuarioLogado.id == idUsuario

    const registroUsuario = obtemUsuarioPaginaPerfil(idUsuario);

    const [descricaoTemporaria, setDescricaoTemporaria] = useState('');

    const [caminhoArquivoCapa, setCaminhoCapa] = useState<CaminhoArquivoArte | null>(null)

    async function obtemCaminhoCapa() {
        setCaminhoCapa(await PROTOTIPO_LUIZ__recupera_capa_perfil_usuario())
    }

    async function atualizarCapaPerfilUsuario(idArquivoTipadoArte: number) {
        try {
            await me_atualizaArteCapaPerfilUsuario(idArquivoTipadoArte)
            toast.sucesso('Capa atualizada', 'Capa atualizada com sucesso!', { recarregaPagina: true })
        } catch {
            toast.erro('Erro ao atualizar capa', 'Não foi possível atualizar a capa.')
        }
    }

    useEffect(() => {
        obtemCaminhoCapa()
    }, []);


    if (!caminhoArquivoCapa || !registroUsuario.data) return;

    return (
        <Contexto__PaginaPerfilUsuario.Provider value={{ registroUsuario: registroUsuario.data, caminhoArquivoCapa, modoEdicao, atualizarCapaPerfilUsuario }}>
            {children}
        </Contexto__PaginaPerfilUsuario.Provider>
    );
};

//

export function obtemUsuarioPaginaPerfil(idUsuario: number) {
    return useNoraGraphQLRegistro('Usuario', {
        props: { idUsuario },
        select: ['id', 'username', 'arteCapaPerfil'],
        pk: idUsuario,
        carregando: 'Buscando Usuário',
        mensagemErro: 'Houve um erro recuperando o Usuário',
        carregamento: 'BLOQUEIA_INTERFACE',
    });
};