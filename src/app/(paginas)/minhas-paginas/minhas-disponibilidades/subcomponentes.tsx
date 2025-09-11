'use client';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { DiaDaSemana, JanelaDisponibilidade, MomentoFormatado24, obtemDiaDaSemanaPorExtensoPorDDS } from 'types-nora-api';

import { useContextoDisponibilidadeUsuario } from 'Contextos/ContextoDisponibilidadeUsuario/contexto.tsx';

export function ListagemMinhasDisponibilidades() {
    const { minhaDisponibilidade } = useContextoDisponibilidadeUsuario();

    return (
        <div id={styles.recipiente_dados_disponibilidade}>
            {minhaDisponibilidade?.disponibilidades.map(disponibilidade => (
                <div key={disponibilidade.dds} className={styles.coluna_dds}>
                    <div className={styles.celula_cabecalho}><h3>{obtemDiaDaSemanaPorExtensoPorDDS(disponibilidade.dds)}</h3></div>
                    <div className={styles.celula}>
                        {disponibilidade.disponibilidades.length < 1 ? (
                            <h4>Sem Disponibilidade</h4>
                        ) : (
                            <>
                                {disponibilidade.disponibilidades.map((janelaDisponibilidade, index) => (
                                    <h4 key={index}>— {janelaDisponibilidade.horaInicio} até {janelaDisponibilidade.horaFim}</h4>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export function ConteudoModal() {
    const { minhaDisponibilidade, listaDisponibilidadeEmAtualizacao, inicializaDisponibilidadeEmAtualizacao, limpaDisponibilidadeEmAtualizacao, adicionarDisponibilidade, removerDisponibilidade } = useContextoDisponibilidadeUsuario();
    const [diaDaSemana, setDiaDaSemana] = useState<number>(1);
    const [horaInicio, setHoraInicio] = useState<string>('08:00');
    const [horaFim, setHoraFim] = useState<string>('17:00');

    const handleAdicionarDisponibilidade = (diaDaSemana: DiaDaSemana, janelaDisponibilidade: JanelaDisponibilidade) => {
        const mensagem = adicionarDisponibilidade(diaDaSemana, janelaDisponibilidade);
        
        if (mensagem) {
            alert(mensagem);
        }
    };

    useEffect(() => {
        inicializaDisponibilidadeEmAtualizacao();
    }, []);

    return (
        <div id={styles.recipiente_modal_disponibilidades}>
            <div id={styles.recipiente_disponibilidades_criadas}>
                <h2>Disponibilidades Atuais</h2>
                {!listaDisponibilidadeEmAtualizacao || listaDisponibilidadeEmAtualizacao.length < 1 ? (
                    <h2>Disponibilidade não Configurada</h2>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Dia da Semana</th>
                                <th>Hora Início</th>
                                <th>Hora Fim</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaDisponibilidadeEmAtualizacao.flatMap((disponibilidadeDDS, index) =>
                                disponibilidadeDDS.disponibilidades.map((janela, indexJ) => (
                                    <tr key={`${index}:${indexJ}`}>
                                        <td>{obtemDiaDaSemanaPorExtensoPorDDS(disponibilidadeDDS.dds)}</td>
                                        <td>{janela.horaInicio}</td>
                                        <td>{janela.horaFim}</td>
                                        <td>
                                            <button onClick={() => removerDisponibilidade(disponibilidadeDDS.dds, janela)}>Remover</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div id={styles.recipiente_adicao_disponibilidade}>
                <h2>Adicionar Nova Disponibilidade</h2>
                <div id={styles.recipiente_informaacoes_adicionar_disponibilidade}>
                    <div>
                        <h3>Dia da Semana</h3>
                        <select value={diaDaSemana} onChange={(e) => setDiaDaSemana(Number(e.target.value))}>
                            {Object.values(DiaDaSemana).filter(value => typeof value === 'number').map(dds => <option key={dds} value={dds}>{obtemDiaDaSemanaPorExtensoPorDDS(dds as DiaDaSemana)}</option>)}
                        </select>
                    </div>
                    <div>
                        <h3>Hora Início</h3>
                        <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                    </div>
                    <div>
                        <h3>Hora Fim</h3>
                        <input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
                    </div>
                    <button id={styles.botao_adicionar_nova_disponibilidade} onClick={() => handleAdicionarDisponibilidade(diaDaSemana, { horaInicio: horaInicio as MomentoFormatado24, horaFim: horaFim as MomentoFormatado24 })} disabled={horaFim <= horaInicio}>Adicionar</button>
                </div>
            </div>
        </div>
    );
};