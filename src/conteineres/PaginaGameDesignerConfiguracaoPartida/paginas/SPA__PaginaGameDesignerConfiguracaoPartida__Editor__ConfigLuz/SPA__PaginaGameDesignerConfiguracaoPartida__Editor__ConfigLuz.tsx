'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import { SeletorPosicaoMapa } from 'Componentes/ElementosDeJogo/SeletorPosicaoMapa/SeletorPosicaoMapa';

type Props = {
    nome: string;
    aoMudarNome: (nome: string) => void;
    alcanceMilimetros: number;
    aoMudarAlcance: (valor: number) => void;
    intensidade: number;
    aoMudarIntensidade: (valor: number) => void;
    posicao: { x: number; y: number };
    aoMudarPosicao: (posicao: { x: number; y: number }) => void;
    larguraMilimetros: number;
    alturaMilimetros: number;
    idProjetoMapa: number | null;
    rotuloAtivo: string;
    marcadoresContexto: readonly { key: string; posicao: { x: number; y: number }; rotulo: string }[];
    aplicar: () => void;
};

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigLuz({ nome, aoMudarNome, alcanceMilimetros, aoMudarAlcance, intensidade, aoMudarIntensidade, posicao, aoMudarPosicao, larguraMilimetros, alturaMilimetros, idProjetoMapa, rotuloAtivo, marcadoresContexto, aplicar }: Props) {
    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Nome">
                    <input type="text" value={nome} onChange={evento => aoMudarNome(evento.target.value)} />
                </InputComRotulo>

                <div className={styles.linha}>
                    <InputComRotulo rotulo="Alcance (mm)">
                        <InputNumerico value={alcanceMilimetros} onChange={aoMudarAlcance} />
                    </InputComRotulo>
                    <InputComRotulo rotulo="Intensidade">
                        <InputNumerico value={intensidade} onChange={aoMudarIntensidade} />
                    </InputComRotulo>
                </div>

                <InputComRotulo rotulo="Posição no mapa">
                    <SeletorPosicaoMapa larguraMilimetros={larguraMilimetros} alturaMilimetros={alturaMilimetros} idProjetoMapa={idProjetoMapa} posicao={posicao} aoMudarPosicao={aoMudarPosicao} rotuloAtivo={rotuloAtivo} marcadoresContexto={marcadoresContexto} />
                </InputComRotulo>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={aplicar}>Aplicar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
