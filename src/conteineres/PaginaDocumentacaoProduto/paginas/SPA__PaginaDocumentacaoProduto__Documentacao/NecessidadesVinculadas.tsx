'use client';

import styles from './necessidadesVinculadas.module.css';

import { useMemo, useState } from 'react';

import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import type { Contexto__PaginaDocumentacaoProduto__Documentacao__Props } from 'Contextos/Contexto__PaginaDocumentacaoProduto__Documentacao/contexto';

type Props = Pick<Contexto__PaginaDocumentacaoProduto__Documentacao__Props, 'listagemVinculos' | 'necessidadesDisponiveis' | 'nomePersonaPorId' | 'vincular' | 'alternarAtendida' | 'removerVinculo'>;

// Seção de vínculos página <-> necessidade do verbete: lista o que a página serve (com motivo e estado atendida) e permite vincular/desvincular.
// Escolha da necessidade = dropdown (SelecionadorOpcoes), sem abrir subfluxo/listagem inline que mude o visual da página.
export default function NecessidadesVinculadas({ listagemVinculos, necessidadesDisponiveis, nomePersonaPorId, vincular, alternarAtendida, removerVinculo }: Props) {
    const [idEscolhida, setIdEscolhida] = useState<number | null>(null);
    const [motivo, setMotivo] = useState<string>('');
    const [atendida, setAtendida] = useState<boolean>(false);
    const [vinculando, setVinculando] = useState<boolean>(false);

    const opcoesNecessidades = useMemo<OpcaoSelecionador[]>(() => necessidadesDisponiveis.map(necessidade => ({ value: String(necessidade.id), label: `${necessidade.titulo} — ${nomePersonaPorId(necessidade.fkPersonasId)}` })), [necessidadesDisponiveis, nomePersonaPorId]);

    const podeVincular = idEscolhida !== null && motivo.trim().length >= 1 && !vinculando;

    async function confirmarVinculo(): Promise<void> {
        if (idEscolhida === null || motivo.trim().length < 1) return;
        setVinculando(true);
        try {
            await vincular(idEscolhida, motivo.trim(), atendida);
            setIdEscolhida(null);
            setMotivo('');
            setAtendida(false);
        } finally {
            setVinculando(false);
        }
    };

    return (
        <section className={styles.secao}>
            <h4 className={styles.titulo_secao}>Necessidades que esta página serve</h4>
            {listagemVinculos.registros.length === 0 && <p className={styles.vazio}>Nenhuma necessidade vinculada ainda.</p>}
            <ul className={styles.lista}>
                {listagemVinculos.registros.map(vinculo => (
                    <li key={vinculo.id} className={styles.vinculo}>
                        <div className={styles.identidade}>
                            <strong className={styles.titulo}>{vinculo.necessidade.titulo}</strong>
                            <span className={styles.persona}>{nomePersonaPorId(vinculo.necessidade.fkPersonasId)}</span>
                        </div>
                        <p className={styles.motivo}>{vinculo.motivo}</p>
                        <div className={styles.acoes_vinculo}>
                            <span className={styles.rotulo_atendida}>Atendida</span>
                            <AlternaOpcao opcao={vinculo.atendida} onChange={() => alternarAtendida(vinculo)} />
                            <button type="button" className={styles.botao_leve} onClick={() => removerVinculo(vinculo.id)}>Desvincular</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.form_vinculo}>
                <InputComRotulo rotulo="Vincular necessidade">
                    <SelecionadorOpcoes opcoes={opcoesNecessidades} valor={idEscolhida !== null ? String(idEscolhida) : null} onChange={valor => setIdEscolhida(valor !== null ? Number(valor) : null)} placeholder={opcoesNecessidades.length > 0 ? 'Escolha uma necessidade...' : 'Nenhuma necessidade disponível — cadastre em Personas & Necessidades'} isClearable />
                </InputComRotulo>
                {idEscolhida !== null && (
                    <>
                        <InputComRotulo rotulo="Por que esta página serve essa necessidade? *">
                            <textarea rows={3} value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="O motivo é o coração do vínculo — obrigatório." />
                        </InputComRotulo>
                        <div className={styles.linha_atendida}>
                            <span className={styles.rotulo_atendida}>Já atendida hoje?</span>
                            <AlternaOpcao opcao={atendida} onChange={setAtendida} />
                        </div>
                        <div className={styles.acoes_form}>
                            <button type="button" className={styles.botao_leve} onClick={() => { setIdEscolhida(null); setMotivo(''); setAtendida(false); }} disabled={vinculando}>Cancelar</button>
                            <button type="button" className={styles.botao_leve} onClick={confirmarVinculo} disabled={!podeVincular}>{vinculando ? 'Vinculando...' : 'Vincular necessidade'}</button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};