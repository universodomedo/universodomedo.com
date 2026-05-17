'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import Image from 'next/image';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

import Modal from 'Componentes/Elementos/Modal/Modal.tsx';

import { atualizaAvatarUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

import { PersonagemAvatarDto } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto.tsx';

export default function CardInformacoesUsuario() {

    const { usuarioLogado } = useContextoAutenticacao();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    const [descricaoTemporaria, setDescricaoTemporaria] = useState(
        ''
    );

    const [descricaoUsuario, setDescricaoUsuario] = useState(
        ''
    );

    const [modoEdicao, setModoEdicao] = useState(false);

    function iniciarEdicao() {
        setDescricaoTemporaria(descricaoUsuario);
        setModoEdicao(true);
    }

    function salvarDescricao() {
        setDescricaoUsuario(descricaoTemporaria);
        setModoEdicao(false);
    }

    function cancelarEdicao() {
        setDescricaoTemporaria('');
        setModoEdicao(false);
    }

    if (!usuarioLogado) return;

    return (
        <>
            <div className={styles.recipiente_card_usuario}>
                <h2></h2>
                <div className={styles.capa_usuario}>
                    <a className={styles.texto_editacao}>
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.9201 3.38933C14.4096 2.89993 15.0733 2.625 15.7654 2.625C16.1081 2.625 16.4475 2.6925 16.7641 2.82364C17.0807 2.95479 17.3683 3.14701 17.6107 3.38933C17.853 3.63165 18.0452 3.91934 18.1764 4.23595C18.3076 4.55256 18.375 4.8919 18.375 5.23459C18.375 5.57728 18.3076 5.91663 18.1764 6.23324C18.0452 6.54985 17.853 6.83753 17.6107 7.07985L16.6452 8.04533C16.3035 8.38704 15.7495 8.38704 15.4078 8.04534L12.9547 5.59225C12.613 5.25054 12.613 4.69652 12.9547 4.35481L13.9201 3.38933ZM11.7172 6.82969C11.3755 6.48798 10.8215 6.48798 10.4798 6.82969L4.3845 12.925C3.8238 13.4857 3.42603 14.1882 3.23372 14.9575L2.65114 17.2878C2.5766 17.5859 2.66397 17.9014 2.8813 18.1187C3.09863 18.3361 3.41406 18.4234 3.71224 18.3488L6.04252 17.7663C6.81178 17.574 7.51432 17.1762 8.07501 16.6156L14.1703 10.5202C14.5121 10.1785 14.5121 9.62447 14.1703 9.28279L11.7172 6.82969Z" fill="currentColor" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.5 17.5C10.5 17.0167 10.8917 16.625 11.375 16.625H17.5C17.9833 16.625 18.375 17.0167 18.375 17.5C18.375 17.9833 17.9833 18.375 17.5 18.375H11.375C10.8917 18.375 10.5 17.9833 10.5 17.5Z" fill="currentColor" />
                        </svg>
                        <p>Editar</p>
                    </a>
                    <div className={styles.filtro_capa} />
                    <div className={styles.imagem_capa}>
                        <Image alt='' src={'https://cdn.universodomedo.com/RecursosPublicos/imagem_especial_artista/7b1822c9-a109-4eea-a28d-382fa8f28f59.webp'} fill unoptimized />
                    </div>
                </div>

                <div id={styles.barra_usuario}>
                    <div className={styles.absolut_avatar}>
                        <div className={styles.recipiente_avatar_usuario}>
                            <div className={styles.recipiente_emblema_moldura}>
                                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/6bfaeb00-e67f-4452-a08c-303125ab5687.webp'} fill unoptimized />
                            </div>
                            <div className={styles.moldura_avatar}>
                                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/a58d8d62-8e8c-44ce-af07-0d1019659f69.webp'} fill unoptimized />
                            </div>
                            <div className={styles.recipiente_imagem_usuario} onClick={openModal}>
                                <RecipienteImagem src={usuarioLogado.customizacao.caminhoAvatar} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.recipiente_informacoes_usuario}>
                        <h1>{usuarioLogado.username}</h1>
                        <div className={styles.divisoria_usuario} />
                        <div className={styles.descricao_usuario}>
                            {modoEdicao ? (
                                <>
                                    <textarea
                                        maxLength={240}
                                        placeholder='O que você está pensando?'
                                        value={descricaoTemporaria}
                                        onChange={(e) => setDescricaoTemporaria(e.target.value)}
                                    />
                                    <div className={styles.recipiente_botao_salvar_cancelar}>
                                        <button className={styles.botao_salvar} onClick={salvarDescricao}>Salvar</button>
                                        <button className={styles.botao_cancelar} onClick={() => setModoEdicao(false)}>Cancelar</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button className={styles.descricao_editacao_icone} style={{ border: 'none', background: 'none' }} onClick={iniciarEdicao}>
                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path clip-rule="evenodd" d="M13.9201 3.38933C14.4096 2.89993 15.0733 2.625 15.7654 2.625C16.1081 2.625 16.4475 2.6925 16.7641 2.82364C17.0807 2.95479 17.3683 3.14701 17.6107 3.38933C17.853 3.63165 18.0452 3.91934 18.1764 4.23595C18.3076 4.55256 18.375 4.8919 18.375 5.23459C18.375 5.57728 18.3076 5.91663 18.1764 6.23324C18.0452 6.54985 17.853 6.83753 17.6107 7.07985L16.6452 8.04533C16.3035 8.38704 15.7495 8.38704 15.4078 8.04534L12.9547 5.59225C12.613 5.25054 12.613 4.69652 12.9547 4.35481L13.9201 3.38933ZM11.7172 6.82969C11.3755 6.48798 10.8215 6.48798 10.4798 6.82969L4.3845 12.925C3.8238 13.4857 3.42603 14.1882 3.23372 14.9575L2.65114 17.2878C2.5766 17.5859 2.66397 17.9014 2.8813 18.1187C3.09863 18.3361 3.41406 18.4234 3.71224 18.3488L6.04252 17.7663C6.81178 17.574 7.51432 17.1762 8.07501 16.6156L14.1703 10.5202C14.5121 10.1785 14.5121 9.62447 14.1703 9.28279L11.7172 6.82969Z" fill="currentColor" />
                                            <path clip-rule="evenodd" d="M10.5 17.5C10.5 17.0167 10.8917 16.625 11.375 16.625H17.5C17.9833 16.625 18.375 17.0167 18.375 17.5C18.375 17.9833 17.9833 18.375 17.5 18.375H11.375C10.8917 18.375 10.5 17.9833 10.5 17.5Z" fill="currentColor" />
                                        </svg>
                                    </button>
                                    <p>{descricaoUsuario}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={styles.recipiente_status_usuario}>

                        <div className={styles.historico_usuario}>
                            <div className={styles.celula_desde}>
                                <p>Desde:</p>
                                <p style={{ color: '#ABA9A1' }}>12 de Março de 2023</p>
                            </div>

                            <div className={styles.celula_ultimo_acesso}>
                                <p>Último Acesso:</p>
                                <div className={styles.status_usuario}>
                                    <div className={styles.status_icone}>
                                    </div>
                                    <p style={{ color: '#97CD61' }}>Online</p>
                                </div>
                            </div>

                            <div className={styles.celula_regiao}>
                                <p>Região</p>
                                <p style={{ color: '#ABA9A1' }}>Rio de Janeiro</p>
                            </div>
                        </div>

                        <div className={styles.sobre_usuario}>
                            <div className={styles.celula_sobre}>
                                <p>Sobre</p>
                            </div>
                            <div className={styles.celula_sobre_info}>
                                <p style={{ color: '#ABA9A1' }}>Este delícia jogou com você em alguma aventura que já não lembro.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}