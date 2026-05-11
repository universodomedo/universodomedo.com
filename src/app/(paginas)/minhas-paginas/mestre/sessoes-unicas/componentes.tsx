'use client';

import styles from './styles.module.css';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoPaginaMestreSessoesUnicasProvider, useContextoPaginaMestreSessoesUnicas } from 'Contextos/ContextoPaginaMestreSessoesUnicas/contexto';
// import RecipienteAventuraOuSessao__ItemListagem from 'Componentes/ElementosVisuais/RecipienteAventuraOuSessao__ItemListagem/RecipienteAventuraOuSessao__ItemListagem';

export function PaginaMestreSessoesUnicas_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.sessoesUnicas}>
            <ContextoPaginaMestreSessoesUnicasProvider>
                <PaginaMestreSessoesUnicas_Contexto />
            </ContextoPaginaMestreSessoesUnicasProvider>
        </ControladorSlot>
    );
};

function PaginaMestreSessoesUnicas_Contexto() {
    const { sessoesUnicas } = useContextoPaginaMestreSessoesUnicas();

    return (
        <div className={styles.recipiente_listagem_sessoes_unicas}>
            {/* {sessoesUnicas.map(sessao => (
                <RecipienteAventuraOuSessao__ItemListagem
                    key={sessao.id}
                    destino={{ pagina: PAGINAS.minhasPaginas.mestre.sessao, params: { id: sessao.id } }}
                    imagem={sessao.imagemCapa.caminhoCapa}
                    detalhePrincipal={sessao.detalheSessaoUnica.rascunho?.titulo}
                    detalheSecundario={sessao.estadoAtual}
                />
            ))} */}
        </div>
    );
};