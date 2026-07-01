import styles from './styles.module.css';

import { TIPOS_CATALOGO_PARTIDA, type TipoCatalogoPartida } from 'types-nora-api';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { useContexto__PaginaGameDesignerCatalogosPartida__Nova } from 'Contextos/Contexto__PaginaGameDesignerCatalogosPartida__Nova/contexto';

const ROTULOS_TIPO_CATALOGO: Record<TipoCatalogoPartida, string> = { PADRAO: 'Padrão (lista de Partidas)', DESAFIOS: 'Desafios (subgrupos por tipo)' };

export default function SPA__PaginaGameDesignerCatalogosPartida__Nova() {
    const { formularioNovoCatalogo, tipo, setTipo, podeSalvar, salvar } = useContexto__PaginaGameDesignerCatalogosPartida__Nova();
    const inputNome = formularioNovoCatalogo.input('nome');
    const erroNome = formularioNovoCatalogo.erro('nome');

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <section className={styles.formulario}>
                    <label className={styles.campo}>
                        <span>Nome do Catálogo</span>
                        <input type="text" value={inputNome.value} onChange={inputNome.onChange} disabled={inputNome.disabled} maxLength={inputNome.maxLength} placeholder={inputNome.placeholder} />
                        {erroNome && <small className={styles.erro}>{erroNome}</small>}
                    </label>

                    <label className={styles.campo}>
                        <span>Tipo</span>
                        <select value={tipo} onChange={evento => setTipo(evento.target.value as TipoCatalogoPartida)} disabled={formularioNovoCatalogo.salvando}>
                            {TIPOS_CATALOGO_PARTIDA.map(opcao => <option key={opcao} value={opcao}>{ROTULOS_TIPO_CATALOGO[opcao]}</option>)}
                        </select>
                    </label>
                </section>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={() => void salvar()} disabled={!podeSalvar}>{formularioNovoCatalogo.salvando ? 'Criando…' : 'Criar Catálogo'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
