'use client';

import styles from './styles.module.css';

import { type CSSProperties } from 'react';
import { TIPOS_INTERACAO } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes, { type OpcaoSelecionador } from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { corDoTipoInteracao } from 'Componentes/EditorMembros/tiposInteracaoVisual';
import type { CampoParametroCapacidadeEditor, MeioLocomocaoEditor } from 'Componentes/EditorMembros/membrosSerJogavelEditor';
import { useContexto__EditorEstrutura__Membro, type CapacidadeDoMembroComParametros } from 'Contextos/Contexto__EditorEstrutura__Membro/contexto';

// Subvista do Membro: nome + Capacidades Inatas (cada uma com seus parâmetros — a faculdade); as ações listam como resumo e abrem na subvista específica de Ação.
export default function SPA__EditorEstrutura__Membro() {
    const { membro, salvando, opcoesCapacidades, idsCapacidadesSelecionadas, capacidadesDoMembro, tiposVisaoOpcoes, tiposVisaoCarregando, acoesDoMembro, podeAdicionarAcao, atualizaNome, aoMudarCapacidades, atualizaParametro, atualizaMeioLocomocao, abreAcao, abreNovaAcao, removeMembroEVolta, concluir } = useContexto__EditorEstrutura__Membro();

    const capacidadesComParametros = capacidadesDoMembro.filter(capacidadeTemParametros);

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.membro}>
                    <InputComRotulo rotulo="Nome do Membro">
                        <input type="text" value={membro.nome} onChange={evento => atualizaNome(evento.target.value)} disabled={salvando} />
                    </InputComRotulo>

                    <InputComRotulo rotulo="Capacidades Inatas">
                        <SelecionadorOpcoes isMulti opcoes={opcoesCapacidades} valores={idsCapacidadesSelecionadas} onChange={aoMudarCapacidades} disabled={salvando} placeholder="Selecione..." />
                    </InputComRotulo>

                    {capacidadesComParametros.length > 0 && (
                        <div className={styles.bloco_capacidades}>
                            <h3>Parâmetros das Capacidades</h3>
                            {capacidadesComParametros.map(capacidade => (
                                <CamposParametrosCapacidade key={capacidade.idCapacidadeInata} capacidade={capacidade} salvando={salvando} tiposVisaoOpcoes={tiposVisaoOpcoes} tiposVisaoCarregando={tiposVisaoCarregando} atualizaParametro={atualizaParametro} atualizaMeioLocomocao={atualizaMeioLocomocao} />
                            ))}
                        </div>
                    )}

                    <div className={styles.cabecalho_acoes}>
                        <h3>Ações do Membro</h3>
                        <button type="button" className={styles.botao_adicionar} onClick={abreNovaAcao} disabled={!podeAdicionarAcao}>+ Ação</button>
                    </div>

                    {acoesDoMembro.length > 0
                        ? <div className={styles.lista_acoes}>
                            {acoesDoMembro.map(entrada => (
                                <button key={entrada.acao.idLocal} type="button" className={styles.linha_acao} onClick={() => abreAcao(entrada.acao.idLocal)} style={{ '--cor-tipo': corDoTipoInteracao(entrada.capacidade?.nomeInteracao) } as CSSProperties}>
                                    <span className={styles.nome_acao}>{entrada.acao.nome.trim() || '—'}</span>
                                    <span className={styles.capacidade_acao}>{entrada.capacidade?.nome ?? 'sem capacidade'}</span>
                                </button>
                            ))}
                        </div>
                        : <p className={styles.resumo_vazio}>Nenhuma ação neste membro.</p>}
                </div>
            </ConteudoForm.AreaCorpo>
            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={concluir} disabled={salvando}>Concluir</button>
                <button type="button" data-variante="perigo" onClick={removeMembroEVolta} disabled={salvando}>Remover Membro</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};

function capacidadeTemParametros(capacidade: CapacidadeDoMembroComParametros): boolean {
    return capacidade.nomeInteracao === TIPOS_INTERACAO.DANIFICAVEL.chave || capacidade.nomeInteracao === TIPOS_INTERACAO.VISUAL.chave || capacidade.nomeInteracao === TIPOS_INTERACAO.LOCOMOCAO.chave;
};

// Meio de Locomoção — opções fixas (só a lógica terrestre está implementada; aquático/aéreo são autoráveis pro modelo).
const OPCOES_MEIO_LOCOMOCAO: readonly OpcaoSelecionador[] = [
    { value: 'terrestre', label: 'Terrestre' },
    { value: 'aquatico', label: 'Aquático' },
    { value: 'aereo', label: 'Aéreo' },
];

