'use client';

import styles from './styles.module.css';

import type { KeySerEmSala } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import type { RecompensaDescoberta } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

type OpcaoSelecionador = { value: string; label: string };

type Props = {
    nome: string;
    aoMudarNome: (nome: string) => void;
    descricaoInterna: string;
    aoMudarDescricaoInterna: (descricao: string) => void;
    idCapacidadeInata: number;
    aoMudarCapacidade: (id: number) => void;
    opcoesCapacidades: readonly OpcaoSelecionador[];
    recompensas: readonly RecompensaDescoberta[];
    adicionaRecompensa: () => void;
    removeRecompensa: (indice: number) => void;
    atualizaRecompensa: (indice: number, parcial: Partial<RecompensaDescoberta>) => void;
    opcoesNaoControlaveis: readonly OpcaoSelecionador[];
    opcoesObjetos: readonly OpcaoSelecionador[];
    salvar: () => void;
};

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigDescoberta({ nome, aoMudarNome, descricaoInterna, aoMudarDescricaoInterna, idCapacidadeInata, aoMudarCapacidade, opcoesCapacidades, recompensas, adicionaRecompensa, removeRecompensa, atualizaRecompensa, opcoesNaoControlaveis, opcoesObjetos, salvar }: Props) {
    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Nome">
                    <input type="text" value={nome} onChange={evento => aoMudarNome(evento.target.value)} />
                </InputComRotulo>

                <InputComRotulo rotulo="Descrição interna">
                    <input type="text" value={descricaoInterna} onChange={evento => aoMudarDescricaoInterna(evento.target.value)} />
                </InputComRotulo>

                <InputComRotulo rotulo="Interação (capacidade)">
                    <SelecionadorOpcoes opcoes={opcoesCapacidades} valor={idCapacidadeInata > 0 ? String(idCapacidadeInata) : null} onChange={valor => aoMudarCapacidade(valor ? Number(valor) : 0)} placeholder="Selecione…" isClearable={false} />
                </InputComRotulo>

                <InputComRotulo rotulo="Recompensas (o que é percebido ao passar a dificuldade)">
                    {recompensas.length === 0 && <p className={styles.vazio}>Nenhuma recompensa. Adicione ao menos uma.</p>}
                    {recompensas.map((recompensa, indice) => (
                        <div key={indice} className={styles.recompensa}>
                            <div className={styles.recompensa_cabecalho}>
                                <span className={styles.recompensa_titulo}>Recompensa {indice + 1}</span>
                                <button type="button" className={styles.botao_remover} onClick={() => removeRecompensa(indice)}>Remover</button>
                            </div>
                            <div className={styles.linha}>
                                <InputComRotulo rotulo="Dificuldade ≥">
                                    <InputNumerico value={recompensa.dificuldadeMinima} onChange={valor => atualizaRecompensa(indice, { dificuldadeMinima: valor })} />
                                </InputComRotulo>
                            </div>
                            <InputComRotulo rotulo="Percebe os Seres (não-controláveis)">
                                {opcoesNaoControlaveis.length === 0
                                    ? <p className={styles.vazio}>Adicione não-controláveis primeiro.</p>
                                    : <SelecionadorOpcoes opcoes={opcoesNaoControlaveis} valores={recompensa.keysSeresPercebidos} onChange={valores => atualizaRecompensa(indice, { keysSeresPercebidos: valores as KeySerEmSala[] })} placeholder="Nenhum" isMulti />}
                            </InputComRotulo>
                            <InputComRotulo rotulo="Percebe os Objetos">
                                {opcoesObjetos.length === 0
                                    ? <p className={styles.vazio}>Adicione objetos primeiro.</p>
                                    : <SelecionadorOpcoes opcoes={opcoesObjetos} valores={recompensa.keysInteragiveisPercebidos} onChange={valores => atualizaRecompensa(indice, { keysInteragiveisPercebidos: valores })} placeholder="Nenhum" isMulti />}
                            </InputComRotulo>
                        </div>
                    ))}
                    <button type="button" className={styles.botao_secundario} onClick={adicionaRecompensa}>Adicionar recompensa</button>
                </InputComRotulo>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar}>Salvar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
