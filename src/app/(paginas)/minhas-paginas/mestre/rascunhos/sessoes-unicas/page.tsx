import { ContextoMestreRascunhosSessoesUnicasProvider } from "Contextos/ContextoMestreRascunhosSessoesUnicas/contexto";
import { RascunhoSessoesUnicasMestre_Contexto } from "./componentes";

export default function RascunhoSessoesUnicasMestre() {
    return (
        <ContextoMestreRascunhosSessoesUnicasProvider>
            <RascunhoSessoesUnicasMestre_Contexto />
        </ContextoMestreRascunhosSessoesUnicasProvider>
    );
};