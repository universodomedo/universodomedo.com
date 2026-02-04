import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import SecaoPrincipal from 'Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/SecaoPrincipal/SecaoPrincipal';
import PaginaAterrissagem_CarrosselPrincipal from 'Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/PaginaAterrissagem_CarrosselPrincipal/PaginaAterrissagem_CarrosselPrincipal';
import PaginaAterrissagem_InformacoesJogo from 'Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/PaginaAterrissagem_InformacoesJogo/PaginaAterrissagem_InformacoesJogo';
import PaginaAterrissagem_DivisoriaSecoes from 'Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/PaginaAterrissagem_DivisoriaSecoes/PaginaAterrissagem_DivisoriaSecoes';
import PaginaAterrissagem_SecaoTags from 'Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/PaginaAterrissagem_SecaoTags/PaginaAterrissagem_SecaoTags';
import PaginaAterrissagem_SecaoTutorial from 'Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/PaginaAterrissagem_SecaoTutorial/PaginaAterrissagem_SecaoTutorial';
import PaginaAterrissagem_Rodape from 'Componentes/ElementosVisuais/PaginaAterrissagem/PaginaAterrissagem_Rodape/PaginaAterrissagem_Rodape';

export function PaginaAterrissagem_Client() {
  return (
    <ControladorSlot pagina={PAGINAS.home}>
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
      <PaginaAterrissagem_CarrosselPrincipal />
      <PaginaAterrissagem_InformacoesJogo />
      <PaginaAterrissagem_DivisoriaSecoes />
      <PaginaAterrissagem_SecaoTags />
      <PaginaAterrissagem_DivisoriaSecoes />
      <PaginaAterrissagem_SecaoTutorial />
      <PaginaAterrissagem_DivisoriaSecoes />
      <PaginaAterrissagem_Rodape />
    </>
  );
};