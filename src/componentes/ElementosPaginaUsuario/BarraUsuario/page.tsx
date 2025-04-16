'use client';

import styles from './style.module.css';
import { useState } from 'react';

import { atualizaAvatarUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { PersonagemDto } from 'types-nora-api';

import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import Image from "next/image";
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto.tsx';


export default function BarraUsuario() {
    const { usuarioLogado } = useContextoAutenticacao();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    if (!usuarioLogado) return;

    return (
        <>
            <div id={styles.barra_usuario}>
                <div className={styles.recipiente_imagem_usuario} onClick={openModal}>
                    <RecipienteImagem src={usuarioLogado.customizacao.caminhoAvatar} />
                </div>
                <div className={styles.recipiente_informacoes_usuario}>
                    <h1>{usuarioLogado.username}</h1>
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
                    <ConteudoModalAtualizaAvatar listaAvatares={usuarioLogado.personagens?.filter(personagem => personagem.imagemAvatar !== null) ?? []} idPersonagemSelecinadoAtualmente={usuarioLogado.customizacao.personagemAvatarPrincipal?.id} />
                </Modal.Content>
            </Modal>
        </>
    );
};

function ConteudoModalAtualizaAvatar({ listaAvatares, idPersonagemSelecinadoAtualmente }: { listaAvatares: PersonagemDto[], idPersonagemSelecinadoAtualmente: number | undefined; }) {
    async function atualizarAvatarUsuario(idPersonagem: number) {
        if (idPersonagemSelecinadoAtualmente === idPersonagem) return;

        const respostaDadosMinhaPagina = await atualizaAvatarUsuario(idPersonagem);

        if (!respostaDadosMinhaPagina) {
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
                                <RecipienteImagem src={personagem.imagemAvatar?.fullPath} />
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div >
    )
};