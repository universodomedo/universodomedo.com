import { ControladorSlot } from 'Layouts/ControladorSlot';

import { obtemDadosMinhasDisponibilidades } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import MinhasDisponibilidadesComDados from './page-dados.tsx';

export default function PaginaMinhaDisponibilidade() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: true }}>
            <PaginaMinhaDisponibilidade_Slot/>
        </ControladorSlot>
    );
};

export async function PaginaMinhaDisponibilidade_Slot() {    
    const respostaDadosMinhasDisponibilidades = await obtemDadosMinhasDisponibilidades();

    if (!respostaDadosMinhasDisponibilidades) return <div>Erro ao carregar disponibilidades</div>;

    return <MinhasDisponibilidadesComDados listaDisponibilidades={respostaDadosMinhasDisponibilidades}/>
}