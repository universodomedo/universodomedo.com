import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaGameDesignerDesafios__Tipos } from 'Contextos/Contexto__PaginaGameDesignerDesafios__Tipos/contexto';
import type { GrupoTipoDesafio, TipoDesafio } from 'types-nora-api';

export default function SPA__PaginaGameDesignerDesafios__Tipos() {
    const { listagemTipos, selecionaTipo } = useContexto__PaginaGameDesignerDesafios__Tipos();

    return (
        <ListagemComposta
            listagem={listagemTipos}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={3}
            obterIdRegistro={grupo => grupo.tipo}
            renderizarItem={grupo => <CardTipo grupo={grupo} aoSelecionar={selecionaTipo} />}
        />
    );
};

function CardTipo({ grupo, aoSelecionar }: { grupo: GrupoTipoDesafio; aoSelecionar: (tipo: TipoDesafio) => void; }) {
    return (
        <button type="button" className={styles.card_tipo} onClick={() => aoSelecionar(grupo.tipo)}>
            <strong className={styles.rotulo}>{grupo.rotulo} <span className={styles.selo}>{grupo.rotativo ? 'Rotativo' : 'Fixo'}</span></strong>
            <span className={styles.contagem}>{grupo.desafios.length} desafios</span>
        </button>
    );
};