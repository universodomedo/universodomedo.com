import { ContextoMestreAventurasProvider } from "Contextos/ContextoMestreAventuras/contexto";
import { AventurasMestre_Contexto } from "./componentes";

export default function AventurasMestre() {
    return (
        <ContextoMestreAventurasProvider>
            <AventurasMestre_Contexto />
        </ContextoMestreAventurasProvider>
    );
};