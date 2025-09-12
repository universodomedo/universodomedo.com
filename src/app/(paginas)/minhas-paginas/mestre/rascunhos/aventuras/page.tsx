import { TiposGeralRascunho } from "types-nora-api";

import { ContextoRascunhosMestreProvider } from "Contextos/ContextoRascunhosMestre/contexto";
import { RascunhosMestre_Contexto } from "../componentes";

export default function RascunhoAventuraMestre() {
    return (
        <ContextoRascunhosMestreProvider tipoGeralRascunho={TiposGeralRascunho.AVENTURA}>
            <RascunhosMestre_Contexto />
        </ContextoRascunhosMestreProvider>
    );
};