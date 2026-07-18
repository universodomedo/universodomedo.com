'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__CadastroObjetivo() {
    const { formularioNovoObjetivo, salvar } = useContexto__PaginaColaboradorPainelDoMedo__CadastroObjetivo();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Nome">
                    <input type="text" autoFocus {...formularioNovoObjetivo.input('nome')} />
                    {formularioNovoObjetivo.erro('nome') && <small className={styles.erro_campo}>{formularioNovoObjetivo.erro('nome')}</small>}
                </InputComRotulo>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar} disabled={!formularioNovoObjetivo.podeSalvar}>{formularioNovoObjetivo.salvando ? 'Criando...' : 'Criar Objetivo'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
