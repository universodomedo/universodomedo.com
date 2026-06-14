import styles from './styles.module.css';

import { TIPOS_SER } from 'types-nora-api';

import { useContexto__PaginaGameDesignerSeres__Cadastro } from 'Contextos/Contexto__PaginaGameDesignerSeres__Cadastro/contexto';

const OPCOES_TIPOS_SER = [TIPOS_SER.SER_UNICO, TIPOS_SER.SER_GENERICO] as const;

export default function SPA__PaginaGameDesignerSeres__Cadastro() {
    const { formularioNovoSer, salvar } = useContexto__PaginaGameDesignerSeres__Cadastro();

    return (
        <section className={styles.recipiente_cadastro}>
            <div className={styles.painel_formulario}>
                <header className={styles.cabecalho_formulario}>
                    <h2>Novo Ser</h2>
                </header>

                <div className={styles.formulario}>
                    <label className={styles.campo}>
                        <span>Tipo Ser</span>
                        <select value={formularioNovoSer.valores.idTipoSer} onChange={evento => formularioNovoSer.setCampo('idTipoSer', evento.target.value)} disabled={formularioNovoSer.salvando}>
                            {OPCOES_TIPOS_SER.map(tipoSer => <option key={tipoSer.id} value={String(tipoSer.id)}>{tipoSer.nome}</option>)}
                        </select>
                        {formularioNovoSer.erro('idTipoSer') && <small className={styles.erro_campo}>{formularioNovoSer.erro('idTipoSer')}</small>}
                    </label>

                    <label className={styles.campo}>
                        <span>Nome</span>
                        <input type="text" {...formularioNovoSer.input('nome')} />
                        {formularioNovoSer.erro('nome') && <small className={styles.erro_campo}>{formularioNovoSer.erro('nome')}</small>}
                    </label>
                </div>

                <footer className={styles.rodape_formulario}>
                    <button type="button" className={styles.botao_salvar} onClick={salvar} disabled={!formularioNovoSer.podeSalvar}>{formularioNovoSer.salvando ? 'Salvando...' : 'Salvar Ser'}</button>
                </footer>
            </div>
        </section>
    );
};
