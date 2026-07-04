import styles from './styles.module.css';

import { ROTULOS_TIPO_DESAFIO, TIPOS_DESAFIO, TIPOS_PARTIDA, type TipoDesafio, type TipoPartida } from 'types-nora-api';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Nova } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Nova/contexto';

const ROTULOS_TIPO_PARTIDA: Record<TipoPartida, string> = { MISSAO: 'Missão', DESAFIO: 'Desafio' };
const OPCOES_TIPO_PARTIDA = TIPOS_PARTIDA.map(opcao => ({ value: opcao, label: ROTULOS_TIPO_PARTIDA[opcao] }));
const OPCOES_TIPO_DESAFIO = TIPOS_DESAFIO.map(opcao => ({ value: opcao, label: ROTULOS_TIPO_DESAFIO[opcao] }));

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Nova() {
    const { formularioNovaPartida, tipo, setTipo, tipoDesafio, setTipoDesafio, podeSalvar, salvar } = useContexto__PaginaGameDesignerConfiguracaoPartida__Nova();
    const inputNome = formularioNovaPartida.input('nome');
    const erroNome = formularioNovaPartida.erro('nome');

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <section className={styles.formulario}>
                    <InputComRotulo rotulo="Nome da Partida">
                        <input type="text" value={inputNome.value} onChange={inputNome.onChange} disabled={inputNome.disabled} maxLength={inputNome.maxLength} placeholder={inputNome.placeholder} />
                        {erroNome && <small className={styles.erro}>{erroNome}</small>}
                    </InputComRotulo>

                    <InputComRotulo rotulo="Tipo">
                        <SelecionadorOpcoes opcoes={OPCOES_TIPO_PARTIDA} valor={tipo} onChange={valor => { if (valor) setTipo(valor as TipoPartida); }} isClearable={false} disabled={formularioNovaPartida.salvando} />
                    </InputComRotulo>

                    {tipo === 'DESAFIO' && (
                        <InputComRotulo rotulo="Categoria do Desafio">
                            <SelecionadorOpcoes opcoes={OPCOES_TIPO_DESAFIO} valor={tipoDesafio} onChange={valor => { if (valor) setTipoDesafio(valor as TipoDesafio); }} isClearable={false} disabled={formularioNovaPartida.salvando} />
                        </InputComRotulo>
                    )}
                </section>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={() => void salvar()} disabled={!podeSalvar}>{formularioNovaPartida.salvando ? 'Criando…' : 'Criar Partida'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
