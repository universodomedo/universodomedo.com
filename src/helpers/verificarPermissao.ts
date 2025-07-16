import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { UsuarioDto } from 'types-nora-api';

export function verificarPermissao(verificar: (usuario: UsuarioDto) => boolean): boolean | null {
    const { usuarioLogado, carregando } = useContextoAutenticacao();

    if (carregando) return null;
    if (!usuarioLogado) return false;

    return verificar(usuarioLogado);
};