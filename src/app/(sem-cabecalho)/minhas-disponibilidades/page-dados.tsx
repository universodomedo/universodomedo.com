'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import { DadosMinhasDisponibilidades, DisponibilidadeUsuarioDto } from 'types-nora-api';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import { dds, obtemDiaDaSemanaPorExtensoPorDDS } from 'Helpers/diasSemana';
import { salvaDisponibilidadeDeUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export default function MinhaDisponibilidadeComDados({ listaDisponibilidades }: { listaDisponibilidades: DisponibilidadeUsuarioDto[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    const dadosMinhasDisponibilidades = new DadosMinhasDisponibilidades(listaDisponibilidades);

    return (
        <div id={styles.recipiente_pagina_disponibilidades}>
            <div id={styles.recipiente_disponibilidade_superior}>
                <h1>Minha Disponibilidade</h1>
                <button id={styles.botao_configurar_disponibilidades} onClick={openModal}>Configurar Disponibilidades</button>
            </div>
            <div id={styles.recipiente_disponibilidade_inferior}>
                <div id={styles.recipiente_dados_disponibilidade}>
                    <VisualizacaoDados dadosMinhasDisponibilidades={dadosMinhasDisponibilidades} />
                </div>
            </div>

            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Content title={'Configurando Disponibilidades'}>
                    <ConteudoModal listaDisponibilidades={listaDisponibilidades} />
                </Modal.Content>
            </Modal>
        </div>
    );
};

function VisualizacaoDados({ dadosMinhasDisponibilidades }: { dadosMinhasDisponibilidades: DadosMinhasDisponibilidades }) {
    const disponibilidadesPorExtenso: Record<number, string[]>[] = dadosMinhasDisponibilidades.disponibilidadePorExtenso;

    if (disponibilidadesPorExtenso.length <= 0) return (<h1>Não há Disponibilidades Configuradas em seu Usuário</h1>);

    return (<CorpoDisponibilidades disponibilidadesPorExtenso={disponibilidadesPorExtenso} />);
};

function CorpoDisponibilidades({ disponibilidadesPorExtenso }: { disponibilidadesPorExtenso: Record<number, string[]>[] }) {
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const encontrarDisponibilidade = (dia: number) => {
        if (!disponibilidadesPorExtenso || !Array.isArray(disponibilidadesPorExtenso)) {
            return ['Sem Disponibilidade'];
        }

        const disponibilidade = disponibilidadesPorExtenso.find(item => item[dia]);
        return disponibilidade ? disponibilidade[dia] : ['Sem Disponibilidade'];
    };

    return (
        <>
            <div className={styles.linha}>
                {diasDaSemana.map((dia, index) => (
                    <div key={index} className={styles.celula_cabecalho}>
                        <h2>{dia}</h2>
                    </div>
                ))}
            </div>
            <div className={styles.linha}>
                {diasDaSemana.map((_, index) => (
                    <div key={index} className={styles.celula}>
                        {encontrarDisponibilidade(index).map((disponibilidade, indexDisponibilidade) => (
                            <h2 key={indexDisponibilidade}>{disponibilidade}</h2>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

function ConteudoModal({ listaDisponibilidades }: { listaDisponibilidades: DisponibilidadeUsuarioDto[] }) {
    const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeUsuarioDto[]>(listaDisponibilidades);
    const [diaDaSemana, setDiaDaSemana] = useState<number>(1);
    const [horaInicio, setHoraInicio] = useState<string>('08:00');
    const [horaFim, setHoraFim] = useState<string>('17:00');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const adicionarDisponibilidade = () => {
        // const novaDisponibilidade = new DisponibilidadeUsuario(diaDaSemana, horaInicio, horaFim);
        // setDisponibilidades([...disponibilidades, novaDisponibilidade]);
    };

    const removerDisponibilidade = (index: number) => {
        const novasDisponibilidades = disponibilidades.filter((_, i) => i !== index);
        setDisponibilidades(novasDisponibilidades);
    };

    const trataListaDisponibilidades = () => {
        const disponibilidadesTratadas: DisponibilidadeUsuarioDto[] = [];

        const disponibilidadesPorDia: Record<number, DisponibilidadeUsuarioDto[]> = {};

        // Agrupar disponibilidades por dia da semana
        disponibilidades.forEach((disp) => {
            if (!disponibilidadesPorDia[disp.diaDaSemana]) {
                disponibilidadesPorDia[disp.diaDaSemana] = [];
            }
            disponibilidadesPorDia[disp.diaDaSemana].push(disp);
        });

        // Ordenar e mesclar disponibilidades para cada dia
        Object.keys(disponibilidadesPorDia).forEach((dia) => {
            const lista = disponibilidadesPorDia[Number(dia)];

            // Ordenar pelo horário de início
            lista.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

            const mescladas: DisponibilidadeUsuarioDto[] = [];

            lista.forEach((disp) => {
                if (mescladas.length === 0) {
                    mescladas.push(disp);
                    return;
                }

                const ultima = mescladas[mescladas.length - 1];

                if (disp.horaInicio <= ultima.horaFim) {
                    // Mesclar horários sobrepostos
                    ultima.horaFim = disp.horaFim > ultima.horaFim ? disp.horaFim : ultima.horaFim;
                } else {
                    mescladas.push(disp);
                }
            });

            disponibilidadesTratadas.push(...mescladas);
        });

        return disponibilidadesTratadas;
    };

    const salvarDisponibilidades = async () => {
        console.log('vou enviar');
        console.log(trataListaDisponibilidades());
        await salvaDisponibilidadeDeUsuario(trataListaDisponibilidades());
        // window.location.reload();
    }

    return (
        <div id={styles.recipiente_modal_disponibilidades}>
            <div id={styles.recipiente_disponibilidades_criadas}>
                <h3>Disponibilidades Atuais</h3>
                {disponibilidades.length <= 0 ? (
                    <h2>Nenhum Disponibilidade Configurada</h2>
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
                            {disponibilidades.map((disp, index) => (
                                <tr key={index}>
                                    <td>{obtemDiaDaSemanaPorExtensoPorDDS(disp.diaDaSemana as dds)}</td>
                                    <td>{disp.horaInicio}</td>
                                    <td>{disp.horaFim}</td>
                                    <td>
                                        <button onClick={() => removerDisponibilidade(index)}>Remover</button>
                                    </td>
                                </tr>
                            ))}
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
                            <option value={0}>Domingo</option>
                            <option value={1}>Segunda-feira</option>
                            <option value={2}>Terça-feira</option>
                            <option value={3}>Quarta-feira</option>
                            <option value={4}>Quinta-feira</option>
                            <option value={5}>Sexta-feira</option>
                            <option value={6}>Sábado</option>
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
                    <button id={styles.botao_adicionar_nova_disponibilidade} onClick={adicionarDisponibilidade} disabled={horaFim <= horaInicio}>Adicionar</button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button onClick={salvarDisponibilidades} disabled={disponibilidades.length <= 0 || isLoading}>
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
};