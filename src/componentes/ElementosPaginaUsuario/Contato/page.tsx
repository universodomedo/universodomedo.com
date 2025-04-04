'use client';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { getSocket } from 'Libs/socket.ts';

import { StatusSocketUsuario } from 'types-nora-api';
import ElementoAvatar from 'Uteis/ImagemLoader/ElementoAvatar';

export default function SecaoContatos() {
    const [usuarios, setUsuarios] = useState<StatusSocketUsuario[]>([]);

    useEffect(() => {
        const socket = getSocket();

        socket.on('updateUsers', (usuarios: StatusSocketUsuario[]) => {
            setUsuarios(usuarios);
        });

        return () => {
            socket.off('updateUsers');
        };
    }, []);

    return (
        <div id={styles.portal_usuario_direita}>
            <div className={styles.secao_contatos}>
                <div className={styles.recipiente_lista_contatos}>
                    {usuarios
                        .filter(({ usuario }) => usuario !== undefined)
                        .map(({ usuario, status }) => (
                            <Contato key={usuario!.id} usuario={usuario!} status={status} />
                        ))}
                </div>
            </div>
        </div>
    );
}

function Contato({
    usuario,
    status
}: {
    usuario: NonNullable<StatusSocketUsuario['usuario']>;
    status: boolean;
}) {
    return (
        <div className={styles.recipiente_contato}>
            <div className={styles.recipiente_imagem_contato}>
                <ElementoAvatar src={usuario.customizacao?.caminhoAvatar || 'hi/avatar/0036ea88-0abd-46ae-8770-fcf9e9b89c96.png'} />
            </div>
            <div className={styles.recipiente_informacoes_contato}>
                <h2>{usuario.username}</h2>
                <span style={{ color: status ? 'green' : 'gray' }}>
                    {status ? 'Em Sessão' : 'Offline'}
                </span>
            </div>
        </div>
    );
}
