'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import LayoutContextualizado from "Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado";
import ListaAcoesMestre from "Componentes/ElementosDeMenu/ListaAcoesMestre/page";
import { useContextoRascunhosMestre } from "Contextos/ContextoRascunhosMestre/contexto";
import DetalhesRascunho from "./DetalhesRascunho";
import { ModalCriacaoRascunho } from 'Componentes/ElementosModais/ModalCriacaoRascunho/ModalCriacaoRascunho';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import RascunhoEmVisualizacao from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/RascunhoEmVisualizacao/page';
import { ContextoCriaRascunhoProvider } from 'Contextos/ContextoCriaRascunho/contexto';

export function RascunhosMestre_Contexto() {
    const { tituloComponenteConteudo, idRascunhoSelecionado } = useContextoRascunhosMestre();

    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo titulo={tituloComponenteConteudo ?? undefined}>
                {!idRascunhoSelecionado ? <ListagemRascunhos_Contexto /> : <DetalhesRascunho idRascunhoSelecionado={idRascunhoSelecionado} />}
            </LayoutContextualizado.Conteudo>

            <LayoutContextualizado.Menu>
                <ListaAcoesMestre />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function ListagemRascunhos_Contexto() {
    const { rascunhos } = useContextoRascunhosMestre();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div id={styles.recipiente_area_rascunhos}>
            <DivClicavel id={styles.botao_novo_rascunho} onClick={() => setIsModalOpen(true)}>
                <h3>Novo Rascunho</h3>
            </DivClicavel>

            <ContextoCriaRascunhoProvider>
                <ModalCriacaoRascunho isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </ContextoCriaRascunhoProvider>

            <div id={styles.recipiente_rascunhos}>
                {rascunhos.length > 0 ? (
                    rascunhos.map(rascunho => <RascunhoEmVisualizacao key={rascunho.id} rascunho={rascunho} />)
                ) : (
                    <h3>Nenhum Rascunho encontrado</h3>
                )}
            </div>
        </div>
    );
};