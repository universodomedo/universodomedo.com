'use client';

import { useContextoControlePalco } from 'Contextos/ContextoControlePalco/contexto';
import ConteudoControlePalco from './ConteudoControlePalco';

// Sempre montado pela BarraAcoesFlutuante, mas só usa o contexto (SSR-safe) e renderiza null quando fechado.
// O conteúdo (WS/Redux) vive em ConteudoControlePalco, que só monta ao abrir.
export default function PainelControlePalco() {
    const { painelAberto, codigoSelecionado } = useContextoControlePalco();
    if (!painelAberto || !codigoSelecionado) return null;
    return <ConteudoControlePalco />;
};
