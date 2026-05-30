'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_Emite, PAGINAS, SOCKET_AcessoUsuario, type PaginaTemplate } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

function obterLabelDaPagina(template: PaginaTemplate | null | undefined): string | null {
    if (!template) return null;
    function buscar(obj: unknown): string | null {
        if (!obj || typeof obj !== 'object') return null;
        const rec = obj as Record<string, unknown>;
        if ('template' in rec && rec.template === template && typeof rec.label === 'string') return rec.label;
        for (const val of Object.values(rec)) {
            const found = buscar(val);
            if (found) return found;
        }
        return null;
    }
    return buscar(PAGINAS);
}

export default function SecaoUsuariosExistentes() {
    const { usuarioLogado } = useContextoAutenticacao();

    const [listaAcessosUsuarios, setListaAcessosUsuarios] = useState<SOCKET_AcessoUsuario[]>([]);

    // console.log(`[CONTATOS] ${new Date().toISOString()} antes emitirUsuariosConectadosAgora`);
    useEmitWsComDisparoInicial(Eventos_Emite.UsuariosConectados.eventos.emitirUsuariosConectadosAgora, data => {
        console.log('[DBG SecaoUsuariosExistentes] recebeu emitirUsuariosConectadosAgora', data.usuariosConectados.length, 'usuários:', data.usuariosConectados.map(a => `${a.usuario.username}(${a.paginaAtual ?? 'offline'})`));
        setListaAcessosUsuarios(data.usuariosConectados.filter(acesso => acesso.usuario.id !== usuarioLogado?.id));
    });

    const { scrollableProps } = useScrollable();

    return (
        <div className={styles.portal_usuario_direita} {...scrollableProps}>
            <div className={styles.secao_contatos}>
                <div className={styles.recipiente_lista_contatos}>
                    {listaAcessosUsuarios.map(acessoUsuario => (
                        <UsuarioExistente key={acessoUsuario.usuario.id} acessoUsuario={acessoUsuario} />
                    ))}
                </div>
            </div>
        </div>
    );
};

function UsuarioExistente({ acessoUsuario }: { acessoUsuario: SOCKET_AcessoUsuario }) {
    return (
        <div className={`${styles.recipiente_contato} ${!acessoUsuario.paginaAtual ? styles.contato_desconectado : ''}`}>
            <div className={styles.recipiente_imagem_contato}>
                <RenderArquivoAvatar caminhoArquivoAvatar={acessoUsuario.usuario.customizacao.caminhoArquivoAvatar} />
            </div>
            <div className={styles.recipiente_informacoes_contato}>
                <h2>{acessoUsuario.usuario.username}</h2>
                {/* <div className={styles.recipiente_cargos}>
                    {acessoUsuario.usuario.listaCargos.cargos.map((cargo, index) => (
                        <span key={index}>{cargo}</span>
                    ))}
                </div> */}
                <div>
                    {acessoUsuario.paginaAtual ? (
                        <span>{obterLabelDaPagina(acessoUsuario.paginaAtual) ?? acessoUsuario.paginaAtual}</span>
                    ) : (
                        <span>Desconectado</span>
                    )}
                </div>
            </div>
        </div>
    );
};
