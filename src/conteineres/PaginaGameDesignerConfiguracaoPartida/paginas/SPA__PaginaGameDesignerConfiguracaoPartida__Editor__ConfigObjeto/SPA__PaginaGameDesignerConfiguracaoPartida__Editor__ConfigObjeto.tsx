'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { SeletorPosicaoMapa } from 'Componentes/ElementosDeJogo/SeletorPosicaoMapa/SeletorPosicaoMapa';
import { EditorDescobertasInteragivel } from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Editor/EditorDescobertasInteragivel';
import { ACAO_OBJETO_VITORIA_PADRAO, type AcaoObjeto, type Descoberta } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Editor/editorConfiguracao.compartilhado';

type Percepcao = 'DESPERCEBIDO' | 'PERCEBIDO';
type OpcaoSelecionador = { value: string; label: string };

type Props = {
    nome: string;
    aoMudarNome: (nome: string) => void;
    descricao: string;
    aoMudarDescricao: (descricao: string) => void;
    pontosDurabilidadeMaximo: number;
    aoMudarPontosDurabilidade: (valor: number) => void;
    larguraObjetoMilimetros: number;
    aoMudarLarguraObjeto: (valor: number) => void;
    alturaObjetoMilimetros: number;
    aoMudarAlturaObjeto: (valor: number) => void;
    profundidadeObjetoMilimetros: number;
    aoMudarProfundidadeObjeto: (valor: number) => void;
    percepcaoInicial: Percepcao;
    aoMudarPercepcao: (percepcao: Percepcao) => void;
    posicao: { x: number; y: number };
    aoMudarPosicao: (posicao: { x: number; y: number }) => void;
    larguraMilimetros: number;
    alturaMilimetros: number;
    idProjetoMapa: number | null;
    rotuloAtivo: string;
    marcadoresContexto: readonly { key: string; posicao: { x: number; y: number }; rotulo: string }[];
    descobertas: readonly Descoberta[];
    aoMudarDescobertas: (descobertas: Descoberta[]) => void;
    opcoesCapacidades: readonly OpcaoSelecionador[];
    opcoesInteragiveis: readonly OpcaoSelecionador[];
    idElementoMapa: string | null;
    acoes: readonly AcaoObjeto[];
    aoMudarAcoes: (acoes: readonly AcaoObjeto[]) => void;
    aplicar: () => void;
};

const OPCOES_PERCEPCAO = [
    { value: 'PERCEBIDO', label: 'Percebido (visível desde o início)' },
    { value: 'DESPERCEBIDO', label: 'Despercebido (invisível até perceber)' },
];

export default function SPA__PaginaGameDesignerConfiguracaoPartida__Editor__ConfigObjeto({ nome, aoMudarNome, descricao, aoMudarDescricao, pontosDurabilidadeMaximo, aoMudarPontosDurabilidade, larguraObjetoMilimetros, aoMudarLarguraObjeto, alturaObjetoMilimetros, aoMudarAlturaObjeto, profundidadeObjetoMilimetros, aoMudarProfundidadeObjeto, percepcaoInicial, aoMudarPercepcao, posicao, aoMudarPosicao, larguraMilimetros, alturaMilimetros, idProjetoMapa, rotuloAtivo, marcadoresContexto, descobertas, aoMudarDescobertas, opcoesCapacidades, opcoesInteragiveis, idElementoMapa, acoes, aoMudarAcoes, aplicar }: Props) {
    // Objeto vindo do MAPA: corpo físico É o elemento autorado no Editor 3D — posição e dimensões derivam do bbox e não são editáveis aqui.
    const vemDoMapa = idElementoMapa !== null;
    const temAcaoVitoria = acoes.some(acao => acao.tipo === 'vitoria');
    const alcanceAcaoVitoria = acoes.find(acao => acao.tipo === 'vitoria')?.alcanceMilimetros ?? ACAO_OBJETO_VITORIA_PADRAO.alcanceMilimetros;
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

                {vemDoMapa
                    ? (
                        <InputComRotulo rotulo="Corpo físico (do Mapa)">
                            <p className={styles.dica}>Elemento do mapa — posição e dimensões derivam do Editor 3D: {(larguraObjetoMilimetros / 1000).toFixed(1)}m × {(alturaObjetoMilimetros / 1000).toFixed(1)}m × {(profundidadeObjetoMilimetros / 1000).toFixed(1)}m em ({posicao.x}mm, {posicao.y}mm).</p>
                        </InputComRotulo>
                    )
                    : (
                        <>
                            <div className={styles.linha}>
                                <InputComRotulo rotulo="Largura (mm)">
                                    <InputNumerico value={larguraObjetoMilimetros} onChange={aoMudarLarguraObjeto} />
                                </InputComRotulo>
                                <InputComRotulo rotulo="Altura (mm)">
                                    <InputNumerico value={alturaObjetoMilimetros} onChange={aoMudarAlturaObjeto} />
                                </InputComRotulo>
                                <InputComRotulo rotulo="Profundidade (mm)">
                                    <InputNumerico value={profundidadeObjetoMilimetros} onChange={aoMudarProfundidadeObjeto} />
                                </InputComRotulo>
                            </div>

                            <InputComRotulo rotulo="Posição no mapa">
                                <SeletorPosicaoMapa larguraMilimetros={larguraMilimetros} alturaMilimetros={alturaMilimetros} idProjetoMapa={idProjetoMapa} posicao={posicao} aoMudarPosicao={aoMudarPosicao} rotuloAtivo={rotuloAtivo} marcadoresContexto={marcadoresContexto} />
                            </InputComRotulo>
                        </>
                    )}

                <InputComRotulo rotulo="Ações">
                    <div className={styles.linha}>
                        <button type="button" data-variante={temAcaoVitoria ? undefined : 'secundario'} onClick={() => aoMudarAcoes(temAcaoVitoria ? acoes.filter(acao => acao.tipo !== 'vitoria') : [...acoes, { tipo: 'vitoria', alcanceMilimetros: ACAO_OBJETO_VITORIA_PADRAO.alcanceMilimetros }])}>
                            {temAcaoVitoria ? 'Remover Ação Vitória' : 'Adicionar Ação Vitória'}
                        </button>
                        {temAcaoVitoria && (
                            <InputComRotulo rotulo="Alcance da ação (mm)">
                                <InputNumerico value={alcanceAcaoVitoria} onChange={valor => aoMudarAcoes(acoes.map(acao => acao.tipo === 'vitoria' ? { tipo: 'vitoria', alcanceMilimetros: valor } : acao))} />
                            </InputComRotulo>
                        )}
                    </div>
                </InputComRotulo>

                <EditorDescobertasInteragivel descobertas={descobertas} aoMudarDescobertas={aoMudarDescobertas} opcoesCapacidades={opcoesCapacidades} opcoesInteragiveis={opcoesInteragiveis} />
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={aplicar}>Aplicar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
