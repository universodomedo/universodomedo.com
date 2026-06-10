'use client';

import { useEffect, useMemo, useRef } from 'react';
import useFormularioCreate, { type FormularioCreateEstado } from 'Hooks/useFormularioCreate';

import { FORMULARIO_TUTORIAL, type FormularioTutorial } from './formularioTutorial';
import { usePassosTutorial } from './usePassosTutorial';
import { usePassoSelecionadoTutorial } from './usePassoSelecionadoTutorial';
import { useCargaTutorial } from './useCargaTutorial';
import { usePersistenciaTutorial } from './usePersistenciaTutorial';
import { useDragBlocoTutorial } from './useDragBlocoTutorial';
import { useResizeBlocoTutorial } from './useResizeBlocoTutorial';
import { useArtesDaComposicaoTutorial } from './useArtesDaComposicaoTutorial';
import { larguraDeComposicaoLeitura, passosLocaisDeComposicao } from './composicaoLeituraParaLocalTutorial';
import { passosTutorialSaoValidos } from './validacaoLocalTutorial';

// Etapa 8: orquestrador do Editor — compõe estado (passos/largura), formulário oficial, carga GraphQL, persistência REST, seleção, drag/resize e artes em lote. Fonte única; lógica nos hooks.
export function useEditorTutorial(tutorialEmEdicaoId: number | null, concluiSalvamento: () => void) {
    const estaEditando = tutorialEmEdicaoId !== null;
    const acoes = usePassosTutorial();
    const selecao = usePassoSelecionadoTutorial();
    const consulta = useCargaTutorial(tutorialEmEdicaoId);
    const persistencia = usePersistenciaTutorial();

    const canvasRef = useRef<HTMLDivElement | null>(null);
    const medeCanvas = (): { largura: number; altura: number } => { const rect = canvasRef.current?.getBoundingClientRect(); return { largura: rect?.width ?? 0, altura: rect?.height ?? 0 }; };
    const drag = useDragBlocoTutorial(medeCanvas, acoes.aplicaArea);
    const resize = useResizeBlocoTutorial(medeCanvas, acoes.aplicaArea);

    const formulario: FormularioCreateEstado<FormularioTutorial> = useFormularioCreate(FORMULARIO_TUTORIAL, valores => persistencia.salvarTutorial({ estaEditando, id: tutorialEmEdicaoId, nome: valores.nome, chaveTutorial: valores.chaveTutorial, ativo: valores.ativo, passos: acoes.passos, larguraPercentual: acoes.larguraPercentual, aoConcluir: concluiSalvamento }));

    const populadoRef = useRef(false);
    const registro = consulta.data;
    useEffect(() => {
        if (!estaEditando || populadoRef.current || !registro) return;
        populadoRef.current = true;
        formulario.setCampo('chaveTutorial', registro.chaveTutorial);
        formulario.setCampo('nome', registro.nome);
        formulario.setCampo('ativo', registro.ativo);
        acoes.setLarguraPercentual(larguraDeComposicaoLeitura(registro.composicaoVisual, acoes.larguraPercentual));
        acoes.setPassos(passosLocaisDeComposicao(registro.composicaoVisual, acoes.gerarIdLocal));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [estaEditando, registro]);

    useEffect(() => {
        const existe = acoes.passos.some(passo => passo.idLocal === selecao.passoAtivoId);
        if (!existe && acoes.passos.length > 0) selecao.setPassoAtivoId(acoes.passos[0].idLocal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acoes.passos, selecao.passoAtivoId]);

    const passoAtivo = acoes.passos.find(passo => passo.idLocal === selecao.passoAtivoId) ?? acoes.passos[0];
    const idsArte = useMemo(() => Array.from(new Set(acoes.passos.flatMap(passo => passo.blocos).map(bloco => bloco.idImagem).filter((id): id is number => id !== null))), [acoes.passos]);
    const artes = useArtesDaComposicaoTutorial(idsArte);

    const pronto = !estaEditando || populadoRef.current;
    const podeSalvar = formulario.podeSalvar && passosTutorialSaoValidos(acoes.passos);
    const salvar = async (): Promise<void> => { if (podeSalvar) await formulario.salvar(); };

    return { estaEditando, pronto, carregando: consulta.carregando, erro: consulta.erro, formulario, passoAtivo, larguraPercentual: acoes.larguraPercentual, setLarguraPercentual: acoes.setLarguraPercentual, erroEdicao: acoes.erroEdicao, erroSalvar: persistencia.erroSalvar, podeSalvar, salvar, canvasRef, artes, selecao, drag, resize, acoes };
};

export type EditorTutorialEstado = ReturnType<typeof useEditorTutorial>;
