'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import Conteiner__PaginaMestreAventuras from 'Conteineres/PaginaMestreAventuras/conteiner';

export function AventurasMestre_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.aventuras}>
            <Conteiner__PaginaMestreAventuras />
        </ControladorSlot>
    );
};

// function AventurasMestre_Slot() {
//     return (
//         <div className={styles.recipiente_aventuras_mestre}>
//             {gruposAventurasListadas!.map(grupoAventura => <AventuraEmLayoutContextualizado key={grupoAventura.id} grupoAventura={grupoAventura} destino={{ pagina: PAGINAS.minhasPaginas.mestre.aventura, params: { id: grupoAventura.id } }} />)}
//         </div>
//     );
// };