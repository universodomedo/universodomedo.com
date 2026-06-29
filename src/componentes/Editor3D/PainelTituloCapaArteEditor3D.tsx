'use client';

import styles from './Editor3D.module.css';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import type { CampoTransformEditor3D } from './editor3D.tipos';
import type { TextoCapaArteEditor3D } from './editor3D.projeto.serializacao';

interface PainelTituloCapaArteEditor3DProps {
    readonly titulo: TextoCapaArteEditor3D;
    readonly aoAtualizarTexto: (texto: string) => void;
    readonly aoAtualizarTransform: (campo: CampoTransformEditor3D, indice: number, valor: number) => void;
    readonly aoAtualizarCor: (cor: string) => void;
};

// Painel do título da Capa de Arte (objeto 3D filho da câmera): texto + cor de material + transform em espaço da câmera.
export function PainelTituloCapaArteEditor3D({ titulo, aoAtualizarTexto, aoAtualizarTransform, aoAtualizarCor }: PainelTituloCapaArteEditor3DProps) {
    return (
        <div className={styles.painel_titulo_capa}>
            <label className={styles.campo_texto_capa}>
                <span>Texto</span>
                <input type="text" value={titulo.texto} maxLength={120} placeholder="Digite o título" onChange={evento => aoAtualizarTexto(evento.target.value)} />
            </label>
            <label className={styles.campo_cor_capa}>
                <span>Cor</span>
                <input type="color" value={titulo.cor} onChange={evento => aoAtualizarCor(evento.target.value)} />
            </label>
            <CampoNumeroEditor3D rotulo="Posição X" valor={titulo.posicao[0]} passo={0.1} atualizaValor={valor => aoAtualizarTransform('posicao', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Posição Y" valor={titulo.posicao[1]} passo={0.1} atualizaValor={valor => aoAtualizarTransform('posicao', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Posição Z" valor={titulo.posicao[2]} passo={0.1} atualizaValor={valor => aoAtualizarTransform('posicao', 2, valor)} />
            <CampoNumeroEditor3D rotulo="Rotação X" valor={titulo.rotacao[0]} passo={0.05} atualizaValor={valor => aoAtualizarTransform('rotacao', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Rotação Y" valor={titulo.rotacao[1]} passo={0.05} atualizaValor={valor => aoAtualizarTransform('rotacao', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Rotação Z" valor={titulo.rotacao[2]} passo={0.05} atualizaValor={valor => aoAtualizarTransform('rotacao', 2, valor)} />
            <CampoNumeroEditor3D rotulo="Escala X" valor={titulo.escala[0]} passo={0.05} minimo={0.01} atualizaValor={valor => aoAtualizarTransform('escala', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Escala Y" valor={titulo.escala[1]} passo={0.05} minimo={0.01} atualizaValor={valor => aoAtualizarTransform('escala', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Escala Z" valor={titulo.escala[2]} passo={0.05} minimo={0.01} atualizaValor={valor => aoAtualizarTransform('escala', 2, valor)} />
        </div>
    );
};
