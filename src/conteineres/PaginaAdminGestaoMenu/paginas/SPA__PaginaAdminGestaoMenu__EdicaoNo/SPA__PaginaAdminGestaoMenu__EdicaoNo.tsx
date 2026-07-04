'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';

type Props = {
    titulo: string;
    aoMudarTitulo: (valor: string) => void;
    visivel: boolean;
    salvando: boolean;
    salvar: () => Promise<void>;
    alternarVisivel: () => Promise<void>;
    cancelar: () => void;
};

export default function SPA__PaginaAdminGestaoMenu__EdicaoNo({ titulo, aoMudarTitulo, visivel, salvando, salvar, alternarVisivel, cancelar }: Props) {
    const podeSalvar = titulo.trim().length > 0 && !salvando;

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Título *">
                        <input type="text" value={titulo} onChange={e => aoMudarTitulo(e.target.value)} />
                    </InputComRotulo>
                    <p className={styles.estado}>{visivel ? 'Item visível no menu.' : 'Item oculto (inativo) no menu.'}</p>
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
                {visivel
                    ? <button type="button" data-variante="perigo" onClick={alternarVisivel} disabled={salvando}>Inativar item</button>
                    : <button type="button" data-variante="secundario" onClick={alternarVisivel} disabled={salvando}>Ativar item</button>}
                <button type="button" onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : 'Salvar'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
