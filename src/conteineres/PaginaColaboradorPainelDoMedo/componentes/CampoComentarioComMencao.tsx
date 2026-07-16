'use client';

import { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './CampoComentarioComMencao.module.css';

import { selectUsuarios } from 'Redux/selectors/usuariosSelectors';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';

type SugestaoUsuario = { tipo: 'usuario'; id: number; username: string };
type SugestaoCard = { tipo: 'card'; id: number; titulo: string };
type Sugestao = SugestaoUsuario | SugestaoCard;
export type CardMencionavel = { id: number; titulo: string };

// Composer de comentário com autocomplete de menção: "@" sugere usuários (cache global; por username ou id) e "#" sugere cards (por id ou título).
// Inserção produz os tokens que o backend/render resolvem: @username (ou @id p/ username não-mencionável) e #idDoCard.
export default function CampoComentarioComMencao({ valor, aoMudar, placeholder, desabilitado, cardsMencionaveis, aoColarImagens }: {
    valor: string;
    aoMudar: (valor: string) => void;
    placeholder?: string;
    desabilitado?: boolean;
    cardsMencionaveis?: readonly CardMencionavel[];
    // Evidencias: Ctrl+V de um print no composer entrega os arquivos de imagem colados (o texto colado segue o fluxo normal).
    aoColarImagens?: (arquivos: File[]) => void;
}) {
    const usuarios = useSelector(selectUsuarios);
    const areaRef = useRef<HTMLTextAreaElement | null>(null);
    const [busca, setBusca] = useState<{ tipo: 'usuario' | 'card'; termo: string } | null>(null);
    const [inicioToken, setInicioToken] = useState<number>(0);
    const [indiceAtivo, setIndiceAtivo] = useState<number>(0);

    const sugestoes = useMemo<Sugestao[]>(() => {
        if (busca === null) return [];
        const termo = busca.termo.toLowerCase();
        if (busca.tipo === 'usuario') {
            return (usuarios || [])
                .filter(usuario => usuario.username.toLowerCase().includes(termo) || String(usuario.id).startsWith(termo))
                .sort((a, b) => a.id - b.id)
                .slice(0, 6)
                .map(usuario => ({ tipo: 'usuario' as const, id: usuario.id, username: usuario.username }));
        }
        return (cardsMencionaveis ?? [])
            .filter(card => card.titulo.toLowerCase().includes(termo) || String(card.id).startsWith(termo))
            .slice()
            .sort((a, b) => a.id - b.id)
            .slice(0, 6)
            .map(card => ({ tipo: 'card' as const, id: card.id, titulo: card.titulo }));
    }, [usuarios, cardsMencionaveis, busca]);

    const detectaMencao = (texto: string, caret: number) => {
        const antesDoCaret = texto.slice(0, caret);
        const ocorrencia = antesDoCaret.match(/([@#])([\p{L}\p{N}_.\-]*)$/u);
        if (!ocorrencia) { setBusca(null); return; }
        setBusca({ tipo: ocorrencia[1] === '@' ? 'usuario' : 'card', termo: ocorrencia[2] });
        setInicioToken(caret - ocorrencia[0].length);
        setIndiceAtivo(0);
    };

    const aoDigitar = (texto: string) => {
        aoMudar(texto);
        const caret = areaRef.current?.selectionStart ?? texto.length;
        detectaMencao(texto, caret);
    };

    const insereMencao = (sugestao: Sugestao) => {
        // Username com espaço não sobrevive como token único de menção; nesse caso o id (também resolvido pelo backend) é o token. Card sempre referencia por #id.
        const token = sugestao.tipo === 'card' ? `#${sugestao.id} ` : /\s/.test(sugestao.username) ? `@${sugestao.id} ` : `@${sugestao.username} `;
        const caret = areaRef.current?.selectionStart ?? valor.length;
        const novoTexto = valor.slice(0, inicioToken) + token + valor.slice(caret);
        aoMudar(novoTexto);
        setBusca(null);
        const posicaoFinal = inicioToken + token.length;
        requestAnimationFrame(() => { areaRef.current?.focus(); areaRef.current?.setSelectionRange(posicaoFinal, posicaoFinal); });
    };

    const aoColar = (evento: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (!aoColarImagens) return;
        const arquivos = Array.from(evento.clipboardData.files).filter(arquivo => arquivo.type.startsWith('image/'));
        if (arquivos.length === 0) return;
        evento.preventDefault();
        aoColarImagens(arquivos);
    };

    const aoTeclar = (evento: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (busca === null || sugestoes.length === 0) return;
        if (evento.key === 'ArrowDown') { evento.preventDefault(); setIndiceAtivo(atual => (atual + 1) % sugestoes.length); }
        else if (evento.key === 'ArrowUp') { evento.preventDefault(); setIndiceAtivo(atual => (atual - 1 + sugestoes.length) % sugestoes.length); }
        else if (evento.key === 'Enter' || evento.key === 'Tab') { evento.preventDefault(); insereMencao(sugestoes[indiceAtivo]); }
        else if (evento.key === 'Escape') setBusca(null);
    };

    return (
        <div className={styles.recipiente}>
            <textarea ref={areaRef} value={valor} rows={2} placeholder={placeholder} disabled={desabilitado} onChange={evento => aoDigitar(evento.target.value)} onKeyDown={aoTeclar} onPaste={aoColar} onClick={evento => detectaMencao(valor, evento.currentTarget.selectionStart ?? 0)} onBlur={() => window.setTimeout(() => setBusca(null), 150)} />
            {busca !== null && sugestoes.length > 0 && (
                <div className={styles.sugestoes}>
                    {sugestoes.map((sugestao, indice) => (
                        <button key={`${sugestao.tipo}-${sugestao.id}`} className={`${styles.sugestao} ${indice === indiceAtivo ? styles.sugestaoAtiva : ''}`} onMouseDown={evento => { evento.preventDefault(); insereMencao(sugestao); }} onMouseEnter={() => setIndiceAtivo(indice)}>
                            {sugestao.tipo === 'usuario' ? (
                                <>
                                    <span className={styles.avatarSugestao}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={sugestao.id} /></span>
                                    <span className={styles.nomeSugestao}>{sugestao.username}</span>
                                </>
                            ) : (
                                <>
                                    <span className={styles.iconeCardSugestao}>▣</span>
                                    <span className={styles.nomeSugestao}>{sugestao.titulo}</span>
                                </>
                            )}
                            <span className={styles.idSugestao}>#{sugestao.id}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
