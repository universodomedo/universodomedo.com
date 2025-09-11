import { DiaDaSemana, JanelaDisponibilidade, ListaDisponibilidadesUsuario } from 'types-nora-api';

export interface ResultadoAdicaoDisponibilidade {
    novaLista: ListaDisponibilidadesUsuario;
    mensagemAlerta: string | null;
}

export function adicionarDisponibilidadeComValidacao(listaAtual: ListaDisponibilidadesUsuario, diaDaSemana: DiaDaSemana, novaJanela: JanelaDisponibilidade): ResultadoAdicaoDisponibilidade {
    const novaLista = [...listaAtual];
    const index = novaLista.findIndex(item => item.dds === diaDaSemana);

    let mensagemAlerta: string | null = null;

    if (index === -1) {
        // Dia não existe, criar novo item
        novaLista.push({
            dds: diaDaSemana,
            disponibilidades: [novaJanela]
        });
        mensagemAlerta = 'Nova janela de disponibilidade adicionada com sucesso!';
        return { novaLista, mensagemAlerta };
    }

    const dia = novaLista[index];
    let disponibilidadesAtualizadas = [...dia.disponibilidades];
    let janelaModificada = false;

    // Verificar cada caso
    for (let i = 0; i < disponibilidadesAtualizadas.length; i++) {
        const janelaExistente = disponibilidadesAtualizadas[i];

        const novaInicioMin = horarioParaMinutos(novaJanela.horaInicio);
        const novaFimMin = horarioParaMinutos(novaJanela.horaFim);
        const existenteInicioMin = horarioParaMinutos(janelaExistente.horaInicio);
        const existenteFimMin = horarioParaMinutos(janelaExistente.horaFim);

        // Caso 1: Nova janela completamente dentro de uma existente
        if (novaInicioMin >= existenteInicioMin && novaFimMin <= existenteFimMin) {
            mensagemAlerta = 'Esta janela já está completamente contida em uma disponibilidade existente.';
            janelaModificada = true;
            break;
        }

        // Caso 2: Nova horaInicio válida, mas horaFim dentro de existente
        if (novaInicioMin < existenteInicioMin && novaFimMin > existenteInicioMin && novaFimMin <= existenteFimMin) {
            disponibilidadesAtualizadas[i] = {
                horaInicio: novaJanela.horaInicio,
                horaFim: janelaExistente.horaFim
            };
            mensagemAlerta = 'Janela estendida para o início. Hora inicial ajustada.';
            janelaModificada = true;
            break;
        }

        // Caso 3: Nova horaFim válida, mas horaInicio dentro de existente
        if (novaInicioMin >= existenteInicioMin && novaInicioMin < existenteFimMin && novaFimMin > existenteFimMin) {
            disponibilidadesAtualizadas[i] = {
                horaInicio: janelaExistente.horaInicio,
                horaFim: novaJanela.horaFim
            };
            mensagemAlerta = 'Janela estendida para o fim. Hora final ajustada.';
            janelaModificada = true;
            break;
        }

        // Caso 4: Nova janela inclui completamente uma existente
        if (novaInicioMin <= existenteInicioMin && novaFimMin >= existenteFimMin) {
            disponibilidadesAtualizadas[i] = {
                horaInicio: novaJanela.horaInicio,
                horaFim: novaJanela.horaFim
            };
            mensagemAlerta = 'Janela existente expandida para incluir o novo período.';
            janelaModificada = true;
            break;
        }
    }

    if (!janelaModificada) {
        // Caso 5: Nenhum caso anterior, adicionar nova janela
        disponibilidadesAtualizadas.push(novaJanela);
        mensagemAlerta = 'Nova janela de disponibilidade adicionada com sucesso!';
    }

    // Mesclar janelas sobrepostas após modificações
    const disponibilidadesMescladas = mesclarJanelas(disponibilidadesAtualizadas);

    // Verificar se houve mesclagem
    if (disponibilidadesMescladas.length < dia.disponibilidades.length) {
        mensagemAlerta += ' Janelas sobrepostas foram mescladas.';
    }

    // Atualizar a lista
    novaLista[index] = {
        ...dia,
        disponibilidades: disponibilidadesMescladas
    };

    return { novaLista, mensagemAlerta };
};

// Função auxiliar para converter horário em minutos
export function horarioParaMinutos(horario: string): number {
    const [hora, minuto] = horario.split(':').map(Number);
    return hora * 60 + minuto;
};

// Função auxiliar para verificar sobreposição de horários
export function haSobreposicao(inicio1: string, fim1: string, inicio2: string, fim2: string): boolean {
    const inicio1Min = horarioParaMinutos(inicio1);
    const fim1Min = horarioParaMinutos(fim1);
    const inicio2Min = horarioParaMinutos(inicio2);
    const fim2Min = horarioParaMinutos(fim2);

    return (inicio1Min < fim2Min && fim1Min > inicio2Min);
};

// Função para mesclar janelas sobrepostas
export function mesclarJanelas(disponibilidades: JanelaDisponibilidade[]): JanelaDisponibilidade[] {
    if (disponibilidades.length <= 1) return disponibilidades;

    // Ordenar por horaInicio
    const ordenadas = [...disponibilidades].sort((a, b) =>
        horarioParaMinutos(a.horaInicio) - horarioParaMinutos(b.horaInicio)
    );

    const mescladas: JanelaDisponibilidade[] = [];
    let atual = ordenadas[0];

    for (let i = 1; i < ordenadas.length; i++) {
        const proxima = ordenadas[i];
        const fimAtual = horarioParaMinutos(atual.horaFim);
        const inicioProxima = horarioParaMinutos(proxima.horaInicio);

        if (fimAtual >= inicioProxima) {
            // Janelas se sobrepõem, mesclar
            atual = {
                horaInicio: atual.horaInicio,
                horaFim: horarioParaMinutos(atual.horaFim) > horarioParaMinutos(proxima.horaFim)
                    ? atual.horaFim
                    : proxima.horaFim
            };
        } else {
            mescladas.push(atual);
            atual = proxima;
        }
    }
    mescladas.push(atual);

    return mescladas;
};