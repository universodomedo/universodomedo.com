import { obtemDadosMinhasDisponibilidades } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import MinhasDisponibilidadesComDados from './page-dados.tsx';

export default async function MinhaDisponibilidade() {    
    const respostaDadosMinhasDisponibilidades = await obtemDadosMinhasDisponibilidades();

    if (!respostaDadosMinhasDisponibilidades.sucesso || !respostaDadosMinhasDisponibilidades.dados) return <div>Erro ao carregar disponibilidades</div>;

    return <MinhasDisponibilidadesComDados listaDisponibilidades={respostaDadosMinhasDisponibilidades.dados.disponibilidades}/>
}