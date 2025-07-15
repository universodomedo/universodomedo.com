import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export function verificarPermissao(): boolean | null {
    const { usuarioLogado, carregando } = useContextoAutenticacao();
    
    if (carregando) return null;

    return usuarioLogado?.perfilAdmin.id === 2;
}