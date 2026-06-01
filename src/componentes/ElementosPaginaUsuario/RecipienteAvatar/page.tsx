'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto.tsx';
import { useContexto__PaginaPerfilUsuario } from '@/contextos/Contexto__PaginaPerfilUsuario/contexto';
import { Recipiente__Contexto__Modal__ConfiguradorAvatar__Provider } from '@/contextos/Contexto__Modal__ConfiguradorAvatar/contexto';
import { RenderArquivoAvatar, RenderArquivoInterno2 } from '@/uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function RecipienteAvatar() {
    const { registroUsuario } = useContexto__PaginaPerfilUsuario();
    const { usuarioLogado } = useContextoAutenticacao();
    const isOwner = !!usuarioLogado && usuarioLogado.id === registroUsuario.id;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.absolut_avatar}>
            <div className={styles.recipiente_avatar_usuario}>
                <RenderArquivoInterno2 arquivoInterno={'TESTE_EMBLEMA__EMBLEMA'} className={styles.recipiente_emblema_moldura} />
                <RenderArquivoInterno2 arquivoInterno={'TESTE_EMBLEMA__MOLDURA'} className={styles.moldura_avatar} />
                <div className={`${styles.recipiente_imagem_usuario}${isOwner ? ` ${styles.recipiente_imagem_usuario_editavel}` : ''}`} onClick={isOwner ? () => setIsModalOpen(true) : undefined}>
                    <RenderArquivoAvatar caminhoArquivoAvatar={registroUsuario.customizacao.caminhoArquivoAvatar} />
                </div>
            </div>
            {isOwner && <Recipiente__Contexto__Modal__ConfiguradorAvatar__Provider isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
        </div>
    );
};