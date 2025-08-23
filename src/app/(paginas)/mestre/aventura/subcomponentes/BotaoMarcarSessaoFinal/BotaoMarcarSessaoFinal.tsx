'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import { encerraGrupoAventura } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export function BotaoMarcarSessaoFinal() {
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    const [isModalMarcaFimOpen, setIsModalMarcaFimOpen] = useState(false);
    const openModalMarcaFim = () => setIsModalMarcaFimOpen(true);

    return (
        <>
            <button disabled={grupoAventuraSelecionada.sessaoFinal !== null} onClick={openModalMarcaFim}>Marcar Episódio como Final</button>

            <Modal open={isModalMarcaFimOpen} onOpenChange={setIsModalMarcaFimOpen}>
                <Modal.Content title={'Marcar Sessão como Final da Aventura'}>
                    <ConteudoModalMarcaFimAventura />
                </Modal.Content>
            </Modal>
        </>
    );
};

function ConteudoModalMarcaFimAventura() {
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    const executaMarcarSessaoComoUltimaDeGrupoAventura = async () => {
        await encerraGrupoAventura(grupoAventuraSelecionada.id);
        window.location.reload();
    }

    return (
        <div id={styles.recipiente_modal_marcar_sessao_como_final}>
            <button onClick={() => executaMarcarSessaoComoUltimaDeGrupoAventura()}>Marcar Sessão como Ultima da Aventura</button>
        </div>
    );
};