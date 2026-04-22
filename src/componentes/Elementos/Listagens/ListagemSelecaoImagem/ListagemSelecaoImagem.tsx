'use client';

import styles from './styles.module.css';

import cn from 'classnames';

import { useContextoListagemSelecaoImagem } from 'Contextos/ContextoListagemSelecaoImagem/contexto';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { RenderArquivoGENERICO } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function ListagemSelecaoImagem() {
    const { arquivos, idArquivoSelecionado, setIdArquivoSelecionado } = useContextoListagemSelecaoImagem();

    return (
        <div className={styles.recipiente_listagem_imagens_especiais}>
            {arquivos.map(arquivo => (
                <DivClicavel key={arquivo.id} className={cn(styles.recipiente_item_imagem, arquivo.id === idArquivoSelecionado && styles.arquivo_selecionado)} onClick={() => { setIdArquivoSelecionado(arquivo.id) }} >
                    <RenderArquivoGENERICO caminhoArquivoGENERICO={arquivo.caminhoArquivo} />
                </DivClicavel>
            ))}
        </div>
    );
};