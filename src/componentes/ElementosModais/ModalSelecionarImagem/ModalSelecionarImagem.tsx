'use client';

import Modal, { CabecalhoModalProps } from 'Componentes/Elementos/Modal/Modal.tsx';
import { ContextoListagemSelecaoImagemProvider, useContextoListagemSelecaoImagem } from 'Contextos/ContextoListagemSelecaoImagem/contexto';
import ListagemSelecaoImagem from 'Componentes/Elementos/Listagens/ListagemSelecaoImagem/ListagemSelecaoImagem';

export default function ModalSelecionarImagem({ isModalOpen, setIsModalOpen, cabecalho, callbackSelecionaArquivo }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; cabecalho: CabecalhoModalProps, callbackSelecionaArquivo: (idArquivoSelecionado: number) => void }) {
    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <ContextoListagemSelecaoImagemProvider>
                <ModalSelecionarImagem_Contexto cabecalho={cabecalho} callbackSelecionaArquivo={callbackSelecionaArquivo} />
            </ContextoListagemSelecaoImagemProvider>
        </Modal>
    );
};

function ModalSelecionarImagem_Contexto({ cabecalho, callbackSelecionaArquivo }: { cabecalho: CabecalhoModalProps, callbackSelecionaArquivo: (idArquivoSelecionado: number) => void }) {
    const { idArquivoSelecionado, podeSalvar } = useContextoListagemSelecaoImagem();

    return (
        <Modal.Content cabecalho={cabecalho} botaoAcaoPrincipal={{ execucao: () => { if (!idArquivoSelecionado) return; callbackSelecionaArquivo(idArquivoSelecionado) }, desabilitado: !podeSalvar, texto: 'Selecionar Capa' }}>
            <ListagemSelecaoImagem />
        </Modal.Content>
    );
};