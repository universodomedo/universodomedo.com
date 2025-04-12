import styles from './styles.module.css';
import { ControladorSlot } from 'Layouts/ControladorSlot';

import SecaoPrincipal from "Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/SecaoPrincipal/SecaoPrincipal";
import Rodape from 'Componentes/ElementosVisuais/PaginaAterrissagem/Rodape/Rodape.tsx'

export default function PaginaAterrissagem() {
  return (
    <ControladorSlot pageConfig={{ comCabecalho: true, usuarioObrigatorio: false }}>
      <div id={styles.recipiente_conteudo_pagina_principal}>
        <SecaoPrincipal />
      </div>

      <Rodape />
    </ControladorSlot>
  );
};