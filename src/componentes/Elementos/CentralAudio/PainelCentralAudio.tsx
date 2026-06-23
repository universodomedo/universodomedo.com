'use client';

import { useContextoCentralAudio } from 'Contextos/ContextoCentralAudio/contexto';
import ConteudoCentralAudio from './ConteudoCentralAudio';

// Sempre montado pela BarraAcoesFlutuante, mas só usa o contexto (SSR-safe) e renderiza null quando fechado.
// O conteúdo (GraphQL/Redux) vive em ConteudoCentralAudio, que só monta ao abrir — evita rodar hooks de dados no SSR.
export default function PainelCentralAudio() {
    const { painelAberto, fecharPainel, cancelarFechamentoAutomatico } = useContextoCentralAudio();
    if (!painelAberto) return null;
    return <ConteudoCentralAudio onFechar={fecharPainel} onAtividade={cancelarFechamentoAutomatico} />;
};
