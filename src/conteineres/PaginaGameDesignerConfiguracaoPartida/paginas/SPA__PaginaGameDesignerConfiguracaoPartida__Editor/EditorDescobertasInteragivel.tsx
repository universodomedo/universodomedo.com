'use client';

import styles from './editorDescobertas.module.css';

import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import type { Descoberta, Recompensa } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

type OpcaoSelecionador = { value: string; label: string };

type Props = {
    descobertas: readonly Descoberta[];
    aoMudarDescobertas: (descobertas: Descoberta[]) => void;
    opcoesCapacidades: readonly OpcaoSelecionador[];
    opcoesInteragiveis: readonly OpcaoSelecionador[];
};

// Editor das Descobertas que MORAM neste Interagivel (afford de Percepcao deriva daqui): cada descoberta = uma capacidade que, testada com dificuldade, revela outros Interagiveis. Controlado sobre a lista bufferizada do config do Interagivel.
export function EditorDescobertasInteragivel({ descobertas, aoMudarDescobertas, opcoesCapacidades, opcoesInteragiveis }: Props) {
    function atualizaDescoberta(indice: number, parcial: Partial<Descoberta>): void { aoMudarDescobertas(descobertas.map((descoberta, i) => i === indice ? { ...descoberta, ...parcial } : descoberta)); };
    function adicionaDescoberta(): void { aoMudarDescobertas([...descobertas, { nome: '', descricaoInterna: '', idCapacidadeInata: 0, recompensas: [] }]); };
    function removeDescoberta(indice: number): void { aoMudarDescobertas(descobertas.filter((_, i) => i !== indice)); };

    return (
        <InputComRotulo rotulo="Descobertas (o que se descobre percebendo este interagível)">
            {descobertas.length === 0 && <p className={styles.vazio}>Nenhuma descoberta — este interagível não entrega nada ao ser percebido.</p>}
            {descobertas.map((descoberta, indice) => (
                <div key={indice} className={styles.descoberta}>
                    <div className={styles.cabecalho}>
                        <span className={styles.titulo}>Descoberta {indice + 1}</span>
                        <button type="button" className={styles.botao_remover} onClick={() => removeDescoberta(indice)}>Remover</button>
                    </div>
                    <InputComRotulo rotulo="Nome">
                        <input type="text" value={descoberta.nome} onChange={evento => atualizaDescoberta(indice, { nome: evento.target.value })} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Descrição interna">
                        <input type="text" value={descoberta.descricaoInterna} onChange={evento => atualizaDescoberta(indice, { descricaoInterna: evento.target.value })} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Interação (capacidade)">
                        <SelecionadorOpcoes opcoes={opcoesCapacidades} valor={descoberta.idCapacidadeInata > 0 ? String(descoberta.idCapacidadeInata) : null} onChange={valor => atualizaDescoberta(indice, { idCapacidadeInata: valor ? Number(valor) : 0 })} placeholder="Selecione…" isClearable={false} />
                    </InputComRotulo>
                    <EditorRecompensas recompensas={descoberta.recompensas} opcoesInteragiveis={opcoesInteragiveis} aoMudar={recompensas => atualizaDescoberta(indice, { recompensas })} />
                </div>
            ))}
            <button type="button" className={styles.botao_secundario} onClick={adicionaDescoberta}>Adicionar descoberta</button>
        </InputComRotulo>
    );
};

function EditorRecompensas({ recompensas, opcoesInteragiveis, aoMudar }: { recompensas: readonly Recompensa[]; opcoesInteragiveis: readonly OpcaoSelecionador[]; aoMudar: (recompensas: Recompensa[]) => void; }) {
    function atualiza(indice: number, parcial: Partial<Recompensa>): void { aoMudar(recompensas.map((recompensa, i) => i === indice ? { ...recompensa, ...parcial } : recompensa)); };
    function adiciona(): void { aoMudar([...recompensas, { dificuldadeMinima: 0, chavesReveladas: [] }]); };
    function remove(indice: number): void { aoMudar(recompensas.filter((_, i) => i !== indice)); };

    return (
        <InputComRotulo rotulo="Recompensas (o que se revela ao passar a dificuldade)">
            {recompensas.length === 0 && <p className={styles.vazio}>Nenhuma recompensa. Adicione ao menos uma.</p>}
            {recompensas.map((recompensa, indice) => (
                <div key={indice} className={styles.recompensa}>
                    <div className={styles.cabecalho}>
                        <span className={styles.titulo}>Recompensa {indice + 1}</span>
                        <button type="button" className={styles.botao_remover} onClick={() => remove(indice)}>Remover</button>
                    </div>
                    <div className={styles.linha}>
                        <InputComRotulo rotulo="Dificuldade ≥">
                            <InputNumerico value={recompensa.dificuldadeMinima} onChange={valor => atualiza(indice, { dificuldadeMinima: valor })} />
                        </InputComRotulo>
                    </div>
                    <InputComRotulo rotulo="Revela os interagíveis">
                        {opcoesInteragiveis.length === 0
                            ? <p className={styles.vazio}>Adicione outros interagíveis primeiro.</p>
                            : <SelecionadorOpcoes opcoes={opcoesInteragiveis} valores={recompensa.chavesReveladas} onChange={valores => atualiza(indice, { chavesReveladas: valores })} placeholder="Nenhum" isMulti />}
                    </InputComRotulo>
                </div>
            ))}
            <button type="button" className={styles.botao_secundario} onClick={adiciona}>Adicionar recompensa</button>
        </InputComRotulo>
    );
};
