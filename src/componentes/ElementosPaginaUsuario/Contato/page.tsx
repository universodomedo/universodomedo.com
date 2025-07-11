'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import { SOCKET_AcessoUsuario, SOCKET_EVENTOS } from 'types-nora-api';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

import { useSocketEvent } from 'Hooks/useSocketEvent';
import { useSocketEmit } from 'Hooks/useSocketEmit';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export default function SecaoContatos() {
    const { usuarioLogado } = useContextoAutenticacao();
    
    const [listaAcessosUsuarios, setListaAcessosUsuarios] = useState<SOCKET_AcessoUsuario[]>([]);

    useSocketEvent(SOCKET_EVENTOS.AcessosUsuarios.receber, (dados: SOCKET_AcessoUsuario[]) => {
        setListaAcessosUsuarios(dados.filter(acesso => acesso.usuario.id !== usuarioLogado?.id));
    });

    useSocketEmit(SOCKET_EVENTOS.AcessosUsuarios.obter);

    const { scrollableProps } = useScrollable();

    return (
        <div id={styles.portal_usuario_direita} {...scrollableProps}>
            <div className={styles.secao_contatos}>
                <div className={styles.recipiente_lista_contatos}>
                    {listaAcessosUsuarios.map(acessoUsuario => (
                        <Contato key={acessoUsuario.usuario.id} acessoUsuario={acessoUsuario} />
                    ))}
                </div>
            </div>
        </div>
    );
};

function Contato({ acessoUsuario }: { acessoUsuario: SOCKET_AcessoUsuario }) {
    return (
        <div className={`${styles.recipiente_contato} ${!acessoUsuario.paginaAtual ? styles.contato_desconectado : ''}`}>
            <div className={styles.recipiente_imagem_contato}>
                <RecipienteImagem src={acessoUsuario.usuario.customizacao.caminhoAvatar} />
            </div>
            <div className={styles.recipiente_informacoes_contato}>
                <h2>{acessoUsuario.usuario.username}</h2>
                <div className={styles.recipiente_cargos}>
                    {acessoUsuario.usuario.listaCargos.cargos.map((cargo, index) => (
                        <span key={index}>{cargo}</span>
                    ))}
                </div>
                <div>
                    {acessoUsuario.paginaAtual ? (
                        <span>{acessoUsuario.paginaAtual.nome}</span>
                    ) : (
                        <span>Desconectado</span>
                    )}
                </div>
            </div>
        </div>
    );
};