import styles from './styles.module.css';

import { ROTULOS_TIPO_DESAFIO, TIPOS_DESAFIO, TIPOS_PARTIDA, type TipoDesafio, type TipoPartida } from 'types-nora-api';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Nova } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Nova/contexto';

const ROTULOS_TIPO_PARTIDA: Record<TipoPartida, string> = { MISSAO: 'Missão', DESAFIO: 'Desafio' };

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Nova() {
    const { formularioNovaPartida, tipo, setTipo, tipoDesafio, setTipoDesafio, podeSalvar, salvar } = useContexto__PaginaGameDesignerConfiguracaoPartida__Nova();
    const inputNome = formularioNovaPartida.input('nome');
    const erroNome = formularioNovaPartida.erro('nome');

    return (
        <section className={styles.formulario}>
            <label className={styles.campo}>
                <span>Nome da Partida</span>
                <input type="text" value={inputNome.value} onChange={inputNome.onChange} disabled={inputNome.disabled} maxLength={inputNome.maxLength} placeholder={inputNome.placeholder} />
                {erroNome && <small className={styles.erro}>{erroNome}</small>}
            </label>

            <label className={styles.campo}>
                <span>Tipo</span>
                <select value={tipo} onChange={evento => setTipo(evento.target.value as TipoPartida)} disabled={formularioNovaPartida.salvando}>
                    {TIPOS_PARTIDA.map(opcao => <option key={opcao} value={opcao}>{ROTULOS_TIPO_PARTIDA[opcao]}</option>)}
                </select>
            </label>

            {tipo === 'DESAFIO' && (
                <label className={styles.campo}>
                    <span>Categoria do Desafio</span>
                    <select value={tipoDesafio} onChange={evento => setTipoDesafio(evento.target.value as TipoDesafio)} disabled={formularioNovaPartida.salvando}>
                        {TIPOS_DESAFIO.map(opcao => <option key={opcao} value={opcao}>{ROTULOS_TIPO_DESAFIO[opcao]}</option>)}
                    </select>
                </label>
            )}

            <div className={styles.acoes}>
                <button type="button" className={styles.botao_principal} onClick={() => void salvar()} disabled={!podeSalvar}>{formularioNovaPartida.salvando ? 'Criando…' : 'Criar Partida'}</button>
            </div>
        </section>
    );
};
