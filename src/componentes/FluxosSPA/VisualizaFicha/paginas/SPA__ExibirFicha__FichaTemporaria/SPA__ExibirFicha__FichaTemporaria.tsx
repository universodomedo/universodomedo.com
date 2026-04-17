import { useContextoPaginaFichaTemporaria } from "Contextos/ContextoPaginaFichaTemporaria/contexto";
import { ContextoExibirFichaProvider } from "Contextos/ContextoExibirFichaProvider/contexto";

export default function SPA__ExibirFicha__FichaTemporaria() {
    const { fichaTemporaria } = useContextoPaginaFichaTemporaria();

    return (
        <ContextoExibirFichaProvider idFicha={fichaTemporaria.idFicha} desativarAcoes />
    );
};