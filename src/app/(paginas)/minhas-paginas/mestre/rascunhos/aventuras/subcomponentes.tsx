'use client';

import styles from '../styles.module.css';
import { useState } from 'react';

import { useContextoMestreRascunhosAventuras } from 'Contextos/ContextoMestreRascunhosAventuras/contexto';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { ModalCriacaoRascunho } from 'Componentes/ElementosModais/ModalCriacaoRascunho/ModalCriacaoRascunho';
import RascunhoEmVisualizacao from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/RascunhoEmVisualizacao/page';

export function RascunhoAventuraMestre_Conteudo() {
    const { tiposRascunhosParaEsseTipoGeral } = useContextoMestreRascunhosAventuras();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div id={styles.recipiente_area_rascunhos}>
            <DivClicavel id={styles.botao_novo_rascunho} onClick={() => setIsModalOpen(true)}>
                <h3>Novo Rascunho</h3>
            </DivClicavel>

            <ModalCriacaoRascunho isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} tiposRascunhosParaEsseTipoGeral={tiposRascunhosParaEsseTipoGeral} />

            <ListaRascunhos />
        </div>
    );
};

function ListaRascunhos() {
    const { rascunhosAventura } = useContextoMestreRascunhosAventuras();

    return (
        <div id={styles.recipiente_rascunhos}>
            {rascunhosAventura.length > 0 ? (
                rascunhosAventura.map(rascunho => <RascunhoEmVisualizacao key={rascunho.id} rascunho={rascunho} />)
            ) : (
                <h3>Nenhum Rascunho encontrado</h3>
            )}
        </div>
    );
};