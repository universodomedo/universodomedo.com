'use client';

import styles from './styles.module.css';

import { useContext, useState } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto.tsx';
import { useContexto__PaginaPerfilUsuario } from '@/contextos/Contexto__PaginaPerfilUsuario/contexto';
import { Contexto__PaginaMinhaPagina } from '@/contextos/Contexto__PaginaMinhaPagina/contexto';
import { RenderArquivoInterno2 } from '@/uteis/RenderArquivoTipados/RenderArquivoTipados';
import { AvatarUsuarioEmVisualizacao_CACHED } from '@/componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import { Recipiente__Contexto__Modal__ConfiguradorAvatar__Provider } from '@/contextos/Contexto__Modal__ConfiguradorAvatar/contexto';

export default function RecipienteAvatar() {
    const { registroUsuario } = useContexto__PaginaPerfilUsuario();
    const { usuarioLogado } = useContextoAutenticacao();
    const estaNaMinhaPagina = !!useContext(Contexto__PaginaMinhaPagina);
    const podeEditar = estaNaMinhaPagina && !!usuarioLogado && usuarioLogado.id === registroUsuario.id;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.absolut_avatar}>
            <div className={styles.recipiente_avatar_usuario}>
                <RenderArquivoInterno2 arquivoInterno={'TESTE_EMBLEMA__EMBLEMA'} className={styles.recipiente_emblema_moldura} />
                <RenderArquivoInterno2 arquivoInterno={'TESTE_EMBLEMA__MOLDURA'} className={styles.moldura_avatar} />
                <div className={`${styles.recipiente_imagem_usuario}${podeEditar ? ` ${styles.recipiente_imagem_usuario_editavel}` : ''}`} onClick={podeEditar ? () => setIsModalOpen(true) : undefined}>
                    <AvatarUsuarioEmVisualizacao_CACHED idUsuario={registroUsuario.id} />
                </div>
            </div>
            {podeEditar && <Recipiente__Contexto__Modal__ConfiguradorAvatar__Provider isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </div>
    );
};