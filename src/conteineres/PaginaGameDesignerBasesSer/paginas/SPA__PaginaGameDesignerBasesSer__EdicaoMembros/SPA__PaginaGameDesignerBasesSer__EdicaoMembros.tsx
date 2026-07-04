'use client';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { EditorMembros } from 'Componentes/EditorMembros/EditorMembros';
import { useContexto__PaginaGameDesignerBasesSer__EdicaoMembros } from 'Contextos/Contexto__PaginaGameDesignerBasesSer__EdicaoMembros/contexto';

export default function SPA__PaginaGameDesignerBasesSer__EdicaoMembros() {
    const contexto = useContexto__PaginaGameDesignerBasesSer__EdicaoMembros();

    if (contexto.carregando) return <p>Carregando membros...</p>;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <EditorMembros
                    membros={contexto.membros}
                    capacidadesInatas={contexto.capacidadesInatas}
                    salvando={contexto.salvando}
                    mensagemValidacao={contexto.mensagemValidacao}
                    adicionaMembro={contexto.adicionaMembro}
                    removeMembro={contexto.removeMembro}
                    atualizaNomeMembro={contexto.atualizaNomeMembro}
                    alternaCapacidadeMembro={contexto.alternaCapacidadeMembro}
                    adicionaAcaoMembro={contexto.adicionaAcaoMembro}
                    removeAcaoMembro={contexto.removeAcaoMembro}
                    atualizaNomeAcaoMembro={contexto.atualizaNomeAcaoMembro}
                    atualizaCapacidadeAcaoMembro={contexto.atualizaCapacidadeAcaoMembro}
                    atualizaDanoAcaoMembro={contexto.atualizaDanoAcaoMembro}
                />
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={contexto.salvar} disabled={!contexto.podeSalvar}>{contexto.salvando ? 'Salvando...' : 'Salvar membros'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
