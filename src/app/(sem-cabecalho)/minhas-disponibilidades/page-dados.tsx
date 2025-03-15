'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import { dds, obtemDiaDaSemanaPorExtendoPorDDS } from 'Helpers/diasSemana';

class DadosMinhasDisponibilidades {
    disponibilidades: DisponibilidadeUsuario[];

    constructor(disponibilidades: DisponibilidadeUsuario[]) {
        this.disponibilidades = disponibilidades;
    }

    get disponibilidadePorExtenso(): Record<number, string[]>[] {
        const agrupadoPorDia: Record<number, string[]> = {};

        // Agrupa as disponibilidades por dia da semana
        this.disponibilidades.forEach(disponibilidade => {
            const { diaDaSemana, horaInicio, horaFim } = disponibilidade;
            const textoDisponibilidade = `Dísponível entre ${horaInicio} e ${horaFim}`;

            if (!agrupadoPorDia[diaDaSemana]) {
                agrupadoPorDia[diaDaSemana] = [];
            }

            agrupadoPorDia[diaDaSemana].push(textoDisponibilidade);
        });

        // Converte o objeto agrupado em uma lista de objetos
        return Object.keys(agrupadoPorDia).map(dia => {
            const diaNumero = Number(dia);
            return { [diaNumero]: agrupadoPorDia[diaNumero] };
        });
    }
}

class DisponibilidadeUsuario {
    diaDaSemana: number;
    horaInicio: string;
    horaFim: string;
    constructor(diaDaSemana: number, horaInicio: string, horaFim: string) {
        this.diaDaSemana = diaDaSemana;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
    }
}

export default function MinhaDisponibilidadeComDados({ listaDisponibilidades }: { listaDisponibilidades: DisponibilidadeUsuario[] }) {
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
                    <ConteudoModal />
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

function ConteudoModal() {
    const [disponibilidades, setDisponibilidades] = useState<DisponibilidadeUsuario[]>([
        new DisponibilidadeUsuario(1, '01:00', '02:30'),
    ]);
    const [diaDaSemana, setDiaDaSemana] = useState<number>(1);
    const [horaInicio, setHoraInicio] = useState<string>('08:00');
    const [horaFim, setHoraFim] = useState<string>('17:00');
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const adicionarDisponibilidade = () => {
        const novaDisponibilidade = new DisponibilidadeUsuario(diaDaSemana, horaInicio, horaFim);
        setDisponibilidades([...disponibilidades, novaDisponibilidade]);
    };

    const removerDisponibilidade = (index: number) => {
        const novasDisponibilidades = disponibilidades.filter((_, i) => i !== index);
        setDisponibilidades(novasDisponibilidades);
    };

    const salvarDisponibilidades = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/salvarDisponibilidades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(disponibilidades),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Erro ao salvar disponibilidades.');
            }
        } catch (error) {
            console.error('Erro ao salvar disponibilidades:', error);
            alert('Erro ao salvar disponibilidades.');
        } finally {
            setIsLoading(false);
        }
    };

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
                                    <td>{obtemDiaDaSemanaPorExtendoPorDDS(disp.diaDaSemana as dds)}</td>
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
                <h3>Adicionar Nova Disponibilidade</h3>
                <div>
                    <label>
                        Dia da Semana:
                        <select value={diaDaSemana} onChange={(e) => setDiaDaSemana(Number(e.target.value))}>
                            <option value={1}>Segunda-feira</option>
                            <option value={2}>Terça-feira</option>
                            <option value={3}>Quarta-feira</option>
                            <option value={4}>Quinta-feira</option>
                            <option value={5}>Sexta-feira</option>
                            <option value={6}>Sábado</option>
                            <option value={7}>Domingo</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Hora Início:
                        <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Hora Fim:
                        <input type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
                    </label>
                    <br />
                    <button onClick={adicionarDisponibilidade}>Adicionar</button>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <button onClick={salvarDisponibilidades} disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
};