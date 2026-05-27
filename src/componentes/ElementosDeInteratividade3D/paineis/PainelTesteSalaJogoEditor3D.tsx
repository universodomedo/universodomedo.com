'use client';

import styles from './styles.module.css';

import { useRouter } from 'next/navigation';
import { PAGINAS } from 'types-nora-api';

import { salvaDocumentoCena3DPrototipoSalaDeJogo } from 'Funcionalidades/Cena3DPrototipo/cena3DPrototipo.storage';
import { serializaEditor3DParaCena3DPrototipo } from 'Funcionalidades/Cena3DPrototipo/serializaEditor3DParaCena3DPrototipo';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';

export function PainelTesteSalaJogoEditor3D() {
    const router = useRouter();
    const { estado } = useEditor3DContexto();

    function testaCenaNaSalaDeJogo(): void {
        salvaDocumentoCena3DPrototipoSalaDeJogo(serializaEditor3DParaCena3DPrototipo(estado));
        router.push(PAGINAS.jogo.emJogo.href);
    };

    return (
        <section className={styles.painelTesteSalaJogoEditor3D} aria-label="Teste da cena 3D na Sala de Jogo">
            <button className={styles.botaoTesteSalaJogoEditor3D} type="button" onClick={testaCenaNaSalaDeJogo}>
                <span>Testar na Sala 3D</span>
                <strong>{estado.objetos.length}</strong>
            </button>
        </section>
    );
};
