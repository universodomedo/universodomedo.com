import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaGameDesignerBasesSer__Cadastro } from 'Contextos/Contexto__PaginaGameDesignerBasesSer__Cadastro/contexto';

export default function SPA__PaginaGameDesignerBasesSer__Cadastro() {
    const { formularioNovaBase, podeSalvar, salvar } = useContexto__PaginaGameDesignerBasesSer__Cadastro();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <label className={styles.campo}>
                    <span>Nome</span>
                    <input type="text" {...formularioNovaBase.input('nome')} />
                    {formularioNovaBase.erro('nome') && <small className={styles.erro_campo}>{formularioNovaBase.erro('nome')}</small>}
                </label>

                <label className={styles.campo}>
                    <span>Descrição</span>
                    <input type="text" {...formularioNovaBase.input('descricao')} />
                    {formularioNovaBase.erro('descricao') && <small className={styles.erro_campo}>{formularioNovaBase.erro('descricao')}</small>}
                </label>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar} disabled={!podeSalvar}>{formularioNovaBase.salvando ? 'Salvando...' : 'Criar Base'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
