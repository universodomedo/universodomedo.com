'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { SeletorPosicaoMapa } from 'Componentes/ElementosDeJogo/SeletorPosicaoMapa/SeletorPosicaoMapa';
import { EditorDescobertasInteragivel } from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor/EditorDescobertasInteragivel';
import type { Descoberta } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

type Percepcao = 'DESPERCEBIDO' | 'PERCEBIDO';
type OpcaoSelecionador = { value: string; label: string };

type Props = {
    nome: string;
    aoMudarNome: (nome: string) => void;
    descricao: string;
    aoMudarDescricao: (descricao: string) => void;
    pontosDurabilidadeMaximo: number;
    aoMudarPontosDurabilidade: (valor: number) => void;
    percepcaoInicial: Percepcao;
    aoMudarPercepcao: (percepcao: Percepcao) => void;
    posicao: { x: number; y: number };
    aoMudarPosicao: (posicao: { x: number; y: number }) => void;
    larguraMetros: number;
    alturaMetros: number;
    rotuloAtivo: string;
    marcadoresContexto: readonly { key: string; posicao: { x: number; y: number }; rotulo: string }[];
    descobertas: readonly Descoberta[];
    aoMudarDescobertas: (descobertas: Descoberta[]) => void;
    opcoesCapacidades: readonly OpcaoSelecionador[];
    opcoesInteragiveis: readonly OpcaoSelecionador[];
    salvar: () => void;
};

const OPCOES_PERCEPCAO = [
    { value: 'PERCEBIDO', label: 'Percebido (visível desde o início)' },
    { value: 'DESPERCEBIDO', label: 'Despercebido (invisível até perceber)' },
];

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto({ nome, aoMudarNome, descricao, aoMudarDescricao, pontosDurabilidadeMaximo, aoMudarPontosDurabilidade, percepcaoInicial, aoMudarPercepcao, posicao, aoMudarPosicao, larguraMetros, alturaMetros, rotuloAtivo, marcadoresContexto, descobertas, aoMudarDescobertas, opcoesCapacidades, opcoesInteragiveis, salvar }: Props) {
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
                    <InputComRotulo rotulo="Pontos de Durabilidade">
                        <InputNumerico value={pontosDurabilidadeMaximo} onChange={aoMudarPontosDurabilidade} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Percepção inicial">
                        <SelecionadorOpcoes opcoes={OPCOES_PERCEPCAO} valor={percepcaoInicial} onChange={valor => aoMudarPercepcao(valor === 'DESPERCEBIDO' ? 'DESPERCEBIDO' : 'PERCEBIDO')} />
                    </InputComRotulo>
                </div>

                <InputComRotulo rotulo="Posição no mapa">
                    <SeletorPosicaoMapa larguraMetros={larguraMetros} alturaMetros={alturaMetros} posicao={posicao} aoMudarPosicao={aoMudarPosicao} rotuloAtivo={rotuloAtivo} marcadoresContexto={marcadoresContexto} />
                </InputComRotulo>

                <EditorDescobertasInteragivel descobertas={descobertas} aoMudarDescobertas={aoMudarDescobertas} opcoesCapacidades={opcoesCapacidades} opcoesInteragiveis={opcoesInteragiveis} />
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar}>Salvar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
