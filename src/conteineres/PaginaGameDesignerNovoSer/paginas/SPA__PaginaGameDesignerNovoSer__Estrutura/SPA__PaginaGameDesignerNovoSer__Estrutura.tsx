'use client';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { EditorMembros } from 'Componentes/EditorMembros/EditorMembros';
import { useContexto__PaginaGameDesignerNovoSer__Estrutura } from 'Contextos/Contexto__PaginaGameDesignerNovoSer__Estrutura/contexto';

export default function SPA__PaginaGameDesignerNovoSer__Estrutura() {
    const { editor, carregando, erro, salvando, podeSalvar, salvar } = useContexto__PaginaGameDesignerNovoSer__Estrutura();

    if (carregando) return <p>Carregando estrutura própria do Ser...</p>;
    if (erro) return <p>{erro}</p>;

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
