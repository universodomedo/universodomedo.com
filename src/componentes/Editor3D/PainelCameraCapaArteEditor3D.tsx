'use client';

import styles from './Editor3D.module.css';

import { type RefObject } from 'react';

import { CampoNumeroEditor3D } from './CampoNumeroEditor3D';
import type { CameraEditor3D } from './editor3D.projeto.serializacao';

export type CampoVetorCameraCapaArteEditor3D = 'posicao' | 'alvo';

interface PainelCameraCapaArteEditor3DProps {
    readonly camera: CameraEditor3D;
    readonly refPreview: RefObject<HTMLCanvasElement | null>;
    readonly alvoTravado: boolean;
    readonly aoAtualizarVetor: (campo: CampoVetorCameraCapaArteEditor3D, indice: number, valor: number) => void;
    readonly aoAtualizarFov: (valor: number) => void;
    readonly aoAlternarAlvoTravado: () => void;
};

export function PainelCameraCapaArteEditor3D({ camera, refPreview, alvoTravado, aoAtualizarVetor, aoAtualizarFov, aoAlternarAlvoTravado }: PainelCameraCapaArteEditor3DProps) {
    return (
        <div className={styles.painel_camera_capa}>
            <div className={styles.preview_camera_capa}>
                <canvas ref={refPreview} width={320} height={180} />
            </div>
            <p className={styles.aviso_camera_capa}>📷 Saída final (1280×720) — obrigatória, não pode ser removida.</p>
            <label className={styles.toggle_alvo_camera}>
                <input type="checkbox" checked={alvoTravado} onChange={aoAlternarAlvoTravado} />
                <span>Travar alvo <small>{alvoTravado ? 'câmera sempre aponta para ele' : 'alvo acompanha a câmera'}</small></span>
            </label>
            <CampoNumeroEditor3D rotulo="Posição X" valor={camera.posicao[0]} passo={0.1} atualizaValor={valor => aoAtualizarVetor('posicao', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Posição Y" valor={camera.posicao[1]} passo={0.1} atualizaValor={valor => aoAtualizarVetor('posicao', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Posição Z" valor={camera.posicao[2]} passo={0.1} atualizaValor={valor => aoAtualizarVetor('posicao', 2, valor)} />
            <CampoNumeroEditor3D rotulo="Alvo X" valor={camera.alvo[0]} passo={0.1} atualizaValor={valor => aoAtualizarVetor('alvo', 0, valor)} />
            <CampoNumeroEditor3D rotulo="Alvo Y" valor={camera.alvo[1]} passo={0.1} atualizaValor={valor => aoAtualizarVetor('alvo', 1, valor)} />
            <CampoNumeroEditor3D rotulo="Alvo Z" valor={camera.alvo[2]} passo={0.1} atualizaValor={valor => aoAtualizarVetor('alvo', 2, valor)} />
            <CampoNumeroEditor3D rotulo="FOV" valor={camera.fov} passo={1} inteiro minimo={10} maximo={120} atualizaValor={aoAtualizarFov} />
        </div>
    );
};
