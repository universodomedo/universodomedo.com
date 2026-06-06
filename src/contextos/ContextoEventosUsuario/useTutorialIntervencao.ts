import { useCallback, useEffect, useMemo, useState } from 'react';
import { PassoTutorialUsuario } from 'types-nora-api';

import { EventoUsuarioCentralItem } from './eventoUsuarioCentralItem';
import { PosicaoIntervencaoTutorial, resolverAlvoEPosicaoDoPasso } from './tutorialPassoResolucao';

// Etapa 16: API pronta da intervenção de tutorial (multi-passos). O contexto re-expõe estes campos flat; o componente só renderiza.
export type IntervencaoTutorial = {
    tutorialAberto: EventoUsuarioCentralItem | null;
    passoAtual: PassoTutorialUsuario | null;
    progressoRotulo: string;
    ehUltimoPasso: boolean;
    alvoVisualLocalizado: string | null;
    posicaoIntervencao: PosicaoIntervencaoTutorial;
    abrirTutorial: (idEvento: number) => void;
    proximoPasso: () => void;
    fecharTutorial: () => void;
    confirmarTutorial: () => void;
    reavaliarAlvoVisual: () => void;
};

// Etapa 12: estado/ações da intervenção visual mínima de tutorial. Backend continua a fonte da verdade (usa marcarLido).
// Etapa 15: o confirmar agora usa o fluxo dedicado concluirTutorial (não mais marcarLido); backend segue a fonte da verdade.
// Etapa 16: fluxo de múltiplos passos — passoIndice controla o passo; alvo/posição resolvidos por passo; concluir só no último.
export function useTutorialIntervencao(itens: EventoUsuarioCentralItem[], concluirTutorial: (idEvento: number) => void, estaAutenticado: boolean): IntervencaoTutorial {
    const [tutorialAberto, setTutorialAberto] = useState<EventoUsuarioCentralItem | null>(null);
    const [passoIndice, setPassoIndice] = useState(0);
    const [alvoVisualLocalizado, setAlvoVisualLocalizado] = useState<string | null>(null);
    const [posicaoIntervencao, setPosicaoIntervencao] = useState<PosicaoIntervencaoTutorial>('central');

    // Aplica o passo: resolve alvo+posição FORA do componente; some o destaque anterior ao trocar de passo.
    const aplicarPasso = useCallback((item: EventoUsuarioCentralItem, indice: number) => {
        const passo = item.passos[indice];
        const resolvido = passo ? resolverAlvoEPosicaoDoPasso(passo) : { alvoVisualLocalizado: null, posicaoIntervencao: 'central' as const };
        setAlvoVisualLocalizado(resolvido.alvoVisualLocalizado);
        setPosicaoIntervencao(resolvido.posicaoIntervencao);
    }, []);

    // Reseta o estado temporário da execução (sem destaque/posição/índice residual).
    const resetar = useCallback(() => { setTutorialAberto(null); setPassoIndice(0); setAlvoVisualLocalizado(null); setPosicaoIntervencao('central'); }, []);

    // Abre só se o item existir e puder abrir tutorial (regra preparada pelo presenter).
    // Etapa 13: resolve o alvo visual FORA do componente (querySelector só com o alvo já validado pelo presenter).
    // Etapa 14: decide também a região do card a partir do rect do alvo (sem coordenadas livres).
    // Etapa 16: começa no passo 0; a resolução agora é por passo (aplicarPasso) e a validação do alvo passou para a whitelist.
    const abrirTutorial = useCallback((idEvento: number) => {
        const item = itens.find(evento => evento.id === idEvento);
        if (!item || !item.podeAbrirTutorial) return;
        setTutorialAberto(item);
        setPassoIndice(0);
        aplicarPasso(item, 0);
    }, [itens, aplicarPasso]);

    // Etapa 16: avança exatamente um passo nos intermediários (não persiste nada; conclusão só no último via confirmar).
    const proximoPasso = useCallback(() => {
        if (!tutorialAberto) return;
        const proximo = passoIndice + 1;
        if (proximo >= tutorialAberto.passos.length) return;
        setPassoIndice(proximo);
        aplicarPasso(tutorialAberto, proximo);
    }, [tutorialAberto, passoIndice, aplicarPasso]);

    const fecharTutorial = useCallback(() => { resetar(); }, [resetar]);

    // Confirma: conclui o tutorial pelo fluxo dedicado (Etapa 15; backend devolve a lista) e fecha. Sem estado paralelo de conclusão.
    // Etapa 16: só o último passo mostra Entendi, então o confirmar conclui o tutorial inteiro.
    // Etapa 16 (correção): ação pública protegida — conclui só no último passo válido (não depende do componente esconder o botão).
    const confirmarTutorial = useCallback(() => {
        if (!tutorialAberto) return;
        const totalPassos = tutorialAberto.passos.length;
        if (totalPassos === 0 || passoIndice !== totalPassos - 1 || !tutorialAberto.passos[passoIndice]) return;
        concluirTutorial(tutorialAberto.id);
        resetar();
    }, [tutorialAberto, passoIndice, concluirTutorial, resetar]);

    // Etapa 17: reavalia o alvo+posição do passo atual (rede de segurança após a barra expandir e o botão real montar).
    const reavaliarAlvoVisual = useCallback(() => {
        if (tutorialAberto) aplicarPasso(tutorialAberto, passoIndice);
    }, [tutorialAberto, passoIndice, aplicarPasso]);

    // Desautenticou (eventos limpos no contexto) => fecha a intervenção e zera o estado temporário.
    useEffect(() => { if (!estaAutenticado) resetar(); }, [estaAutenticado, resetar]);

    const passoAtual = tutorialAberto ? (tutorialAberto.passos[passoIndice] ?? null) : null;
    const totalPassos = tutorialAberto ? tutorialAberto.passos.length : 0;
    const ehUltimoPasso = totalPassos > 0 && passoIndice >= totalPassos - 1;
    const progressoRotulo = totalPassos > 0 ? `Passo ${passoIndice + 1} de ${totalPassos}` : '';

    return useMemo(() => ({ tutorialAberto, passoAtual, progressoRotulo, ehUltimoPasso, alvoVisualLocalizado, posicaoIntervencao, abrirTutorial, proximoPasso, fecharTutorial, confirmarTutorial, reavaliarAlvoVisual }), [tutorialAberto, passoAtual, progressoRotulo, ehUltimoPasso, alvoVisualLocalizado, posicaoIntervencao, abrirTutorial, proximoPasso, fecharTutorial, confirmarTutorial, reavaliarAlvoVisual]);
};
