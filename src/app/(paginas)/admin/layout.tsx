'use client';

import styles from './styles.module.css';

import { ReactNode } from "react";
import Link from 'next/link';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import { verificarPermissao } from "Helpers/verificarPermissao";

export default function LayoutAdmin({ children }: { children: ReactNode }) {
    const usuarioComPermissao = verificarPermissao();

    if (usuarioComPermissao === null) return null;
    
    if (!usuarioComPermissao) return <Redirecionador urlRedirecionar='/' />;

    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.ADMIN, comCabecalho: false, usuarioObrigatorio: true }}>
            <div id={styles.recipiente_pagina_admin}>
                <Link href={'/admin'}><h1>Páginas ADMIN</h1></Link>
                <div id={styles.recipiente_conteudo_pagina_admin}>
                    {children}
                </div>
            </div>
        </ControladorSlot>
    )
};