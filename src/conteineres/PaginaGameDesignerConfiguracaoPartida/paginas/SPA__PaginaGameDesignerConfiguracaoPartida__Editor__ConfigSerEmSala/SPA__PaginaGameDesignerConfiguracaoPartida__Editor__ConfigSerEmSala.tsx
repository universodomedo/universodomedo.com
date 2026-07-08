'use client';

import styles from './styles.module.css';

import { PathAvatarPadrao } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { SeletorPosicaoMapa } from 'Componentes/ElementosDeJogo/SeletorPosicaoMapa/SeletorPosicaoMapa';
import { RenderUsuario } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import { EditorDescobertasInteragivel } from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor/EditorDescobertasInteragivel';
import type { Descoberta } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

type Percepcao = 'DESPERCEBIDO' | 'PERCEBIDO';
type OpcaoSelecionador = { value: string; label: string };

type Props = {
    nome: string;
    aoMudarNome: (nome: string) => void;
    posicao: { x: number; y: number };
    aoMudarPosicao: (posicao: { x: number; y: number }) => void;
    percepcaoInicial: Percepcao;
    aoMudarPercepcao: (percepcao: Percepcao) => void;
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
    { value: 'DESPERCEBIDO', label: 'Despercebido (invisível até perceber)' },
    { value: 'PERCEBIDO', label: 'Percebido (visível desde o início)' },
];

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala({ nome, aoMudarNome, posicao, aoMudarPosicao, percepcaoInicial, aoMudarPercepcao, larguraMetros, alturaMetros, rotuloAtivo, marcadoresContexto, descobertas, aoMudarDescobertas, opcoesCapacidades, opcoesInteragiveis, salvar }: Props) {
    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <header className={styles.header}>
                    <span className={styles.avatar_circulo}><RenderUsuario caminhoArquivoAvatar={PathAvatarPadrao} /></span>
                    <div className={styles.header_info}>
                        <InputComRotulo rotulo="Nome em jogo">
                            <input type="text" value={nome} onChange={evento => aoMudarNome(evento.target.value)} />
                        </InputComRotulo>
                    </div>
                </header>

                <InputComRotulo rotulo="Percepção inicial">
                    <SelecionadorOpcoes opcoes={OPCOES_PERCEPCAO} valor={percepcaoInicial} onChange={valor => aoMudarPercepcao(valor === 'PERCEBIDO' ? 'PERCEBIDO' : 'DESPERCEBIDO')} />
                </InputComRotulo>

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
