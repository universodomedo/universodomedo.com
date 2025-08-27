'use client';

import styles from './styles.module.css';
import { useState } from 'react';
import { EstadoSessao } from 'types-nora-api';

import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import { encerrarSessaoEmAndamentoDeGrupoAventura } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export function BotaoFinalizarSessao() {
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    const [isModalFinalizaOpen, setIsModalFinalizaOpen] = useState(false);
    const openModalFinaliza = () => setIsModalFinalizaOpen(true);

    return (
        <>
            <button disabled={grupoAventuraSelecionada.sessaoMaisRecente?.estadoAtual !== EstadoSessao.EM_ANDAMENTO} onClick={openModalFinaliza}>Finalizar Sessão em Aberto</button>

            <Modal open={isModalFinalizaOpen} onOpenChange={setIsModalFinalizaOpen}>
                <Modal.Content title={'Encerrar Sessão em Aberto'}>
                    <ConteudoModalEncerraSessao />
                </Modal.Content>
            </Modal>
        </>
    );
};

function ConteudoModalEncerraSessao() {
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    const executaEncerrarSessaoEmAndamentoDeGrupoAventura = async () => {
        await encerrarSessaoEmAndamentoDeGrupoAventura(grupoAventuraSelecionada.id);
        window.location.reload();
    }

    return (
        <div id={styles.recipiente_modal_encerramento_de_sessao_em_aberto}>
            <button onClick={() => executaEncerrarSessaoEmAndamentoDeGrupoAventura()}>Encerrar</button>
        </div>
    );
};