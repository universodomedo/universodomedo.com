'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import { useContexto__PaginaGameDesignerSeres__EditarMembros } from 'Contextos/Contexto__PaginaGameDesignerSeres__EditarMembros/contexto';
import { EditorMembros } from 'Componentes/EditorMembros/EditorMembros';
import { Componente_Selecionador__BaseSer } from 'Componentes/Selecionadores/Componente_Selecionador__BaseSer/Componente_Selecionador__BaseSer';

export default function SPA__PaginaGameDesignerSeres__EditarMembros() {
    const contexto = useContexto__PaginaGameDesignerSeres__EditarMembros();
    const [selecionandoBase, setSelecionandoBase] = useState(false);

    if (contexto.carregando) return <section className={styles.editor}><p>Carregando membros...</p></section>;

    if (selecionandoBase) return (
        <section className={styles.editor}>
            <header className={styles.cabecalho}>
                <h2>Escolha uma Base de Ser</h2>
            </header>

            <Componente_Selecionador__BaseSer
                aoConfirmar={async idBaseSer => { await contexto.carregarDeBaseSer(idBaseSer); setSelecionandoBase(false); }}
                aoCancelar={() => setSelecionandoBase(false)}
            />
        </section>
    );

    return (
        <section className={styles.editor}>
            <header className={styles.cabecalho}>
                <button type="button" className={styles.botao_voltar} onClick={contexto.voltar} disabled={contexto.salvando}>← Voltar</button>
                <h2>Capacidades Inatas dos Membros</h2>
                <button type="button" className={styles.botao_base} onClick={() => setSelecionandoBase(true)} disabled={contexto.salvando}>Carregar de uma Base de Ser</button>
            </header>

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

            <footer className={styles.rodape}>
                <button type="button" className={styles.botao_salvar} onClick={contexto.salvar} disabled={!contexto.podeSalvar}>{contexto.salvando ? 'Salvando...' : 'Salvar membros'}</button>
            </footer>
        </section>
    );
};
