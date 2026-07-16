'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__AdicionarDependencia() {
    const { busca, setBusca, candidatos, salvando, rotuloObjetivoDoCard, adicionar, cancelar } = useContexto__PaginaColaboradorPainelDoMedo__AdicionarDependencia();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Este card precisa de">
                    <input type="text" autoFocus value={busca} onChange={evento => setBusca(evento.target.value)} placeholder="Buscar card por título (qualquer objetivo)…" />
                </InputComRotulo>
                <div className={styles.lista}>
                    {busca.trim() && candidatos.length === 0 && <p className={styles.estado}>Nenhum card encontrado.</p>}
                    {candidatos.map(candidato => (
                        <button key={candidato.id} className={styles.candidato} onClick={() => adicionar(candidato.id)} disabled={salvando}>
                            {candidato.titulo}{rotuloObjetivoDoCard(candidato.id) ? ` ↗ ${rotuloObjetivoDoCard(candidato.id)}` : ''}
                        </button>
                    ))}
                </div>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
