'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { Eventos_Emite, PAGINAS, SOCKET_AcessoUsuario, SOCKET_PresencaUsuario, type PaginaTemplate } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useEmitWsComDisparoInicial } from 'Hooks/useEventoWs';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';

// Mapa construído uma vez para lookup O(1) de label por template
const paginasLabelMap: Map<string, string> = (() => {
    const map = new Map<string, string>();
    function percorrer(obj: unknown) {
        if (!obj || typeof obj !== 'object') return;
        const rec = obj as Record<string, unknown>;
        if ('template' in rec && 'label' in rec && typeof rec.template === 'string' && typeof rec.label === 'string') {
            map.set(rec.template, rec.label);
        }
        for (const val of Object.values(rec)) percorrer(val);
    }
    percorrer(PAGINAS);
    return map;
})();

function obterLabelDaPagina(template: PaginaTemplate | null | undefined): string | null {
    if (!template) return null;
    return paginasLabelMap.get(template as string) ?? null;
}

export default function SecaoUsuariosExistentes() {
    const { usuarioLogado } = useContextoAutenticacao();

    const [listaAcessosUsuarios, setListaAcessosUsuarios] = useState<SOCKET_AcessoUsuario[]>([]);

    useEmitWsComDisparoInicial(Eventos_Emite.UsuariosConectados.eventos.emitirUsuariosConectadosAgora, data => {
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
        <div className={`${styles.recipiente_contato} ${!acessoUsuario.conectado ? styles.contato_desconectado : ''}`}>
            <div className={styles.recipiente_imagem_contato}>
                <AvatarUsuarioEmVisualizacao_CACHED idUsuario={acessoUsuario.usuario.id} />
            </div>
            <div className={styles.recipiente_informacoes_contato}>
                <h2>{acessoUsuario.usuario.username}</h2>
                <PresencasUsuario conectado={acessoUsuario.conectado} presencas={acessoUsuario.presencas} />
            </div>
        </div>
    );
};

function PresencasUsuario({ conectado, presencas }: { conectado: boolean; presencas: SOCKET_PresencaUsuario[] }) {
    if (!conectado) {
        return <span>Desconectado</span>;
    }

    if (presencas.length === 0) {
        return <span>Online</span>;
    }

    const principal = presencas[0];
    const extras = presencas.slice(1);
    const labelPrincipal = obterLabelDaPagina(principal.paginaAtual) ?? principal.paginaAtual ?? 'Online';

    if (extras.length === 0) {
        return <span>{labelPrincipal}</span>;
    }

    const tooltipExtras = extras
        .map(p => obterLabelDaPagina(p.paginaAtual) ?? p.paginaAtual ?? 'Online')
        .join('\n');

    return (
        <span title={tooltipExtras}>
            {labelPrincipal}{' '}
            <span>+{extras.length}</span>
        </span>
    );
}
