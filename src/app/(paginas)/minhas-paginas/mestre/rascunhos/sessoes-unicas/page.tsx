import { ContextoRascunhosMestreProvider } from "Contextos/ContextoRascunhosMestre/contexto";
import { RascunhosMestre_Contexto } from "../componentes";

export default function RascunhoSessoesUnicasMestre() {
    return (
        <ContextoRascunhosMestreProvider ehSessaoUnica={true}>
            <RascunhosMestre_Contexto />
        </ContextoRascunhosMestreProvider>
    );
};