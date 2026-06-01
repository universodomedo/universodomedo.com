'use client';

import styles from './styles.module.css';

import cn from 'classnames';

import { useContexto__Modal__ConfiguradorAvatar } from '@/contextos/Contexto__Modal__ConfiguradorAvatar/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from '@/componentes/Elementos/DivClicavel/DivClicavel';
import { RenderArquivoAvatar } from '@/uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function Modal__ConfiguradorAvatar({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }) {
    const { idChaveNovoAvatarSelecionado, executaAtualizacaoAvatarSelecionado } = useContexto__Modal__ConfiguradorAvatar();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: 'Atualizar Avatar' }} botaoAcaoPrincipal={{ texto: 'Atualizar', desabilitado: idChaveNovoAvatarSelecionado === null, execucao: executaAtualizacaoAvatarSelecionado }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    const { listagemChavesAvatar, idChaveNovoAvatarSelecionado, selecionaAvatar } = useContexto__Modal__ConfiguradorAvatar();

    return (
        <ListagemComposta
            listagem={listagemChavesAvatar}
            modoExibicao={ListagemCompostaModoExibicao.GRADE}
            itensPorLinha={9}
            obterIdRegistro={chave => chave.id}
            renderizarItem={chave => (
                <DivClicavel className={cn(styles.recipiente_item_avatar, chave.id === idChaveNovoAvatarSelecionado && styles.avatar_selecionado)} onClick={() => { selecionaAvatar(chave.id); }}>
                    <RenderArquivoAvatar caminhoArquivoAvatar={chave.caminhoArquivo} />
                </DivClicavel>
            )}
        />
    );
};