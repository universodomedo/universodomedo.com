'use client';

import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaMestreAventuras__SemAventuraSelecionada } from 'Contextos/Contexto__PaginaMestreAventuras__SemAventuraSelecionada/contexto';
import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function SPA__PaginaMestreAventuras__SemAventuraSelecionada() {
    const { listagemGruposAventuras } = useContexto__PaginaMestreAventuras__SemAventuraSelecionada();

    return (
        <ListagemComposta
            listagem={listagemGruposAventuras}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            obterIdRegistro={grupoAventura => grupoAventura.id}
            renderizarItem={grupoAventura => (
                <div className={styles.recipiente_item_imagem_aventura_mestre}>
                    <RenderArquivoArteCapa caminhoArquivoArte={grupoAventura.dadosArteCapa.caminhoArquivoArteCapa} />
                </div>
            )}
        />
    );
};