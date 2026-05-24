'use client';

import styles from './styles.module.css';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import BarraUsuario from 'Componentes/ElementosPaginaUsuario/BarraUsuario/page';

export default function PaginaVisualizacaoPerfilUsuario_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.perfilUsuario}>
            {/* VAI VIRAR CONTEINER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */}
            <MinhaPagina_Slot />
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