// tive que colocar isso para que o build não reclame de uso de cookie quando chamando endpoint. Não entendi muito bem o que muda e consequências
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import './globals.css';
import styles from './styles.module.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import 'react-day-picker/style.css';

import Fumaca from 'Componentes/ElementosVisuais/Fumaca/Fumaca.tsx';

import ReduxProvider from 'Redux/providers/ReduxProvider';
import SocketListeners from 'Listeners/SocketListeners';
import EventosUsuarioCentral from 'Componentes/Elementos/EventosUsuarioCentral/EventosUsuarioCentral';
import { ContextoEventosUsuarioProvider } from 'Contextos/ContextoEventosUsuario/contexto';
import { ContextoTutorialAberturaProvider } from 'Contextos/ContextoTutorialAbertura/contexto';
import RenderizadorTutorialModal from 'Componentes/Elementos/RenderizadorTutorial/RenderizadorTutorialModal';

import { ContextoPerformanceProvider } from 'Contextos/ContextoPerformace/contexto';
import { ContextoAutenticacaoProvider } from 'Contextos/ContextoAutenticacao/contexto';
import { ContextoMenuSwiperEsquerdaProvider } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
import { ContextoNavegacaoRuntimeProvider } from 'Contextos/ContextoNavegacaoRuntime/contexto';
import AppClientProviders from '../funcionalidades/AppClientProvider';
import { Contexto__Chat__Provider } from 'Contextos/ContextoChat/contexto';

import { Cinzel, Cinzel_Decorative, Junge, B612_Mono } from 'next/font/google';

import MenuSwiperEsquerda from 'Componentes/Elementos/MenuSwiperEsquerda/MenuSwiperEsquerda.tsx';

import { Provider as RadixTooltip } from "@radix-ui/react-tooltip";
import ControladorAudioGlobal from 'Componentes/Elementos/ControladorAudioGlobal/ControladorAudioGlobal';
import ControladorPalcoAudioGlobal from 'Componentes/Elementos/ControladorPalcoAudioGlobal/ControladorPalcoAudioGlobal';
import BarraAcoesFlutuante from 'Componentes/Elementos/BarraAcoesFlutuante/BarraAcoesFlutuante';
import { BarraAcoesFlutuante__ProviderGlobal } from 'Componentes/Elementos/BarraAcoesFlutuante/BarraAcoesFlutuante__ProviderGlobal';
import InicializadorCache from 'Componentes/Elementos/InicializadorCache/InicializadorCache';
import ConteinerEscalavel from 'Componentes/ElementosVisuais/ConteinerEscalavel/ConteinerEscalavel';
import NavigationBridgeProvider from 'Funcionalidades/NavigationBridgeProvider';
import { ContextoCopiarParaClipboardProvider } from 'Contextos/ContextoCopiarParaClipboard/contexto';
import ClipboardToast from 'Componentes/ElementosVisuais/ClipboardToast/ClipboardToast';
import NoraApiCarregamentoGlobal from 'Componentes/ElementosVisuais/NoraApiCarregamentoGlobal/NoraApiCarregamentoGlobal';
import FundoPaginaAtmosferico from 'Componentes/ElementosVisuais/FundoPaginaAtmosferico/FundoPaginaAtmosferico';

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
    <html lang="pt-BR">
      <body>
        <FundoPaginaAtmosferico>
          <NoraApiCarregamentoGlobal />
          <ReduxProvider>
            <ContextoPerformanceProvider>
              <ContextoAutenticacaoProvider>
                <ContextoEventosUsuarioProvider>
                  <ContextoTutorialAberturaProvider>
                    <SocketListeners />
                    <EventosUsuarioCentral />
                    <RenderizadorTutorialModal />
                <RadixTooltip delayDuration={200} skipDelayDuration={0}>
                  <AppClientProviders>
                    <Contexto__Chat__Provider>
                      <BarraAcoesFlutuante__ProviderGlobal>
                        <ContextoMenuSwiperEsquerdaProvider>
                          <ContextoNavegacaoRuntimeProvider>
                          <InicializadorCache>
                            <ConteudoContextualizado>
                              <ConteinerEscalavel>
                                <ContextoCopiarParaClipboardProvider>
                                  <NavigationBridgeProvider />
                                  {children}
                                  <ClipboardToast />
                                </ContextoCopiarParaClipboardProvider>
                              </ConteinerEscalavel>
                              <ControladorAudioGlobal />
                              <ControladorPalcoAudioGlobal />
                            </ConteudoContextualizado>
                          </InicializadorCache>
                          </ContextoNavegacaoRuntimeProvider>
                        </ContextoMenuSwiperEsquerdaProvider>
                      </BarraAcoesFlutuante__ProviderGlobal>
                    </Contexto__Chat__Provider>
                  </AppClientProviders>
                </RadixTooltip>
                  </ContextoTutorialAberturaProvider>
                </ContextoEventosUsuarioProvider>
              </ContextoAutenticacaoProvider>
            </ContextoPerformanceProvider>
          </ReduxProvider>
        </FundoPaginaAtmosferico>
      </body>
    </html>
  );
};

function ConteudoContextualizado({ children }: { children: ReactNode }) {
  return (
    <>
      <div id={styles.aviso_orientacao}>Por favor, gire seu dispositivo para o modo paisagem</div>
      <div id={styles.recipiente_orientacao_correta}>
        <Fumaca />
        <main id={styles.main}>
          <MenuSwiperEsquerda />
          <div id={styles.recipiente_conteudo_pagina}>
            {children}
            <BarraAcoesFlutuante />
          </div>
        </main>
      </div>
    </>
  );
};

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export const metadata: Metadata = {
  title: 'Universo do Medo',
  description: 'A luta da humanidade contra o Paranormal',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};