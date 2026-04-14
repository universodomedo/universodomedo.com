import { CAPACIDADES, PasseDef } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export function useVerificadorPasse() {
    const { usuarioLogado, verificarCapacidade } = useContextoAutenticacao();

    function verificarPasse(passeNecessario: PasseDef) {
        const agora = new Date();
        const passeMencionadoPresente = !!usuarioLogado && usuarioLogado.passes.some(passeDoUsuario => passeDoUsuario.passe.id === passeNecessario.id && passeDoUsuario.dataValidade !== null && passeDoUsuario.dataValidade > agora);
        const passePermitidoPorCapacidade = verificarCapacidade(CAPACIDADES.PASSE_LIVRE);
        const temPasse = passeMencionadoPresente || passePermitidoPorCapacidade;

        return { passeMencionadoPresente, passePermitidoPorCapacidade, temPasse };
    };

    return { verificarPasse };
};