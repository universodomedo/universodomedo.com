'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';

type Props = {
    descricao: string;
    aoMudarDescricao: (valor: string) => void;
    ativo: boolean;
    salvando: boolean;
    salvar: () => Promise<void>;
    alternarAtivo: () => Promise<void>;
    cancelar: () => void;
};

export default function SPA__PaginaAdminGestaoMenu__EdicaoMenu({ descricao, aoMudarDescricao, ativo, salvando, salvar, alternarAtivo, cancelar }: Props) {
    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Descrição (opcional)">
                        <input type="text" value={descricao} onChange={e => aoMudarDescricao(e.target.value)} />
                    </InputComRotulo>
                    <p className={styles.estado}>{ativo ? 'Menu ativo — aparece nas páginas que o usam.' : 'Menu inativo — some das páginas que o usam.'}</p>
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
                {ativo
                    ? <button type="button" data-variante="perigo" onClick={alternarAtivo} disabled={salvando}>Inativar menu</button>
                    : <button type="button" data-variante="secundario" onClick={alternarAtivo} disabled={salvando}>Ativar menu</button>}
                <button type="button" onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
