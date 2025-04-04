'use client';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { getSocket } from 'Libs/socket.ts';

import { SOCKET_UsuarioContato } from 'types-nora-api';
import ElementoAvatar from 'Uteis/ImagemLoader/ElementoAvatar';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export default function SecaoContatos() {
    const [usuariosContato, setUsuariosContato] = useState<SOCKET_UsuarioContato[]>([]);
    const { usuarioLogado } = useContextoAutenticacao();
    const usuariosContatoOrdenados = [...usuariosContato].filter(contato => contato.usuario.id !== usuarioLogado?.id).sort((a, b) => {
        if (a.conectado > b.conectado) return -1;
        if (a.conectado < b.conectado) return 1;

        const usernameA = a.usuario.username || '';
        const usernameB = b.usuario.username || '';

        return usernameA.localeCompare(usernameB);
    });

    useEffect(() => {
        const socket = getSocket();

        socket.on('updateUsers', (usuarios: SOCKET_UsuarioContato[]) => {
            setUsuariosContato(usuarios);
        });

        return () => {
            socket.off('updateUsers');
        };
    }, []);

    const { scrollableProps } = useScrollable();

    return (
        <div id={styles.portal_usuario_direita} {...scrollableProps}>
            <div className={styles.secao_contatos}>
                <div className={styles.recipiente_lista_contatos}>
                    {usuariosContatoOrdenados.map(usuarioContato => (
                        <Contato key={usuarioContato.usuario.id} estadoUsuario={usuarioContato} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function Contato({ estadoUsuario }: { estadoUsuario: SOCKET_UsuarioContato; }) {
    return (
        <div className={`${styles.recipiente_contato} ${!estadoUsuario.conectado ? styles.contato_desconectado : ''}`}>
            <div className={styles.recipiente_imagem_contato}>
                <ElementoAvatar src={estadoUsuario.usuario.customizacao.caminhoAvatar} />
            </div>
            <div className={styles.recipiente_informacoes_contato}>
                <h2>{estadoUsuario.usuario.username}</h2>
            </div>
        </div>
    );
}
