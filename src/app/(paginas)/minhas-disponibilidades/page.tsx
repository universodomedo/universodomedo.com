import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import { obtemDadosMinhasDisponibilidades } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import MinhasDisponibilidadesComDados from './page-dados.tsx';

export default function PaginaMinhaDisponibilidade() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.DISPONIBILIDADES, comCabecalho: false, usuarioObrigatorio: true }}>
            <PaginaMinhaDisponibilidade_Slot/>
        </ControladorSlot>
    );
};

async function PaginaMinhaDisponibilidade_Slot() {
    const respostaDadosMinhasDisponibilidades = await obtemDadosMinhasDisponibilidades();

    if (!respostaDadosMinhasDisponibilidades) return <div>Erro ao carregar disponibilidades</div>;

    return <MinhasDisponibilidadesComDados listaDisponibilidades={respostaDadosMinhasDisponibilidades}/>
}