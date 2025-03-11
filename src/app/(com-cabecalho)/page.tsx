import styles from './styles.module.css';

import SecaoPrincipal from "Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/SecaoPrincipal/SecaoPrincipal";
import Rodape from 'Componentes/ElementosVisuais/PaginaAterrissagem/Rodape/Rodape.tsx'

export default function Pagina() {
  return (
    <>
      <div id={styles.recipiente_conteudo_pagina_principal}>
        <h1>CAIO</h1>
        <SecaoPrincipal />
      </div>

      <Rodape />
    </>
  );
};