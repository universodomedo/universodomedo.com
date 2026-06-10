'use client';

import { useState } from 'react';

import { criaTutorial, editaTutorial } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import type { PassoLocalTutorial } from './tutorialEditor.types';
import { montaComposicaoVisualTutorial } from './composicaoLocalParaPayloadTutorial';

type DadosSalvarTutorial = { estaEditando: boolean; id: number | null; nome: string; chaveTutorial: string; ativo: boolean; passos: readonly PassoLocalTutorial[]; larguraPercentual: number; aoConcluir: () => void };

// Etapa 8: persistência por REST — monta payload completo (composição + largura) e grava só no Salvar. Erro de submissão exposto.
export function usePersistenciaTutorial() {
    const [erroSalvar, setErroSalvar] = useState<string | null>(null);

    async function salvarTutorial(dados: DadosSalvarTutorial): Promise<void> {
        const resultado = montaComposicaoVisualTutorial(dados.passos, dados.larguraPercentual);
        if (!resultado.ok) { setErroSalvar(resultado.motivo); return; }
        setErroSalvar(null);
        try {
            if (dados.estaEditando && dados.id !== null) await editaTutorial(dados.id, { nome: dados.nome, ativo: dados.ativo, composicaoVisual: resultado.composicao });
            else await criaTutorial({ chaveTutorial: dados.chaveTutorial, nome: dados.nome, ativo: dados.ativo, composicaoVisual: resultado.composicao });
            dados.aoConcluir();
        } catch (erroCapturado) {
            setErroSalvar(erroCapturado instanceof Error ? erroCapturado.message : 'Não foi possível salvar o Tutorial.');
        }
    };

    return { erroSalvar, salvarTutorial };
};
