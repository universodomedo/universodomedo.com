'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { atualizaAvatarUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { PersonagemAvatarDto } from 'types-nora-api';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto.tsx';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import MolduraAvatar from '../MolduraAvatar/page';
import EmblemaMoldura from '../EmblemaMoldura/page';


export default function RecipienteAvatar() {


    const { usuarioLogado } = useContextoAutenticacao();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);



    if (!usuarioLogado) return;

    return (
        <>
            <div className={styles.absolut_avatar}>
                <div className={styles.recipiente_avatar_usuario}>

                    <EmblemaMoldura urlEmblemaMoldura='https://cdn.universodomedo.com/RecursosInternos/6bfaeb00-e67f-4452-a08c-303125ab5687.webp' />

                    <MolduraAvatar urlMoldura='https://cdn.universodomedo.com/RecursosInternos/a58d8d62-8e8c-44ce-af07-0d1019659f69.webp' />

                    <div className={styles.recipiente_imagem_usuario} onClick={openModal}>
                        <RecipienteImagem src={usuarioLogado.customizacao.caminhoAvatar} />
                    </div>
                </div>
            </div>

            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Content cabecalho={{ titulo: 'Atualizar Avatar' }}>
                    <ConteudoModalAtualizaAvatar listaAvatares={usuarioLogado.personagens?.filter(personagem => personagem.caminhoAvatarPersonagem !== null) ?? []} idPersonagemSelecinadoAtualmente={usuarioLogado.customizacao.personagemAvatarPrincipal?.idPersonagem} />
                </Modal.Content>
            </Modal>
        </>
    );
}

function ConteudoModalAtualizaAvatar({ listaAvatares, idPersonagemSelecinadoAtualmente }: { listaAvatares: PersonagemAvatarDto[], idPersonagemSelecinadoAtualmente: number | undefined; }) {
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
                        <div key={personagem.idPersonagem} className={styles.recipiente_celula_avatar} onClick={() => { atualizarAvatarUsuario(personagem.idPersonagem) }}>
                            <div className={`${styles.recipiente_avatar} ${idPersonagemSelecinadoAtualmente === personagem.idPersonagem ? styles.selecionado_atual : ''}`}>
                                <RecipienteImagem src={personagem.caminhoAvatarPersonagem} />
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div >
    )
};