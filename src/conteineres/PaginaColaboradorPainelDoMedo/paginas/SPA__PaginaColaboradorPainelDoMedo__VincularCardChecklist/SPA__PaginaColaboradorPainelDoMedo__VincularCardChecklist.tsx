'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist/contexto';

// Sem AreaBotoes: a acao e clicar num candidato (inline); voltar e papel do fecharProps do header.
export default function SPA__PaginaColaboradorPainelDoMedo__VincularCardChecklist() {
    const { busca, setBusca, candidatos, salvando, rotuloObjetivoDoCard, vincular } = useContexto__PaginaColaboradorPainelDoMedo__VincularCardChecklist();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Vincular cartão como item de checklist">
                    <input type="text" autoFocus value={busca} onChange={evento => setBusca(evento.target.value)} placeholder="Buscar cartão por título (qualquer objetivo)…" />
                </InputComRotulo>
                <p className={styles.dica}>O item resultante conclui-se automaticamente quando o cartão vinculado for concluído.</p>
                <div className={styles.lista}>
                    {busca.trim() && candidatos.length === 0 && <p className={styles.estado}>Nenhum cartão encontrado.</p>}
                    {candidatos.map(candidato => (
                        <button key={candidato.id} className={styles.candidato} onClick={() => vincular(candidato.id)} disabled={salvando}>
                            {candidato.titulo}{rotuloObjetivoDoCard(candidato.id) ? ` ↗ ${rotuloObjetivoDoCard(candidato.id)}` : ''}
                        </button>
                    ))}
                </div>
            </ConteudoForm.AreaCorpo>
        </ConteudoForm>
    );
};
