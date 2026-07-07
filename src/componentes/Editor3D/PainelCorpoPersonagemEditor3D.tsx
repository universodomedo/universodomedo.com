'use client';

import styles from './Editor3D.module.css';

import { Color } from 'three';
import type { CorpoPersonagemCenaCanonicaEditor3D, MembroPersonagemEditor3D, ParametrosMembroPersonagemEditor3D } from 'types-nora-api';

import { CampoSliderEditor3D } from './CampoSliderEditor3D';

export type CampoParametroRegiaoEditor3D = keyof ParametrosMembroPersonagemEditor3D;

const CAMPOS_SLIDERS_REGIAO_EDITOR3D: readonly CampoParametroRegiaoEditor3D[] = ['comprimento', 'larguraSuperior', 'larguraMedial', 'larguraInferior', 'profundidade'];

// Os campos são genéricos (perfil superior/medial/inferior); os rótulos falam a anatomia de cada região. `null` = sliders globais do corpo.
const ROTULOS_SLIDERS_BRACO = { comprimento: 'Comprimento', larguraSuperior: 'Ombro', larguraMedial: 'Cotovelo', larguraInferior: 'Punho', profundidade: 'Profundidade' } as const;
const ROTULOS_SLIDERS_PERNA = { comprimento: 'Comprimento', larguraSuperior: 'Coxa', larguraMedial: 'Joelho', larguraInferior: 'Tornozelo', profundidade: 'Profundidade' } as const;
const ROTULOS_SLIDERS_POR_REGIAO: Record<MembroPersonagemEditor3D, Record<CampoParametroRegiaoEditor3D, string>> = {
    CABECA: { comprimento: 'Altura', larguraSuperior: 'Crânio', larguraMedial: 'Bochechas', larguraInferior: 'Queixo', profundidade: 'Profundidade' },
    TRONCO: { comprimento: 'Altura', larguraSuperior: 'Ombros', larguraMedial: 'Cintura', larguraInferior: 'Quadril', profundidade: 'Profundidade' },
    BRACO_ESQUERDO: ROTULOS_SLIDERS_BRACO,
    BRACO_DIREITO: ROTULOS_SLIDERS_BRACO,
    PERNA_ESQUERDA: ROTULOS_SLIDERS_PERNA,
    PERNA_DIREITA: ROTULOS_SLIDERS_PERNA,
};
const ROTULOS_SLIDERS_GLOBAIS: Record<CampoParametroRegiaoEditor3D, string> = { comprimento: 'Altura', larguraSuperior: 'Massa superior', larguraMedial: 'Massa', larguraInferior: 'Massa inferior', profundidade: 'Profundidade' };

function corVetorParaHex(cor: readonly [number, number, number]): string { return `#${new Color(cor[0], cor[1], cor[2]).getHexString()}`; };

interface PainelCorpoPersonagemEditor3DProps {
    readonly corpo: CorpoPersonagemCenaCanonicaEditor3D;
    readonly regiaoSelecionada: MembroPersonagemEditor3D | null;
    readonly rotuloRegiao: string;
    readonly pecasDaRegiao: readonly { readonly idPeca: string; readonly nome: string }[];
    readonly aoAtualizarParametro: (regiao: MembroPersonagemEditor3D | null, campo: CampoParametroRegiaoEditor3D, valor: number) => void;
    readonly aoMudarCor: (cor: string) => void;
    readonly aoAnexarPeca: () => void;
    readonly aoRemoverPeca: (idPeca: string) => void;
};

// Painel do corpo contínuo do Personagem: cor + sliders (globais no nó Corpo; anatômicos na região selecionada) + peças da região.
export function PainelCorpoPersonagemEditor3D({ corpo, regiaoSelecionada, rotuloRegiao, pecasDaRegiao, aoAtualizarParametro, aoMudarCor, aoAnexarPeca, aoRemoverPeca }: PainelCorpoPersonagemEditor3DProps) {
    const parametros = regiaoSelecionada !== null ? corpo.regioes[regiaoSelecionada] : corpo.global;
    const rotulos = regiaoSelecionada !== null ? ROTULOS_SLIDERS_POR_REGIAO[regiaoSelecionada] : ROTULOS_SLIDERS_GLOBAIS;

    return (
        <div className={styles.painel_objeto}>
            {regiaoSelecionada === null && (
                <label className={styles.campo_cor_capa}>
                    <span>Cor do corpo</span>
                    <input type="color" value={corVetorParaHex(corpo.cor)} onChange={evento => aoMudarCor(evento.target.value)} />
                </label>
            )}
            <div className={styles.grupo_sliders_membro}>
                <span className={styles.titulo_grupo_sliders}>{regiaoSelecionada === null ? 'Proporções globais' : `Proporções — ${rotuloRegiao}`}</span>
                {CAMPOS_SLIDERS_REGIAO_EDITOR3D.map(campo => <CampoSliderEditor3D key={campo} rotulo={rotulos[campo]} valor={parametros[campo]} minimo={0.5} maximo={2} passo={0.01} atualizaValor={valor => aoAtualizarParametro(regiaoSelecionada, campo, valor)} />)}
            </div>
            <p className={styles.aviso_membro_obrigatorio}>🧍 Corpo contínuo — uma superfície única; regiões não podem ser removidas.</p>
            {regiaoSelecionada !== null && (
                <div className={styles.grupo_pecas_membro}>
                    <span className={styles.titulo_grupo_sliders}>Peças</span>
                    {pecasDaRegiao.length === 0 && <p className={styles.vazio_pecas_membro}>Nenhuma peça anexada a esta região.</p>}
                    {pecasDaRegiao.map(peca => (
                        <div key={peca.idPeca} className={styles.linha_peca_membro}>
                            <span className={styles.nome_peca_membro}>🧥 {peca.nome}</span>
                            <button type="button" className={styles.botao_remover_peca} onClick={() => aoRemoverPeca(peca.idPeca)} title={`Remover a peça ${peca.nome}`} aria-label={`Remover ${peca.nome}`}>✕</button>
                        </div>
                    ))}
                    <button type="button" className={styles.botao_acao_objeto} onClick={aoAnexarPeca}>＋ Anexar Peça…</button>
                </div>
            )}
        </div>
    );
};
