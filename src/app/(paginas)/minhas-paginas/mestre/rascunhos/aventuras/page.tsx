import { ContextoRascunhosMestreProvider } from "Contextos/ContextoRascunhosMestre/contexto";
import { RascunhosMestre_Contexto } from "../componentes";

export default function RascunhoAventuraMestre() {
    return (
        <ContextoRascunhosMestreProvider ehSessaoUnica={false}>
            <RascunhosMestre_Contexto />
        </ContextoRascunhosMestreProvider>
    );
};