'use client';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { EditorMembros } from 'Componentes/EditorMembros/EditorMembros';
import { useContexto__PaginaGameDesignerEstruturaSerHumano } from 'Contextos/Contexto__PaginaGameDesignerEstruturaSerHumano/contexto';

export default function SPA__PaginaGameDesignerEstruturaSerHumano() {
    const { editor, carregando, salvando, podeSalvar, salvar } = useContexto__PaginaGameDesignerEstruturaSerHumano();

    if (carregando) return <p>Carregando estrutura humana...</p>;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <EditorMembros
                    membros={editor.membros}
                    capacidadesInatas={editor.capacidadesInatas}
                    salvando={salvando}
                    mensagemValidacao={editor.mensagemValidacao}
                    adicionaMembro={editor.adicionaMembro}
                    removeMembro={editor.removeMembro}
                    atualizaNomeMembro={editor.atualizaNomeMembro}
                    alternaCapacidadeMembro={editor.alternaCapacidadeMembro}
                    adicionaAcaoMembro={editor.adicionaAcaoMembro}
                    removeAcaoMembro={editor.removeAcaoMembro}
                    atualizaNomeAcaoMembro={editor.atualizaNomeAcaoMembro}
                    atualizaCapacidadeAcaoMembro={editor.atualizaCapacidadeAcaoMembro}
                    atualizaDanoAcaoMembro={editor.atualizaDanoAcaoMembro}
                />
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : 'Salvar estrutura'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
