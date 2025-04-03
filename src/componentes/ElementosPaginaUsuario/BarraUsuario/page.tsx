'use client';

import styles from './style.module.css';
import { useState } from 'react';

import { atualizaAvatarUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { PersonagemDto, UsuarioDto } from 'types-nora-api';

import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import Image from "next/image";
import ElementoAvatar from 'Uteis/ImagemLoader/ElementoAvatar';


export default function BarraUsuario({ dadosMinhaPagina }: { dadosMinhaPagina: UsuarioDto }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <>
            <div id={styles.barra_usuario}>
                <div className={styles.recipiente_imagem_usuario}>
                    <Image alt='' src={`${process.env.NEXT_PUBLIC_IMAGE_API_URL}${dadosMinhaPagina.customizacao.caminhoAvatar}`} fill onClick={openModal} />
                </div>
                <div className={styles.recipiente_informacoes_usuario}>
                    <h1>{dadosMinhaPagina.username}</h1>
                </div>
                {/* <div className={styles.recipiente_conquistas_usuario}>
                <div className={styles.recipiente_conquista}>
                    <Image alt='' src={'/medalha.png'} fill />
                </div>
                <div className={styles.recipiente_conquista}>
                    <Image alt='' src={'/medalha.png'} fill />
                </div>
                <div className={styles.recipiente_conquista}>
                    <Image alt='' src={'/medalha.png'} fill />
                </div>
            </div> */}
            </div>
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Content title={'Atualizar Avatar'}>
                    <ConteudoModalAtualizaAvatar listaAvatares={dadosMinhaPagina.personagens?.filter(personagem => personagem.imagemAvatar !== null) ?? []} idPersonagemSelecinadoAtualmente={dadosMinhaPagina.customizacao.personagemAvatarPrincipal?.id} />
                </Modal.Content>
            </Modal>
        </>
    );
};

function ConteudoModalAtualizaAvatar({ listaAvatares, idPersonagemSelecinadoAtualmente }: { listaAvatares: PersonagemDto[], idPersonagemSelecinadoAtualmente: number | undefined; }) {
    async function atualizarAvatarUsuario(idPersonagem: number) {
        if (idPersonagemSelecinadoAtualmente === idPersonagem) return;

        const respostaDadosMinhaPagina = await atualizaAvatarUsuario(idPersonagem);

        if (!respostaDadosMinhaPagina.sucesso) {
            alert('Erro ao alterar o avatar');
        } else {
            window.location.reload();
        }
    };

    return (
        <div id={styles.recipiente_selecao_avatares}>
            {listaAvatares.length <= 0 ? (
                <h2>Não há avatares disponíveis</h2>
            ) : (
                <>
                    {listaAvatares.map(personagem => (
                        <div key={personagem.id} className={styles.recipiente_celula_avatar} onClick={() => { atualizarAvatarUsuario(personagem.id) }}>
                            <div className={`${styles.recipiente_avatar} ${idPersonagemSelecinadoAtualmente === personagem.id ? styles.selecionado_atual : ''}`}>
                                <ElementoAvatar src={personagem.imagemAvatar?.fullPath} />
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div >
    )
};