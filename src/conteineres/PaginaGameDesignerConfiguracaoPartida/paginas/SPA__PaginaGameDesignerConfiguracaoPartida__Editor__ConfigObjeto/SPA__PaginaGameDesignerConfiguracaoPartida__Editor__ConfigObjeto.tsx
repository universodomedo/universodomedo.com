'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { SeletorPosicaoMapa } from 'Componentes/ElementosDeJogo/SeletorPosicaoMapa/SeletorPosicaoMapa';

type Percepcao = 'DESPERCEBIDO' | 'PERCEBIDO';

type Props = {
    nome: string;
    aoMudarNome: (nome: string) => void;
    descricao: string;
    aoMudarDescricao: (descricao: string) => void;
    durabilidadeMaxima: number;
    aoMudarDurabilidade: (valor: number) => void;
    percepcaoInicial: Percepcao;
    aoMudarPercepcao: (percepcao: Percepcao) => void;
    posicao: { x: number; y: number };
    aoMudarPosicao: (posicao: { x: number; y: number }) => void;
    larguraMetros: number;
    alturaMetros: number;
    rotuloAtivo: string;
    marcadoresContexto: readonly { key: string; posicao: { x: number; y: number }; rotulo: string }[];
    salvar: () => void;
};

const OPCOES_PERCEPCAO = [
    { value: 'PERCEBIDO', label: 'Percebido (visível desde o início)' },
    { value: 'DESPERCEBIDO', label: 'Despercebido (invisível até perceber)' },
];

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto({ nome, aoMudarNome, descricao, aoMudarDescricao, durabilidadeMaxima, aoMudarDurabilidade, percepcaoInicial, aoMudarPercepcao, posicao, aoMudarPosicao, larguraMetros, alturaMetros, rotuloAtivo, marcadoresContexto, salvar }: Props) {
    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Nome">
                    <input type="text" value={nome} onChange={evento => aoMudarNome(evento.target.value)} />
                </InputComRotulo>

                <InputComRotulo rotulo="Descrição">
                    <input type="text" value={descricao} onChange={evento => aoMudarDescricao(evento.target.value)} />
                </InputComRotulo>

                <div className={styles.linha}>
                    <InputComRotulo rotulo="Durabilidade (pontos)">
                        <InputNumerico value={durabilidadeMaxima} onChange={aoMudarDurabilidade} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Percepção inicial">
                        <SelecionadorOpcoes opcoes={OPCOES_PERCEPCAO} valor={percepcaoInicial} onChange={valor => aoMudarPercepcao(valor === 'DESPERCEBIDO' ? 'DESPERCEBIDO' : 'PERCEBIDO')} />
                    </InputComRotulo>
                </div>

                <InputComRotulo rotulo="Posição no mapa">
                    <SeletorPosicaoMapa larguraMetros={larguraMetros} alturaMetros={alturaMetros} posicao={posicao} aoMudarPosicao={aoMudarPosicao} rotuloAtivo={rotuloAtivo} marcadoresContexto={marcadoresContexto} />
                </InputComRotulo>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar}>Salvar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
