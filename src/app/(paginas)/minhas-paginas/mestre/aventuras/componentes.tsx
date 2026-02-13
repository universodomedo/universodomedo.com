'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoMestreAventurasProvider } from "Contextos/ContextoMestreAventuras/contexto";
import { useContextoMestreAventuras } from 'Contextos/ContextoMestreAventuras/contexto';
import { AventuraEmLayoutContextualizado } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AventuraEmLayoutContextualizado/page';

export function AventurasMestre_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.aventuras}>
            <ContextoMestreAventurasProvider>
                <AventurasMestre_Slot />
            </ContextoMestreAventurasProvider>
        </ControladorSlot>
    );
};

function AventurasMestre_Slot() {
    const { gruposAventurasListadas } = useContextoMestreAventuras();

    return (
        <div id={styles.recipiente_aventuras_mestre}>
            {gruposAventurasListadas!.map(grupoAventura => <AventuraEmLayoutContextualizado key={grupoAventura.id} grupoAventura={grupoAventura} destino={{ pagina: PAGINAS.minhasPaginas.mestre.aventura, params: { id: grupoAventura.id } }} />)}
        </div>
    );
};