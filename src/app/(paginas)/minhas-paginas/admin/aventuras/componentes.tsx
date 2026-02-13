'use client';

import styles from './styles.module.css';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaAdminAventurasProvider, useContextoPaginaAdminAventuras } from 'Contextos/ContextoPaginaAdminAventuras/contexto';
import { AventuraEmLayoutContextualizado } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AventuraEmLayoutContextualizado/page';

export function AdministrarAventuras_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.aventuras}>
            <ContextoPaginaAdminAventurasProvider>
                <AdministrarAventuras_ConteudoGeral />
            </ContextoPaginaAdminAventurasProvider>
        </ControladorSlot>
    );
};

function AdministrarAventuras_ConteudoGeral() {
    const { gruposAventuras } = useContextoPaginaAdminAventuras();

    return (
        <div id={styles.recipiente_aventuras_admin}>
            {gruposAventuras?.sort((a, b) => b.id - a.id).map(grupoAventura => <AventuraEmLayoutContextualizado key={grupoAventura.id} grupoAventura={grupoAventura} destino={{ pagina: PAGINAS.minhasPaginas.admin.aventura, params: { id: grupoAventura.id } }} />)}
        </div>
    );
};