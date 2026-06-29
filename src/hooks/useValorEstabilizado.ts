import { useEffect, useState } from 'react';

// Estabiliza um valor: só passa a refletir o novo valor depois que ele fica parado por `atrasoMs` (debounce).
// Usado no Orbital para NÃO trocar o fundo/a música a cada item durante scroll rápido — só quando a seleção assenta.
export function useValorEstabilizado<T>(valor: T, atrasoMs: number): T {
    const [estavel, setEstavel] = useState(valor);

    useEffect(() => {
        const id = setTimeout(() => setEstavel(valor), atrasoMs);
        return () => clearTimeout(id);
    }, [valor, atrasoMs]);

    return estavel;
};