function valorParaMeioLocomocao(valor: string | null): MeioLocomocaoEditor {
    return valor === 'terrestre' || valor === 'aquatico' || valor === 'aereo' ? valor : '';
};

type PropsCamposParametros = {
    capacidade: CapacidadeDoMembroComParametros;
    salvando: boolean;
    tiposVisaoOpcoes: readonly OpcaoSelecionador[];
    tiposVisaoCarregando: string | null;
    atualizaParametro: (idCapacidade: number, campo: CampoParametroCapacidadeEditor, valor: number | '') => void;
    atualizaMeioLocomocao: (idCapacidade: number, meio: MeioLocomocaoEditor) => void;
};

// Campos de parâmetro de UMA capacidade do membro, derivados do Tipo de Interação (Danificável → dano + alcance; Visual → alcance + tipo de visão + dependência; Locomoção → velocidade + meio).
function CamposParametrosCapacidade({ capacidade, salvando, tiposVisaoOpcoes, tiposVisaoCarregando, atualizaParametro, atualizaMeioLocomocao }: PropsCamposParametros) {
    const { idCapacidadeInata, nome, nomeInteracao, parametros } = capacidade;
    const numero = (valor: number | ''): number => typeof valor === 'number' ? valor : 0;

    return (
        <div className={styles.card_capacidade} style={{ '--cor-tipo': corDoTipoInteracao(nomeInteracao) } as CSSProperties}>
            <h4 className={styles.titulo_capacidade}>{nome}</h4>
            {nomeInteracao === TIPOS_INTERACAO.DANIFICAVEL.chave && (
                <>
                    <InputComRotulo rotulo="Dano">
                        <InputNumerico min={1} step={1} value={numero(parametros.dano)} onChange={valor => atualizaParametro(idCapacidadeInata, 'dano', valor)} disabled={salvando} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Alcance do Ataque (mm)">
                        <InputNumerico min={1} step={1} value={numero(parametros.alcanceAtaqueMilimetros)} onChange={valor => atualizaParametro(idCapacidadeInata, 'alcanceAtaqueMilimetros', valor)} disabled={salvando} />
                    </InputComRotulo>
                </>
            )}
            {nomeInteracao === TIPOS_INTERACAO.VISUAL.chave && (
                <>
                    <InputComRotulo rotulo="Alcance da Linha de Visão (mm)">
                        <InputNumerico min={1} step={1} value={numero(parametros.alcanceLinhaVisaoMilimetros)} onChange={valor => atualizaParametro(idCapacidadeInata, 'alcanceLinhaVisaoMilimetros', valor)} disabled={salvando} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Tipo de Visão">
                        <SelecionadorOpcoes opcoes={tiposVisaoOpcoes} valor={typeof parametros.idTipoVisao === 'number' ? String(parametros.idTipoVisao) : null} onChange={valor => atualizaParametro(idCapacidadeInata, 'idTipoVisao', valor === null ? '' : Number(valor))} disabled={salvando || !!tiposVisaoCarregando} placeholder={tiposVisaoCarregando ?? 'Selecione'} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Dependência de Iluminação (%)">
                        <InputNumerico min={0} max={100} step={1} value={numero(parametros.dependenciaIluminacaoPercentual)} onChange={valor => atualizaParametro(idCapacidadeInata, 'dependenciaIluminacaoPercentual', valor)} disabled={salvando} />
                    </InputComRotulo>
                </>
            )}
            {nomeInteracao === TIPOS_INTERACAO.LOCOMOCAO.chave && (
                <>
                    <InputComRotulo rotulo="Velocidade (mm/s)">
                        <InputNumerico min={1} step={1} value={numero(parametros.velocidadeLocomocaoMilimetrosPorSegundo)} onChange={valor => atualizaParametro(idCapacidadeInata, 'velocidadeLocomocaoMilimetrosPorSegundo', valor)} disabled={salvando} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Meio">
                        <SelecionadorOpcoes opcoes={OPCOES_MEIO_LOCOMOCAO} valor={parametros.meioLocomocao || null} onChange={valor => atualizaMeioLocomocao(idCapacidadeInata, valorParaMeioLocomocao(valor))} disabled={salvando} placeholder="Selecione" />
                    </InputComRotulo>
                </>
            )}
        </div>
    );
};
