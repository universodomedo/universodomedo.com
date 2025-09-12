import { TiposGeralRascunho } from "types-nora-api";

import { ContextoRascunhosMestreProvider } from "Contextos/ContextoRascunhosMestre/contexto";
import { RascunhosMestre_Contexto } from "../componentes";

export default function RascunhoSessoesUnicasMestre() {
    return (
        <ContextoRascunhosMestreProvider tipoGeralRascunho={TiposGeralRascunho.SESSAO_UNICA}>
            <RascunhosMestre_Contexto />
        </ContextoRascunhosMestreProvider>
    );
};