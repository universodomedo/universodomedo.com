import { ControladorSlot } from 'Layouts/ControladorSlot';

import { obtemDadosMinhasDisponibilidades } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import MinhasDisponibilidadesComDados from './page-dados.tsx';

export default function PaginaAcessar() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: true }}>
            <MinhaDisponibilidade/>
        </ControladorSlot>
    );
};

export async function MinhaDisponibilidade() {    
    const respostaDadosMinhasDisponibilidades = await obtemDadosMinhasDisponibilidades();

    if (!respostaDadosMinhasDisponibilidades) return <div>Erro ao carregar disponibilidades</div>;

    return <MinhasDisponibilidadesComDados listaDisponibilidades={respostaDadosMinhasDisponibilidades.disponibilidades}/>
}