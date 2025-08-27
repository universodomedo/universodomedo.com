import { ContextoMestreRascunhosAventurasProvider } from "Contextos/ContextoMestreRascunhosAventuras/contexto";
import { RascunhoAventuraMestre_Contexto } from "./componentes";

export default function RascunhoAventuraMestre() {
    return (
        <ContextoMestreRascunhosAventurasProvider>
            <RascunhoAventuraMestre_Contexto />
        </ContextoMestreRascunhosAventurasProvider>
    );
};