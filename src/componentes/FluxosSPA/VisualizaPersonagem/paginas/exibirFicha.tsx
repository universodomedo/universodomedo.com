import { useContextoPaginaPersonagem } from "Contextos/ContextoPaginaPersonagem/contexto";
import { ContextoExibirFichaProvider } from "Contextos/ContextoExibirFichaProvider/contexto";

export default function SPA__ExibirFicha__Personagem() {
    const { personagem } = useContextoPaginaPersonagem();

    return (
        <ContextoExibirFichaProvider idFicha={personagem.idFichaVigente!} desativarAcoes />
    );
};