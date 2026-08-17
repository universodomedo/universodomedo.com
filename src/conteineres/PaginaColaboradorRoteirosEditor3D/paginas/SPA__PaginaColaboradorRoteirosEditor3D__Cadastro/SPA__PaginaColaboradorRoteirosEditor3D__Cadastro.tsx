'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaColaboradorRoteirosEditor3D__Cadastro } from 'Contextos/Contexto__PaginaColaboradorRoteirosEditor3D__Cadastro/contexto';

export default function SPA__PaginaColaboradorRoteirosEditor3D__Cadastro() {
    const { formularioNovoRoteiro, salvar } = useContexto__PaginaColaboradorRoteirosEditor3D__Cadastro();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Nome" classname={styles.campo_largo}>
                        <input type="text" autoFocus {...formularioNovoRoteiro.input('nome')} />
                        {formularioNovoRoteiro.erro('nome') && <small className={styles.erro_campo}>{formularioNovoRoteiro.erro('nome')}</small>}
                    </InputComRotulo>
                    <InputComRotulo rotulo="Objetivo" classname={styles.campo_largo}>
                        <textarea rows={4} {...formularioNovoRoteiro.textarea('objetivo')} />
                        {formularioNovoRoteiro.erro('objetivo') && <small className={styles.erro_campo}>{formularioNovoRoteiro.erro('objetivo')}</small>}
                    </InputComRotulo>
                </div>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar} disabled={!formularioNovoRoteiro.podeSalvar}>{formularioNovoRoteiro.salvando ? 'Criando...' : 'Criar Roteiro'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};