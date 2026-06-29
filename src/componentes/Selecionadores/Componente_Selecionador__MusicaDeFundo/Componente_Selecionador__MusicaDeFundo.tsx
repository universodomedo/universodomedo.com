'use client';

import styles from './styles.module.css';

import { useRef, useState } from 'react';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { Componente_Selecionador } from 'Componentes/Selecionadores/Componente_Selecionador/Componente_Selecionador';
import { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';

// Seletor de Música de Fundo — instância do Componente_Selecionador com fonte GraphQL MusicaConfigurada (SÓ música já configurada no mixer; o id já é o tocável) + preview de áudio. Devolve { idMusicaConfigurada, nome } via aoConfirmar.
export function Componente_Selecionador__MusicaDeFundo({ aoConfirmar, idInicial = null }: { aoConfirmar: (idMusicaConfigurada: number, nome: string) => void | Promise<void>; idInicial?: number | null; }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [tocandoId, setTocandoId] = useState<number | null>(null);

    const listagem = useNoraGraphQLListagem('MusicaConfigurada', {
        select: ['id', 'nome', { arquivo: ['caminhoArquivo'] }, { fonteMusica: ['nome'] }],
        itensPorPagina: 12,
        carregando: 'Buscando Músicas',
        mensagemErro: 'Houve um erro recuperando as Músicas',
        mensagemListaVazia: 'Nenhuma música configurada encontrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma música encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'DESC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });

    function alternaPreview(id: number, url: string): void {
        if (!audioRef.current) audioRef.current = new Audio();
        const audio = audioRef.current;
        if (tocandoId === id) { audio.pause(); setTocandoId(null); return; }
        audio.src = url;
        audio.onended = () => setTocandoId(null);
        audio.play().then(() => setTocandoId(id)).catch(() => { });
    };

    return (
        <Componente_Selecionador
            listagem={listagem}
            obterIdRegistro={musica => musica.id}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            renderizarItem={musica => (
                <div className={styles.item_musica}>
                    <button type="button" className={styles.botao_preview} onClick={evento => { evento.stopPropagation(); alternaPreview(musica.id, getImageUrl(musica.arquivo.caminhoArquivo)); }} aria-label={tocandoId === musica.id ? 'Pausar' : 'Ouvir'}>
                        {tocandoId === musica.id ? '❚❚' : '▶'}
                    </button>
                    <div className={styles.info}>
                        <strong className={styles.nome}>{musica.nome}</strong>
                        <span className={styles.fonte}>{musica.fonteMusica.nome}</span>
                    </div>
                </div>
            )}
            aoConfirmar={musica => aoConfirmar(musica.id, musica.nome)}
            idInicial={idInicial}
            titulo="Escolher Música de Fundo"
            subtitulo="Selecione uma música e confirme. Clique ▶ para ouvir."
            textoConfirmar="Usar esta música"
        />
    );
};
