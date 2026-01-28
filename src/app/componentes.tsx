import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import SecaoPrincipal from 'Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/SecaoPrincipal/SecaoPrincipal';
import CarrosselHomepage from 'Componentes/Elementos/CarrosselHomepage/CarrosselHomepage';
import SecaoJogoHomepage from 'Componentes/Elementos/SecaoJogoHomepage/SecaoJogoHomepage';
import SecaoTags from 'Componentes/ElementosVisuais/PaginaAterrissagem/SecoesPaginaAterrissagem/SecaoTags/SecaoTags';
import DivisoriaSecoes from 'Componentes/ElementosVisuais/DivisoriaSecoes/DivisoriaSecoes';
import MissaoTutorial from 'Componentes/Elementos/MissaoTutorial/MissaoTutorial';
import Rodape from 'Componentes/ElementosVisuais/PaginaAterrissagem/Rodape/Rodape.tsx';

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
      <CarrosselHomepage />
      <SecaoJogoHomepage />
      <DivisoriaSecoes />
      <SecaoTags />
      <DivisoriaSecoes />
      <MissaoTutorial />
      <DivisoriaSecoes />
      <Rodape />
    </>
  );
};