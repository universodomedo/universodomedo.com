'use client';

import styles from './styles.module.css';
import { ReactNode } from "react";

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import { verificarPermissao } from "Helpers/verificarPermissao";
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import Link from 'next/link';

export default function LayoutAdmin({ children }: { children: ReactNode }) {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.ADMIN, comCabecalho: false, usuarioObrigatorio: true }}>
            <LayoutAdmin_Slot>
                {children}
            </LayoutAdmin_Slot>
        </ControladorSlot>
    );
};

function LayoutAdmin_Slot({ children }: { children: ReactNode }) {
    const usuarioComPermissao = verificarPermissao(usuario => usuario.perfilAdmin.id === 2);

    if (usuarioComPermissao === null) return null;

    if (!usuarioComPermissao) return <Redirecionador urlRedirecionar='/' />;

    return (
        <div id={styles.recipiente_pagina_admin}>
            <Link href={'/admin'}><h1>Páginas ADMIN</h1></Link>
            <div id={styles.recipiente_conteudo_pagina_admin}>
                {children}
            </div>
        </div>
    );
};