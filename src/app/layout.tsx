import './globals.css';
import styles from './styles.module.css';

import { ReactNode } from "react";
import { Cinzel, Cinzel_Decorative, Junge, B612_Mono } from 'next/font/google';

import { ContextoMenuSwiperEsquerdaProvider } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
import MenuSwiperEsquerda from 'Componentes/Elementos/MenuSwiperEsquerda/MenuSwiperEsquerda';
import ContainerEscalavel from 'Componentes/ElementosVisuais/ContainerEscalavel/ContainerEscalavel';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--fonte-cinzel',
}); // precisa colocar no :root

const cinzelDecorative = Cinzel_Decorative({
  subsets: ['latin'],
  weight: '700',
  variable: '--fonte-cinzel-decorative',
}); // precisa colocar no :root

const junge = Junge({
  subsets: ['latin'],
  weight: '400',
  variable: '--fonte-junge',
}); // precisa colocar no :root

const mono = B612_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--fonte-B612Mono',
}); // precisa colocar no :root

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

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