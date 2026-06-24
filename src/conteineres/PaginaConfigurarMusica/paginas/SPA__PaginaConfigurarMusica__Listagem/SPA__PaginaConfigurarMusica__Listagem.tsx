'use client';

import styles from './styles.module.css';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { type Contexto__PaginaConfigurarMusica__Props } from 'Contextos/Contexto__PaginaConfigurarMusica/contexto';

type Props = { listagemMusicas: Contexto__PaginaConfigurarMusica__Props['listagemMusicas']; selecionar: Contexto__PaginaConfigurarMusica__Props['selecionar']; };
type MusicaRegistro = Contexto__PaginaConfigurarMusica__Props['listagemMusicas']['registros'][number];

export default function SPA__PaginaConfigurarMusica__Listagem({ listagemMusicas, selecionar }: Props) {
    useConfigurarLayoutContextualizado({ subtitulo: null, fecharProps: undefined });

    return (
        <ListagemComposta
            listagem={listagemMusicas}
            modoExibicao={ListagemCompostaModoExibicao.LINHA}
            obterIdRegistro={musica => musica.id}
            renderizarItem={musica => <LinhaMusica musica={musica} aoSelecionar={() => selecionar(musica.id)} />}
        />
    );
};

function LinhaMusica({ musica, aoSelecionar }: { musica: MusicaRegistro; aoSelecionar: () => void; }) {
    return (
        <button type="button" className={styles.linha} onClick={aoSelecionar}>
            <span className={styles.info}>
                <span className={styles.nome}>{musica.nomeMusica}</span>
                <span className={styles.fonte}>· {musica.nomeFonte}</span>
            </span>
            <span className={musica.configurada ? styles.tagConfigurada : styles.tagPendente}>{musica.configurada ? 'CONFIGURADA' : 'PENDENTE'}</span>
        </button>
    );
};
