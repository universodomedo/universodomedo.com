import styles from './styles.module.css';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import SecaoPrincipal from "Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/SecaoPrincipal/SecaoPrincipal";
import Rodape from 'Componentes/ElementosVisuais/PaginaAterrissagem/Rodape/Rodape.tsx'

export default function PaginaAterrissagem() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.INICIO, comCabecalho: true, usuarioObrigatorio: false }}>
            <PaginaAterrissagem_Slot />
        </ControladorSlot>
    );
};

function PaginaAterrissagem_Slot() {
  return (
    <>
      <div id={styles.recipiente_conteudo_pagina_principal}>
        <SecaoPrincipal />
      </div>

      <Rodape />
    </>
  );
};