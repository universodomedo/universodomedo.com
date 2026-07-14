'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import { useContexto__PaginaAdminSalasChat__FormularioSala } from 'Contextos/Contexto__PaginaAdminSalasChat__FormularioSala/contexto';

export default function SPA__PaginaAdminSalasChat__FormularioSala() {
    const { form, ehEdicao, salvando, erro, podeSalvar, setCampo, salvar, trancada, definirTrancada, cancelar } = useContexto__PaginaAdminSalasChat__FormularioSala();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.grade}>
                    <InputComRotulo rotulo="Nome *" classname={styles.campo_largo}>
                        <input type="text" value={form.nome} onChange={e => setCampo('nome', e.target.value)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Leitura pública">
                        <AlternaOpcao opcao={form.leituraPublica} onChange={valor => setCampo('leituraPublica', valor)} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Escrita pública">
                        <AlternaOpcao opcao={form.escritaPublica} onChange={valor => setCampo('escritaPublica', valor)} />
                    </InputComRotulo>
                    {ehEdicao && (
                        <InputComRotulo rotulo="Trancada">
                            <AlternaOpcao opcao={trancada} onChange={definirTrancada} />
                        </InputComRotulo>
                    )}
                    {erro && <p className={styles.erro}>{erro}</p>}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
                <button type="button" onClick={salvar} disabled={!podeSalvar}>{salvando ? 'Salvando...' : (ehEdicao ? 'Salvar' : 'Criar Sala')}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
