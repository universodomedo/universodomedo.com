'use client';

import styles from './styles.module.css';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import BarraUsuario from 'Componentes/ElementosPaginaUsuario/BarraUsuario/page';
import { Contexto__PaginaPerfilUsuario__Provider } from '@/contextos/Contexto__PaginaPerfilUsuario/contexto';

export default function PaginaVisualizacaoPerfilUsuario_Client({ idUsuario }: { idUsuario: number }) {
    return (
        <ControladorSlot pagina={PAGINAS.perfilUsuario}>
            {/* VAI VIRAR CONTEINER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
            <Contexto__PaginaPerfilUsuario__Provider idUsuario={idUsuario}>
                <MinhaPagina_Slot />
            </Contexto__PaginaPerfilUsuario__Provider>
        </ControladorSlot>
    );
};


// Luiz, lembra que eu falei que vc ia se foder?
// então..
function MinhaPagina_Slot() {
    return (
        <div className={styles.portal_usuario}>
            <div className={styles.portal_usuario_esquerda}>
                <BarraUsuario />
                {/* <SecaoPosts /> */}
            </div>
            {/* <SecaoContatos /> */}
        </div>
    );
};