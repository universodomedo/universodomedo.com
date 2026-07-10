'use client';

import { useState } from 'react';

import { toast } from 'Hooks/useToast';
import { LUZ_PADRAO, rotuloInteragivel, rotuloLuz } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Editor } from '../Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigLuz from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigLuz/SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigLuz';

// Subfluxo Configuração da Luz: edita a fonte de luz (Nome, Alcance mm, Intensidade, Posição). Buffer local → Salvar commita no config e volta.
export const Contexto__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigLuz__Provider = () => {
    const { config, nomesPorIdSer, chaveEmEdicao, atualizaLuz, voltarParaFormulario } = useContexto__PaginaGameDesignerConfiguracaoPartida__Editor();
    const luz = (config.luzes ?? []).find(luzAtual => luzAtual.chave === chaveEmEdicao) ?? null;

    const [nome, setNome] = useState<string>(luz?.nome ?? '');
    const [alcanceMilimetros, setAlcanceMilimetros] = useState<number>(luz?.alcanceMilimetros ?? LUZ_PADRAO.alcanceMilimetros);
    const [intensidade, setIntensidade] = useState<number>(luz?.intensidade ?? LUZ_PADRAO.intensidade);
    const [posicao, setPosicao] = useState<{ x: number; y: number }>(luz?.posicao ?? { x: 0, y: 0 });

    if (!luz) return null;
    const ativa = luz;

    const mapaLogico = config.cenario.mapaLogico;
    const rotuloAtivo = nome.trim().length > 0 ? nome : 'Luz';
    const marcadoresContexto = [
        ...(config.luzes ?? []).filter(luzAtual => luzAtual.chave !== ativa.chave).map(luzAtual => ({ key: luzAtual.chave, posicao: { x: luzAtual.posicao?.x ?? 0, y: luzAtual.posicao?.y ?? 0 }, rotulo: rotuloLuz(luzAtual) })),
        ...config.interagiveis.map(interagivel => ({ key: interagivel.chave, posicao: { x: interagivel.posicao?.x ?? 0, y: interagivel.posicao?.y ?? 0 }, rotulo: rotuloInteragivel(interagivel, nomesPorIdSer) })),
    ];

    function salvar(): void {
        atualizaLuz(ativa.chave, { nome, alcanceMilimetros, intensidade, posicao });
        void toast.sucesso('Luz salva');
        voltarParaFormulario();
    };

    return (
        <SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigLuz
            nome={nome}
            aoMudarNome={setNome}
            alcanceMilimetros={alcanceMilimetros}
            aoMudarAlcance={setAlcanceMilimetros}
            intensidade={intensidade}
            aoMudarIntensidade={setIntensidade}
            posicao={posicao}
            aoMudarPosicao={setPosicao}
            larguraMilimetros={mapaLogico.larguraMilimetros}
            alturaMilimetros={mapaLogico.alturaMilimetros}
            rotuloAtivo={rotuloAtivo}
            marcadoresContexto={marcadoresContexto}
            salvar={salvar}
        />
    );
};
