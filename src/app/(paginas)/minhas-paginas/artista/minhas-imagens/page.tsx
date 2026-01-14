import styles from './styles.module.css';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { PaginaArtista_MinhasImagens_Contexto } from "./componentes";


export default function PaginaArtista_Minhas_Imagens() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.artista.minhasImagens}>
            <PaginaArtista_MinhasImagens_Contexto />
        </ControladorSlot>
    );
};