// #region Imports
import React, { useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';

import Ficha from 'Pages/Ficha/page.tsx';
// #endregion

const FichaTutorial: React.FC = () => {
    const [{ run, steps }, setState] = useState({
        run: true,
        steps: [
            {
                content: <h2>Vamos começar o Tutorial de Universo do Medo!</h2>,
                placement: "center" as const,
                target: 'body'
            },
            {
                content: <h2>A Aba Geral possui as Informações Gerais do seu Personagem, como Classe, Nome e Nível</h2>,
                placement: "bottom" as const,
                target: '#aba1',
                title: 'Aba Geral',
                // disableBeacon: true,
            },
            {
                content: <h2>A Aba de Estatísticas possui as Barras de Estatísticas do seu personagem, contendo Pontos de Vida, Pontos de Sanidade e Pontos de Esforço</h2>,
                placement: "bottom" as const,
                target: '#aba2',
                title: 'Aba de Estatísticas',
                // disableBeacon: true,
            },
            {
                content: <h2>A Aba de Efeitos Ativos mostra todos os Efeitos que seu personagem possui no momento e seus ganhos</h2>,
                placement: "bottom" as const,
                target: '#aba3',
                title: 'Aba de Efeitos Ativos',
                // disableBeacon: true,
            },
            {
                content: <h2>A Aba de Atributos e Perícias possibilita a execução dos testes que seu Personagem pode fazer</h2>,
                placement: "bottom" as const,
                target: '#aba4',
                title: 'Aba de Atributos e Perícias',
                // disableBeacon: true,
            },
            {
                content: <h2>A Aba de Reduções exibe informações importantes usadas em combate</h2>,
                placement: "bottom" as const,
                target: '#aba5',
                title: 'Aba de Reduções',
                // disableBeacon: true,
            },
            {
                content: <h2>A Aba de Inventário exibe todos os dados dos itens em seu personagem</h2>,
                placement: "bottom" as const,
                target: '#aba6',
                title: 'Aba de Inventário',
                // disableBeacon: true,
            },
            {
                content: <h2>A Aba de Ações mostra rapidamente todas as ações do seu personagem e permite executa-las</h2>,
                placement: "bottom" as const,
                target: '#aba7',
                title: 'Aba de Ações',
                // disableBeacon: true,
            },
            {
                content: <h2>A Aba de Rituais mostrada todas as conexões do seu Personagem com o Paranormal</h2>,
                placement: "bottom" as const,
                target: '#aba8',
                title: 'Aba de Rituais',
                // disableBeacon: true,
            },
        ]
    });

    return (
        <>
            <Joyride
                callback={() => {}}
                run={run}
                steps={steps}
                hideCloseButton
                scrollToFirstStep
                showProgress
                disableCloseOnEsc
                disableOverlayClose
                disableScrolling
            />
            <Ficha />
        </>
    );
}

export default FichaTutorial;