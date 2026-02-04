'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_Emite, SOCKET_AcessoUsuario } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';


export default function SecaoContatos() {
    const { usuarioLogado } = useContextoAutenticacao();
    
    const [listaAcessosUsuarios, setListaAcessosUsuarios] = useState<SOCKET_AcessoUsuario[]>([]);

    // console.log(`[CONTATOS] ${new Date().toISOString()} antes emitirUsuariosConectadosAgora`);
    useEmitWsComDisparoInicial(Eventos_Emite.UsuariosConectados.eventos.emitirUsuariosConectadosAgora, data => {
        // console.log(`[CONTATOS] ${new Date().toISOString()} dentro emitirUsuariosConectadosAgora`, data);
        setListaAcessosUsuarios(data.usuariosConectados.filter(acesso => acesso.usuario.id !== usuarioLogado?.id));
    });

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
                        <span>{acessoUsuario.paginaAtual}</span>
                    ) : (
                        <span>Desconectado</span>
                    )}
                </div>
            </div>
        </div>
    );
};