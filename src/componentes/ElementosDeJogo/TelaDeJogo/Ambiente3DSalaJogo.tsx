'use client';

import styles from './Cena3DSalaJogo.module.css';

import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faMinus, faRightLeft } from '@fortawesome/free-solid-svg-icons';

import { AreaInterativa3D } from 'Componentes/ElementosDeInteratividade3D/AreaInterativa3D';
import { Editor3DProvider } from 'Componentes/ElementosDeInteratividade3D/contexto/Editor3DContexto';
import { criaAssinaturaAmbiente3DSalaJogo, criaEstadoAmbiente3DParaSalaJogo } from './Ambiente3DSalaJogo.helpers';
import type { DocumentoCena3DPrototipo } from 'Funcionalidades/Cena3DPrototipo/cena3DPrototipo.types';
import type { ModoCameraJogo3D } from 'Componentes/ElementosDeInteratividade3D/renderizador/editor3D.renderizador.jogo';

interface Ambiente3DSalaJogoProps {
    readonly documento: DocumentoCena3DPrototipo;
};

interface VisaoAmbiente3DSalaJogoProps {
    readonly documento: DocumentoCena3DPrototipo;
    readonly modoCamera: ModoCameraJogo3D;
    readonly assinaturaCena: string;
};

function obtemModoCameraOpostoSalaJogo(modoCamera: ModoCameraJogo3D): ModoCameraJogo3D { return modoCamera === 'PRIMEIRA_PESSOA' ? 'TERCEIRA_PESSOA' : 'PRIMEIRA_PESSOA'; };

function VisaoAmbiente3DSalaJogo({ documento, modoCamera, assinaturaCena }: VisaoAmbiente3DSalaJogoProps) {
    const assinatura = useMemo(() => `${modoCamera}:${assinaturaCena}`, [assinaturaCena, modoCamera]);
    const estadoInicial = useMemo(() => criaEstadoAmbiente3DParaSalaJogo(documento, modoCamera), [documento, modoCamera]);
    const configuracaoCameraJogo = useMemo(() => ({ modoCamera }), [modoCamera]);

    return (
        <Editor3DProvider key={assinatura} estadoInicial={estadoInicial}>
            <AreaInterativa3D modoRenderizacao="JOGO" configuracaoCameraJogo={configuracaoCameraJogo} />
        </Editor3DProvider>
    );
};

export function Ambiente3DSalaJogo({ documento }: Ambiente3DSalaJogoProps) {
    const [modoCameraPrincipal, setModoCameraPrincipal] = useState<ModoCameraJogo3D>('PRIMEIRA_PESSOA');
    const [visaoSecundariaMinimizada, setVisaoSecundariaMinimizada] = useState(false);
    const assinaturaCena = useMemo(() => criaAssinaturaAmbiente3DSalaJogo(documento), [documento]);
    const modoCameraSecundaria = obtemModoCameraOpostoSalaJogo(modoCameraPrincipal);
    const classeQuadroVisaoSecundaria = visaoSecundariaMinimizada ? `${styles.quadro_visao_secundaria_sala_jogo_3d} ${styles.quadro_visao_secundaria_sala_jogo_3d_minimizado}` : styles.quadro_visao_secundaria_sala_jogo_3d;

    return (
        <>
            <div className={styles.visao_principal_sala_jogo_3d}>
                <VisaoAmbiente3DSalaJogo documento={documento} modoCamera={modoCameraPrincipal} assinaturaCena={assinaturaCena} />
            </div>
            <div className={classeQuadroVisaoSecundaria}>
                {!visaoSecundariaMinimizada && (
                    <div className={styles.visao_secundaria_sala_jogo_3d}>
                        <VisaoAmbiente3DSalaJogo documento={documento} modoCamera={modoCameraSecundaria} assinaturaCena={assinaturaCena} />
                    </div>
                )}
                <div className={styles.barra_visao_secundaria_sala_jogo}>
                    <span>{modoCameraSecundaria === 'PRIMEIRA_PESSOA' ? '1P' : '3P'}</span>
                    <button type="button" onClick={() => setModoCameraPrincipal(modoCameraSecundaria)} aria-label="Trocar visão principal e secundária" title="Trocar visão">
                        <FontAwesomeIcon icon={faRightLeft} />
                    </button>
                    <button type="button" onClick={() => setVisaoSecundariaMinimizada(!visaoSecundariaMinimizada)} aria-label={visaoSecundariaMinimizada ? 'Restaurar visão secundária' : 'Minimizar visão secundária'} title={visaoSecundariaMinimizada ? 'Restaurar visão secundária' : 'Minimizar visão secundária'}>
                        <FontAwesomeIcon icon={visaoSecundariaMinimizada ? faExpand : faMinus} />
                    </button>
                </div>
            </div>
        </>
    );
};
