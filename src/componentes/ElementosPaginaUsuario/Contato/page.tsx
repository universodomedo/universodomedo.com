'use client';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { getSocket } from 'Libs/socket.ts';

import { UsuarioDto } from 'types-nora-api';

import Image from "next/image";
import ElementoAvatar from 'Uteis/ImagemLoader/ElementoAvatar';

export default function SecaoContatos() {
    const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);

    useEffect(() => {
        const socket = getSocket();

        socket.on('updateUsers', (usuarios: UsuarioDto[]) => {
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
                    {usuarios.map(usuario => (
                        <Contato key={usuario.id} usuario={usuario} />
                    ))}
                </div>
            </div>
        </div>
    );
};

function Contato({ usuario }: { usuario: UsuarioDto }) {
    return (
        <div className={styles.recipiente_contato}>
            <div className={styles.recipiente_imagem_contato}>
                <ElementoAvatar src={usuario.customizacao.caminhoAvatar} />
            </div>
            <div className={styles.recipiente_informacoes_contato}>
                <h2>{usuario.username}</h2>
                <span>Em Sessão</span>
            </div>
        </div>
    );
};