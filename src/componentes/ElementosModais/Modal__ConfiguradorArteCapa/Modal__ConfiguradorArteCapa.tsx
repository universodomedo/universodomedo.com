'use client';

import styles from './styles.module.css';

import cn from 'classnames';

import { useContexto__Modal__ConfiguradorArteCapa } from '@/contextos/Contexto__Modal__ConfiguradorArteCapa/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from '@/componentes/Elementos/DivClicavel/DivClicavel';
import { RenderArquivoArteCapa } from '@/uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function Modal__ConfiguradorArteCapa({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }) {
    const { configArteCapa, idArteCapaSelecionada } = useContexto__Modal__ConfiguradorArteCapa();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: 'Configurando Capa de Aventura', subtitulo: configArteCapa.subtituloOperacao }} botaoAcaoPrincipal={{ texto: 'Atualizar', desabilitado: idArteCapaSelecionada === null, execucao: () => { console.log('xauu') } }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    const { listagemArtesCapa, idArteCapaSelecionada, selecionaArteCapa } = useContexto__Modal__ConfiguradorArteCapa();

    return (
        <ListagemComposta
            listagem={listagemArtesCapa}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            obterIdRegistro={arteCapa => arteCapa.id}
            renderizarItem={arteCapa => (
                <DivClicavel className={cn(styles.recipiente_item_imagem_arte_capa, arteCapa.id === idArteCapaSelecionada && styles.arte_capa_selecionada)} onClick={() => { selecionaArteCapa(arteCapa.id) }}>
                    <RenderArquivoArteCapa caminhoArquivoArte={arteCapa.dadosArteCapa.caminhoArquivoArteCapa} />
                </DivClicavel>
            )}
        />
    );
};