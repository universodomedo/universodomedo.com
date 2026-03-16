'use client';

import styles from './styles.module.css';

import { AventuraParaAssistirDto, AventuraEstado } from "types-nora-api";

import { useContextoMenuAssistir } from "Contextos/ContextoMenuAssistir/contexto";
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { useContextoPaginaAssistir } from 'Contextos/ContextoPaginaAssistir/contexto';

export default function SPA__MenuAssistir__MenuInicial() {
    const { aventuras } = useContextoMenuAssistir();

    const aventurarEmAndamento = aventuras.filter(aventura => aventura.estadoAtual === AventuraEstado.EM_ANDAMENTO);
    const aventurarFinalizadas = aventuras.filter(aventura => aventura.estadoAtual === AventuraEstado.FINALIZADA);

    return (
        <div className={styles.recipiente_lista_aventuras}>
            {aventurarEmAndamento.sort((a, b) => a.id - b.id).map((aventura, index) => <ItemAventuraLista key={index} aventura={aventura} />)}
            {(aventurarEmAndamento.length > 0 && aventurarFinalizadas.length > 0) && (<hr />)}
            {aventurarFinalizadas.sort((a, b) => new Date(b.dataFimAventura ?? 0).getTime() - new Date(a.dataFimAventura ?? 0).getTime()).map((aventura, index) => <ItemAventuraLista key={index} aventura={aventura} />)}
        </div>
    );
};


export function ItemAventuraLista({ aventura }: { aventura: AventuraParaAssistirDto }) {
    const { buscaAventuraSelecionada, aventuraSelecionada } = useContextoPaginaAssistir();

    return (
        <DivClicavel className={styles.recipiente_item_menu_aventuras} classeParaDesabilitado={styles.ativo} desabilitado={aventura.id === aventuraSelecionada?.id} onClick={() => { buscaAventuraSelecionada(aventura.id); }}>
            <div className={styles.recipiente_imagem_aventura_item_menu}>
                <RecipienteImagem src={aventura.imagemCapa?.fullPath} />
            </div>
            <div className={styles.recipiente_dados_aventura}>
                <h3 className={styles.recipiente_dados_aventura_titulo}>{aventura.titulo}</h3>
                <h3 className={styles.recipiente_dados_aventura_estado}>{aventura.estadoAtual}</h3>
            </div>
        </DivClicavel>
    );
};