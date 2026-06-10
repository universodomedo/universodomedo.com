'use client';

import { useCallback, useRef, useState } from 'react';
import type { AreaPercentual } from 'types-nora-api';
import { LARGURA_PERCENTUAL_PADRAO_TUTORIAL } from 'types-nora-api';

import type { CampoTextoBotaoTutorial, DirecaoReordenar, PassoLocalTutorial, ResultadoAdicionaBlocoTutorial } from './tutorialEditor.types';
import { adicionaBlocoImagemTutorial, adicionaBlocoTextoTutorial, adicionaPassoTutorial, atualizaMarkdownBlocoTutorial, atualizaTextoBotaoPassoTutorial, criaPassoVazioTutorial, defineImagemBlocoTutorial, removeBlocoTutorial, removePassoTutorial } from './passoBlocoCriacaoTutorial';
import { reordenaBlocoTutorial, reordenaPassoTutorial } from './passoBlocoReordenacaoTutorial';
import { aplicaAreaBloco } from './aplicaGeometriaBlocoTutorial';

// Etapa 8: fonte única do estado geométrico/estrutural (passos + largura). Geometria via update funcional (sem closures velhas); adds leem o estado atual.
export function usePassosTutorial() {
    const proximoIdLocalRef = useRef(1);
    const gerarIdLocal = useCallback((): number => { const id = proximoIdLocalRef.current; proximoIdLocalRef.current += 1; return id; }, []);
    const [passos, setPassos] = useState<readonly PassoLocalTutorial[]>(() => [criaPassoVazioTutorial(gerarIdLocal())]);
    const [larguraPercentual, setLarguraPercentual] = useState<number>(LARGURA_PERCENTUAL_PADRAO_TUTORIAL);
    const [erroEdicao, setErroEdicao] = useState<string | null>(null);

    const aplicaResultado = (resultado: ResultadoAdicionaBlocoTutorial): void => {
        if (resultado.ok) { setPassos(resultado.passos); setErroEdicao(null); return; }
        setErroEdicao(resultado.motivo);
    };

    return {
        passos, larguraPercentual, erroEdicao, gerarIdLocal, setPassos, setLarguraPercentual, setErroEdicao,
        adicionaPasso: () => setPassos(prev => adicionaPassoTutorial(prev, gerarIdLocal())),
        removePasso: (idPasso: number) => setPassos(prev => removePassoTutorial(prev, idPasso)),
        reordenaPasso: (idPasso: number, direcao: DirecaoReordenar) => setPassos(prev => reordenaPassoTutorial(prev, idPasso, direcao)),
        adicionaBlocoTexto: (idPasso: number) => aplicaResultado(adicionaBlocoTextoTutorial(passos, idPasso, gerarIdLocal())),
        adicionaBlocoImagem: (idPasso: number) => aplicaResultado(adicionaBlocoImagemTutorial(passos, idPasso, gerarIdLocal())),
        removeBloco: (idPasso: number, idBloco: number) => setPassos(prev => removeBlocoTutorial(prev, idPasso, idBloco)),
        reordenaBloco: (idPasso: number, idBloco: number, direcao: DirecaoReordenar) => setPassos(prev => reordenaBlocoTutorial(prev, idPasso, idBloco, direcao)),
        atualizaMarkdownBloco: (idPasso: number, idBloco: number, markdown: string) => setPassos(prev => atualizaMarkdownBlocoTutorial(prev, idPasso, idBloco, markdown)),
        defineImagemBloco: (idPasso: number, idBloco: number, idArquivoTipadoArte: number) => setPassos(prev => defineImagemBlocoTutorial(prev, idPasso, idBloco, idArquivoTipadoArte)),
        atualizaTextoBotao: (idPasso: number, campo: CampoTextoBotaoTutorial, valor: string) => setPassos(prev => atualizaTextoBotaoPassoTutorial(prev, idPasso, campo, valor)),
        aplicaArea: (idPasso: number, idBloco: number, area: AreaPercentual, comSnap: boolean) => setPassos(prev => aplicaAreaBloco(prev, idPasso, idBloco, area, comSnap)),
    };
};
