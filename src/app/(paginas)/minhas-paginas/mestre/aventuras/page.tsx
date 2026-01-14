import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoMestreAventurasProvider } from "Contextos/ContextoMestreAventuras/contexto";
import { AventurasMestre_Contexto } from "./componentes";

export default function AventurasMestre() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.aventuras}>
            <ContextoMestreAventurasProvider>
                <AventurasMestre_Contexto />
            </ContextoMestreAventurasProvider>
        </ControladorSlot>
    );
};