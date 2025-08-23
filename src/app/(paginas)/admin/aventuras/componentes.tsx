import styles from './styles.module.css';

import { GrupoAventuraDto } from "types-nora-api";

import { AventuraEmLayoutContextualizado } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AventuraEmLayoutContextualizado/page';

export function AdministrarAventuras_ConteudoGeral({ gruposAventuras }: { gruposAventuras: GrupoAventuraDto[] }) {
    return (
        <div id={styles.recipiente_aventuras_admin}>
            {gruposAventuras?.sort((a, b) => b.id - a.id).map(grupoAventura => <AventuraEmLayoutContextualizado key={grupoAventura.id} grupoAventura={grupoAventura} href={`/admin/aventura/${grupoAventura.id}`} />)}
        </div>
    );
};