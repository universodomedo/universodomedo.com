'use client';

import styles from '../styles.module.css';

import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { encerraGrupoAventura } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export function PaginaMestreAventura_Slot() {
    return (
        <CabecalhoMestreAventura />
    );
};

function CabecalhoMestreAventura() {
    const { aventuraSelecionada } = useContextoPaginaMestreAventura();

    const executaEncerraGrupoAventura = async () => {
        await encerraGrupoAventura(aventuraSelecionada.gruposAventura![0].id);
        window.location.reload();
    }

    return (
        <SecaoDeConteudo className={styles.recipiente_cabecalho_pagina_aventura_mestre}>
            <div id={styles.recipiente_imagem_capa_pagina_aventura_mestre}>
                <RecipienteImagem src={aventuraSelecionada.imagemCapa?.fullPath} />
            </div>
            <div id={styles.recipiente_dados_pagina_aventura_mestre}>
                <button onClick={executaEncerraGrupoAventura}>Encerrar Aventura</button>
            </div>
        </SecaoDeConteudo>
    );
};