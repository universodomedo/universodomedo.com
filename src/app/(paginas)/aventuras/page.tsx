import styles from './styles.module.css';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { obtemTodasAventuras } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { SecaoBarraDeBuscaDeAventuras, SecaoCorpoAventuras } from './page-dados';

import { ContextoPaginaAventuraProvider } from 'Contextos/ContextoPaginaAventura/contexto.tsx';

export default function PaginaAventuras() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoPaginaAventuraProvider>
                <PaginaAventuras_Slot/>
            </ContextoPaginaAventuraProvider>
        </ControladorSlot>
    );
};

async function PaginaAventuras_Slot() {
    // passar os dados de todas as aventuras para um contexto
    // passar os componentes da pagina aventura para pasta de componentes
    const respostaDadosPaginaAventuras = await obtemTodasAventuras();

    if (!respostaDadosPaginaAventuras) return <div>Erro ao carregar aventuras</div>;

    return (
        <div id={styles.recipiente_pagina_aventuras}>
            <SecaoBarraDeBuscaDeAventuras />
            <SecaoCorpoAventuras dadosAventuras={respostaDadosPaginaAventuras} />
        </div>
    );
};