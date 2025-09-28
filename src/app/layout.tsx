import './globals.css';
import styles from './styles.module.css';

import { ReactNode } from "react";

import { ContextoMenuSwiperEsquerdaProvider } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
import MenuSwiperEsquerda from 'Componentes/Elementos/MenuSwiperEsquerda/MenuSwiperEsquerda';
import ContainerEscalavel from 'Componentes/ElementosVisuais/ContainerEscalavel/ContainerEscalavel';

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html>
      <body>
        <div>
          <ContextoMenuSwiperEsquerdaProvider>
            <ContainerEscalavel>
              <main id={styles.main}>
                <MenuSwiperEsquerda />
                <div id={styles.recipiente_conteudo_pagina}>
                  {children}
                </div>
              </main>
            </ContainerEscalavel>
          </ContextoMenuSwiperEsquerdaProvider>
        </div>
      </body>
    </html>
  );
};