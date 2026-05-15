'use client';

import styles from './styles.module.css';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { useContexto__PaginaMestreAventuras__SemAventuraSelecionada } from 'Contextos/Contexto__PaginaMestreAventuras__SemAventuraSelecionada/contexto';
import { DivClicavel } from '@/componentes/Elementos/DivClicavel/DivClicavel';
import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function SPA__PaginaMestreAventuras__SemAventuraSelecionada() {
    const { gruposAventuras, selecionaGrupoAventura } = useContexto__PaginaMestreAventuras__SemAventuraSelecionada();

    return (
        <ListagemComposta
            listagem={gruposAventuras}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={4}
            obterIdRegistro={grupoAventura => grupoAventura.id}
            renderizarItem={grupoAventura => (
                <DivClicavel className={styles.recipiente_item_imagem_aventura_mestre} onClick={() => { selecionaGrupoAventura(grupoAventura.id) }} title={grupoAventura.nomeUnicoGrupoAventura}>
                    <RenderArquivoArteCapa caminhoArquivoArte={grupoAventura.dadosArteCapa.caminhoArquivoArteCapa} />
                </DivClicavel>
            )}
        />
    );
};