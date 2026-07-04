'use client';

import styles from './styles.module.css';

import { PathAvatarPadrao } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { SeletorPosicaoMapa } from 'Componentes/ElementosDeJogo/SeletorPosicaoMapa/SeletorPosicaoMapa';
import { RenderUsuario } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

type Percepcao = 'DESPERCEBIDO' | 'PERCEBIDO';

type Props = {
    nomeExibicao: string;
    aoMudarNomeExibicao: (nome: string) => void;
    posicao: { x: number; y: number };
    aoMudarPosicao: (posicao: { x: number; y: number }) => void;
    percepcaoInicial: Percepcao | null;
    aoMudarPercepcao: (percepcao: Percepcao) => void;
    larguraMetros: number;
    alturaMetros: number;
    rotuloAtivo: string;
    marcadoresContexto: readonly { key: string; posicao: { x: number; y: number }; rotulo: string }[];
    salvar: () => void;
};

const OPCOES_PERCEPCAO = [
    { value: 'DESPERCEBIDO', label: 'Despercebido (invisível até perceber)' },
    { value: 'PERCEBIDO', label: 'Percebido (visível desde o início)' },
];

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigSerEmSala({ nomeExibicao, aoMudarNomeExibicao, posicao, aoMudarPosicao, percepcaoInicial, aoMudarPercepcao, larguraMetros, alturaMetros, rotuloAtivo, marcadoresContexto, salvar }: Props) {
    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <header className={styles.header}>
                    <span className={styles.avatar_circulo}><RenderUsuario caminhoArquivoAvatar={PathAvatarPadrao} /></span>
                    <div className={styles.header_info}>
                        <InputComRotulo rotulo="Nome em jogo">
                            <input type="text" value={nomeExibicao} onChange={evento => aoMudarNomeExibicao(evento.target.value)} />
                        </InputComRotulo>
                    </div>
                </header>

                {percepcaoInicial !== null && (
                    <InputComRotulo rotulo="Percepção inicial">
                        <SelecionadorOpcoes opcoes={OPCOES_PERCEPCAO} valor={percepcaoInicial} onChange={valor => aoMudarPercepcao(valor === 'PERCEBIDO' ? 'PERCEBIDO' : 'DESPERCEBIDO')} />
                    </InputComRotulo>
                )}

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
