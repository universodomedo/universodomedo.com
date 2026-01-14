'use client';

import styles from './styles.module.css';

import { ReactNode, useState } from 'react';

import { useContextoRascunhosMestre } from "Contextos/ContextoRascunhosMestre/contexto";
import LayoutContextualizado from "Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado";
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import DetalhesRascunho from "./DetalhesRascunho";
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { ModalCriacaoRascunho } from 'Componentes/ElementosModais/ModalCriacaoRascunho/ModalCriacaoRascunho';
import RascunhoEmVisualizacao from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/RascunhoEmVisualizacao/page';
import { ContextoCriaRascunhoProvider } from 'Contextos/ContextoCriaRascunho/contexto';
import { MENUS_INTERNOS } from 'types-nora-api';

export function RascunhosMestre_Contexto() {
    const { tituloComponenteConteudo, idRascunhoSelecionado } = useContextoRascunhosMestre();

    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <RascunhosMestre_Contexto_EmbrulhoProvisorio>
                    {!idRascunhoSelecionado ? <ListagemRascunhos_Contexto /> : <DetalhesRascunho idRascunhoSelecionado={idRascunhoSelecionado} />}
                </RascunhosMestre_Contexto_EmbrulhoProvisorio>
            </LayoutContextualizado.Conteudo>

            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.mestre} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function RascunhosMestre_Contexto_EmbrulhoProvisorio({ children }: { children: ReactNode }) {
    const { tituloComponenteConteudo } = useContextoRascunhosMestre();

    useConfigurarLayoutContextualizado({ proporcaoConteudo: 84, titulo:tituloComponenteConteudo ?? undefined });

    return (
        <>
            {children}
        </>
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