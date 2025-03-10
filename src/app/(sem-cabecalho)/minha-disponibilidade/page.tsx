'use client';

import styles from './styles.module.css';

export default function MinhaDisponibilidade() {
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const disponibilidades = [
        { dia: 0, texto: 'Disponível entre 10:00 e 18:00' },
        { dia: 1, texto: 'Disponível entre 08:00 e 20:00' },
        { dia: 2, texto: 'Disponível entre 09:00 às 14:00 e entre 20:00 e 00:00' },
        { dia: 4, texto: 'Disponível entre 00:00 e 04:00' },
    ];

    // Função para encontrar a disponibilidade de um dia específico
    const encontrarDisponibilidade = (dia: number) => {
        const disponibilidade = disponibilidades.find(d => d.dia === dia);
        return disponibilidade ? disponibilidade.texto : 'Sem Disponibilidade';
    };

    return (
        <div id={styles.recipiente_pagina_disponibilidades}>
            <div id={styles.recipiente_disponibilidade_superior}>
                <h1>Minha Disponibilidade</h1>
            </div>
            <div id={styles.recipiente_disponibilidade_inferior}>
                <div className={styles.tabela}>
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
                                {encontrarDisponibilidade(index)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* <div id={styles.recipiente_disponibilidade_inferior}>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridWeek"
                    headerToolbar={false}
                    locales={[ptBrLocale]}
                    locale="pt-br"
                    dayHeaderContent={(arg) => diasDaSemana[arg.date.getDay()]}
                    dayCellContent={arg => {
                        const disponibilidade = disponibilidades.find(d => d.dia === arg.date.getDay());

                        return (
                            <div className={styles.celula}>
                                {disponibilidade ? disponibilidade.texto : 'Sem Disponibilidade'}
                            </div>
                        );
                    }}
                    height="auto"
                />
            </div> */}
        </div>
    );
};