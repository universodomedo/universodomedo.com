// import { DadosMinhasDisponibilidades } from 'types-nora-api';
import { obtemDadosMinhasDisponibilidades } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import MinhasDisponibilidadesComDados from './page-dados.tsx';

class DadosMinhasDisponibilidades {
    disponibilidades: DisponibilidadeUsuario[];

    constructor(disponibilidades: DisponibilidadeUsuario[]) {
        this.disponibilidades = disponibilidades;
    }

    get disponibilidadePorExtenso(): Record<number, string[]>[] {
        const agrupadoPorDia: Record<number, string[]> = {};

        // Agrupa as disponibilidades por dia da semana
        this.disponibilidades.forEach(disponibilidade => {
            const { diaDaSemana, horaInicio, horaFim } = disponibilidade;
            const textoDisponibilidade = `Dísponível entre ${horaInicio} e ${horaFim}`;

            if (!agrupadoPorDia[diaDaSemana]) {
                agrupadoPorDia[diaDaSemana] = [];
            }

            agrupadoPorDia[diaDaSemana].push(textoDisponibilidade);
        });

        // Converte o objeto agrupado em uma lista de objetos
        return Object.keys(agrupadoPorDia).map(dia => {
            const diaNumero = Number(dia);
            return { [diaNumero]: agrupadoPorDia[diaNumero] };
        });
    }
}

class DisponibilidadeUsuario {
    diaDaSemana: number;
    horaInicio: string;
    horaFim: string;
    constructor(diaDaSemana: number, horaInicio: string, horaFim: string) {
        this.diaDaSemana = diaDaSemana;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
    }
}

export default async function MinhaDisponibilidade() {    
    const respostaDadosMinhasDisponibilidades = await obtemDadosMinhasDisponibilidades();

    if (!respostaDadosMinhasDisponibilidades.sucesso || !respostaDadosMinhasDisponibilidades.dados) return <div>Erro ao carregar disponibilidades</div>;

    return <MinhasDisponibilidadesComDados listaDisponibilidades={respostaDadosMinhasDisponibilidades.dados.disponibilidades}/>
}