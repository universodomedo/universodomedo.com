'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__CriarEtiqueta() {
    const { nome, setNome, cor, setCor, corBorda, setCorBorda, bordaTransparente, setBordaTransparente, salvando, criar, cancelar } = useContexto__PaginaColaboradorPainelDoMedo__CriarEtiqueta();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Nome da etiqueta">
                    <input type="text" autoFocus value={nome} onChange={evento => setNome(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') criar(); }} placeholder="Ex.: Bug, Urgente, Frontend…" />
                </InputComRotulo>

                <span className={styles.previa} style={{ background: cor, border: `0.12em solid ${bordaTransparente ? 'transparent' : corBorda}` }}>{nome.trim() || 'Prévia'}</span>

                <div className={styles.linhaCor}>
                    <label className={styles.seletorCor}>
                        <input type="color" value={cor} onChange={evento => setCor(evento.target.value)} />
                        <span>Preenchimento</span>
                    </label>
                    <label className={`${styles.seletorCor} ${bordaTransparente ? styles.seletorCorDesativado : ''}`}>
                        <input type="color" value={corBorda} onChange={evento => setCorBorda(evento.target.value)} disabled={bordaTransparente} />
                        <span>Borda</span>
                    </label>
                    <label className={styles.checkboxTransparente}>
                        <input type="checkbox" checked={bordaTransparente} onChange={evento => setBordaTransparente(evento.target.checked)} />
                        Borda transparente
                    </label>
                </div>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={criar} disabled={salvando || !nome.trim()}>{salvando ? 'Criando...' : 'Criar etiqueta'}</button>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Voltar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
