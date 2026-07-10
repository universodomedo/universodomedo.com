import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaModeradorCapacidadesInatas__Cadastro } from 'Contextos/Contexto__PaginaModeradorCapacidadesInatas__Cadastro/contexto';

export default function SPA__PaginaModeradorCapacidadesInatas__Cadastro() {
    const { formularioNovaCapacidadeInata, salvar } = useContexto__PaginaModeradorCapacidadesInatas__Cadastro();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Nome">
                    <input type="text" {...formularioNovaCapacidadeInata.input('nome')} />
                    {formularioNovaCapacidadeInata.erro('nome') && <small className={styles.erro_campo}>{formularioNovaCapacidadeInata.erro('nome')}</small>}
                </InputComRotulo>
                <InputComRotulo rotulo="Interação">
                    <input type="text" {...formularioNovaCapacidadeInata.input('nomeInteracao')} />
                    {formularioNovaCapacidadeInata.erro('nomeInteracao') && <small className={styles.erro_campo}>{formularioNovaCapacidadeInata.erro('nomeInteracao')}</small>}
                </InputComRotulo>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar} disabled={!formularioNovaCapacidadeInata.podeSalvar}>{formularioNovaCapacidadeInata.salvando ? 'Salvando...' : 'Salvar Capacidade'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
