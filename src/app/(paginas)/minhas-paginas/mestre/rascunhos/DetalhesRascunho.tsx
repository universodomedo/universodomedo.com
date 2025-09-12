import { ContextoRascunhoProvider } from "Contextos/ContextoRascunho/contexto";
import DetalhesRascunho_Conteudo from "Componentes/Elementos/DetalhesRascunho/DetalhesRascunho";

export default function DetalhesRascunho({ idRascunhoSelecionado }: { idRascunhoSelecionado: number }) {
    return (
        <ContextoRascunhoProvider idRascunhoSelecionado={idRascunhoSelecionado}>
            <DetalhesRascunho_Conteudo />
        </ContextoRascunhoProvider>
    );
};