'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import { useContexto__PaginaAdminCatalogoAssinatura__FormularioPasse } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura__FormularioPasse/contexto';

export default function SPA__PaginaAdminCatalogoAssinatura__FormularioPasse() {
    const { form, ehEdicao, salvando, erro, podeSalvar, setCampo, salvar, ativo, definirAtivo, cancelar } = useContexto__PaginaAdminCatalogoAssinatura__FormularioPasse();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Código interno *">
                        <input type="text" value={form.codigoInterno} onChange={e => setCampo('codigoInterno', e.target.value)} disabled={ehEdicao} placeholder="ex.: PASSE_JOGADOR" />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Nome *">
                        <input type="text" value={form.nome} onChange={e => setCampo('nome', e.target.value)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Descrição" classname={styles.campo_largo}>
                        <input type="text" value={form.descricao} onChange={e => setCampo('descricao', e.target.value)} />
                    </InputComRotulo>
                    {ehEdicao && (
                        <InputComRotulo rotulo="Ativo">
                            <AlternaOpcao opcao={ativo} onChange={definirAtivo} />
                        </InputComRotulo>
                    )}
                    {erro && <p className={styles.erro}>{erro}</p>}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
                <button type="button" onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : (ehEdicao ? 'Salvar' : 'Criar Passe')}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
