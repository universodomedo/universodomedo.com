'use client';

import styles from './Editor3D.module.css';

import { useEffect, useState, type KeyboardEvent } from 'react';

import { MAXIMO_ESPESSURA_MALHA_EDITOR3D, MAXIMO_SUBDIVISAO_MALHA_EDITOR3D } from './editor3D.malha';
import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';

interface PainelObjetoEditor3DProps {
    readonly cor: string;
    readonly materiaisExtras: readonly { readonly nome: string; readonly cor: string }[];
    readonly subdivisao: number;
    readonly espessura: number;
    // Habilita os botões Atribuir: precisa de faces selecionadas no modo Edição › Face.
    readonly temFacesSelecionadas: boolean;
    readonly peca: { readonly idPeca: string; readonly nome: string } | null;
    readonly aoMudarCor: (cor: string) => void;
    readonly aoMudarSubdivisao: (subdivisao: number) => void;
    readonly aoMudarEspessura: (espessura: number) => void;
    readonly aoAdicionarMaterial: () => void;
    readonly aoMudarCorMaterial: (slot: number, cor: string) => void;
    readonly aoRenomearMaterial: (slot: number, nome: string) => void;
    readonly aoAtribuirMaterial: (slot: number) => void;
    readonly aoEspelharX: () => void;
    readonly aoAplicarTransformacoes: () => void;
    readonly aoRemoverPeca: (idPeca: string) => void;
};

// Propriedades do objeto selecionado (cor/subdivisão/espelho/aplicar transform). RENOMEAR não mora aqui: é duplo clique
// no nome do objeto na árvore da Coleção da Cena (o nome é identidade da árvore, não propriedade de painel).
// Duplicar/Excluir moram como ícones inline na linha do objeto na árvore da cena; parte de peça é removida pela peça inteira.
export function PainelObjetoEditor3D({ cor, materiaisExtras, subdivisao, espessura, temFacesSelecionadas, peca, aoMudarCor, aoMudarSubdivisao, aoMudarEspessura, aoAdicionarMaterial, aoMudarCorMaterial, aoRenomearMaterial, aoAtribuirMaterial, aoEspelharX, aoAplicarTransformacoes, aoRemoverPeca }: PainelObjetoEditor3DProps) {
    return (
        <div className={styles.painel_objeto}>
            <label className={styles.campo_cor_capa}>
                <span>Cor</span>
                <input type="color" value={cor} onChange={evento => aoMudarCor(evento.target.value)} />
            </label>
            <div className={styles.campo_subdivisao}>
                <span>Subdivisão (Catmull-Clark)</span>
                <div className={styles.controles_subdivisao}>
                    <button type="button" className={styles.botao_acao_objeto} disabled={subdivisao <= 0} onClick={() => aoMudarSubdivisao(subdivisao - 1)} title="Reduzir o nível de subdivisão">−</button>
                    <strong className={styles.valor_subdivisao}>{subdivisao === 0 ? 'Gaiola' : `Nível ${subdivisao}`}</strong>
                    <button type="button" className={styles.botao_acao_objeto} disabled={subdivisao >= MAXIMO_SUBDIVISAO_MALHA_EDITOR3D} onClick={() => aoMudarSubdivisao(subdivisao + 1)} title="Aumentar o nível de subdivisão">+</button>
                </div>
                <p className={styles.dica_subdivisao}>A gaiola continua editável; o viewport exibe a superfície subdividida.</p>
            </div>
            {/* Materiais: o slot base é a Cor acima; extras são slots por face. Atribuir grava o slot nas faces selecionadas (Edição › Face). */}
            <div className={styles.campo_subdivisao}>
                <span>Materiais</span>
                <div className={styles.acoes_objeto_painel}>
                    <button type="button" className={styles.botao_acao_objeto} disabled={!temFacesSelecionadas} onClick={() => aoAtribuirMaterial(0)} title={temFacesSelecionadas ? 'Atribuir o material BASE (a Cor) às faces selecionadas' : 'Selecione faces no modo Edição › Face'}>Atribuir Base</button>
                    <button type="button" className={styles.botao_acao_objeto} onClick={aoAdicionarMaterial} title="Adicionar um novo slot de material ao objeto">+ Material</button>
                </div>
                {materiaisExtras.map((material, indice) => (
                    <div key={indice} className={styles.acoes_objeto_painel}>
                        <input type="text" defaultValue={material.nome} maxLength={60} onKeyDown={evento => { evento.stopPropagation(); if (evento.key === 'Enter') evento.currentTarget.blur(); }} onBlur={evento => aoRenomearMaterial(indice + 1, evento.target.value)} title="Nome do material (confirma ao sair do campo)" />
                        <input type="color" value={material.cor} onChange={evento => aoMudarCorMaterial(indice + 1, evento.target.value)} title={`Cor de ${material.nome}`} />
                        <button type="button" className={styles.botao_acao_objeto} disabled={!temFacesSelecionadas} onClick={() => aoAtribuirMaterial(indice + 1)} title={temFacesSelecionadas ? `Atribuir ${material.nome} às faces selecionadas` : 'Selecione faces no modo Edição › Face'}>Atribuir</button>
                    </div>
                ))}
                <p className={styles.dica_subdivisao}>Atribuir aplica o material às faces selecionadas (Edição › Face).</p>
            </div>
            <div className={styles.campo_subdivisao}>
                <span>Espessura de parede (m)</span>
                <CampoNumeroEditor3D rotulo="⧈" valor={espessura} passo={0.01} minimo={0} maximo={MAXIMO_ESPESSURA_MALHA_EDITOR3D} atualizaValor={aoMudarEspessura} />
                <p className={styles.dica_subdivisao}>0 desliga. Gera a casca interna e fecha as bordas abertas (Solidify); a gaiola segue original.</p>
            </div>
            {peca !== null ? (
                <>
                    <p className={styles.aviso_membro_obrigatorio}>🧥 Parte da peça &quot;{peca.nome}&quot; — a peça é removida por inteiro.</p>
                    <div className={styles.acoes_objeto_painel}>
                        <button type="button" className={`${styles.botao_acao_objeto} ${styles.botao_excluir_objeto}`} onClick={() => aoRemoverPeca(peca.idPeca)} title={`Remover a peça ${peca.nome} inteira`}>✕ Remover Peça</button>
                    </div>
                </>
            ) : (
                <div className={styles.acoes_objeto_painel}>
                    <button type="button" className={styles.botao_acao_objeto} onClick={aoEspelharX} title="Espelhar a malha no plano X local (modele metade e espelhe; a costura em X=0 é soldada)">⇋ Espelhar X</button>
                    <button type="button" className={styles.botao_acao_objeto} onClick={aoAplicarTransformacoes} title="Gravar posição/rotação/escala na malha e zerar o transform (escala volta a 1; as medidas reais viram a condição inicial do objeto)">⊞ Aplicar Transformações</button>
                </div>
            )}
        </div>
    );
};
