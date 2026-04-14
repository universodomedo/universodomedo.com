import { FichaTemporariaVisualizacaoDetalhadaDto, PASSES } from 'types-nora-api';

import { useVerificadorPasse } from 'Hooks/useVerificadorPasse';

export function usePodeCriarFicha(fichasTemporariasDoUsuario: FichaTemporariaVisualizacaoDetalhadaDto[]) {
    const { verificarPasse } = useVerificadorPasse();

    const temAlgumaFicha = fichasTemporariasDoUsuario.length > 0;
    const verificacaoPasseFundador = verificarPasse(PASSES.PASSE_DE_FUNDADOR);
    const podeCriarNovaFicha = !temAlgumaFicha || verificacaoPasseFundador.temPasse;

    return { temAlgumaFicha, verificacaoPasseFundador, podeCriarNovaFicha };
};