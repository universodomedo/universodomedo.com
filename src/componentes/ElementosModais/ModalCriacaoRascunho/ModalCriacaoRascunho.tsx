'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import InputComRotulo from 'Componentes/Elementos/InputComRotulo/InputComRotulo';
import { TipoRascunhoDto } from 'types-nora-api';
import { salvarRascunho } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export function ModalCriacaoRascunho({ isModalOpen, setIsModalOpen, tiposRascunhosParaEsseTipoGeral }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void, tiposRascunhosParaEsseTipoGeral: TipoRascunhoDto[] }) {
    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content title={'Criar Rascunho'}>
                <ConteudoModal tiposRascunhosParaEsseTipoGeral={tiposRascunhosParaEsseTipoGeral} />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal({ tiposRascunhosParaEsseTipoGeral }: { tiposRascunhosParaEsseTipoGeral: TipoRascunhoDto[] }) {
    const { usuarioLogado } = useContextoAutenticacao();
    const [titulo, setTitulo] = useState('');
    const [idTipoSelecionado, setIdTipoSelecionado] = useState<number>(0);

    async function atualizarAvatarUsuario() {
        // quando Sessão Única, pega o tipo de Sessão Única. Quando Aventura, direto Aventura
        const respostaCriacaoRascunho = await salvarRascunho(titulo, usuarioLogado!.id, tiposRascunhosParaEsseTipoGeral.length > 1 ? idTipoSelecionado : 1);

        if (!respostaCriacaoRascunho) {
            alert('Erro ao criar rascunho');
        } else {
            window.location.reload();
        }
    };

    return (
        <>
            <InputComRotulo rotulo={'Titulo'}>
                <input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} autoComplete={'off'} />
            </InputComRotulo>

            {tiposRascunhosParaEsseTipoGeral.length > 1 && (
                <InputComRotulo rotulo={'Tipo de Sessão'}>
                    <select value={idTipoSelecionado} onChange={(e) => setIdTipoSelecionado(Number(e.target.value))}>
                        <option value={0} disabled>Selecionar Tipo de Sessão</option>
                        {tiposRascunhosParaEsseTipoGeral.map(tipo => <option key={tipo.id} value={tipo.id}>{tipo.descricao}</option>)}
                    </select>
                </InputComRotulo>
            )}

            <button onClick={atualizarAvatarUsuario} disabled={tiposRascunhosParaEsseTipoGeral.length > 1 && idTipoSelecionado === 0}>Criar</button>
        </>
    );
};