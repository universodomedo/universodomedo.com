import { DisponibilidadeUsuarioDto, JanelaDisponibilidadeDto } from "types-nora-api";

export const janelas: JanelaDisponibilidadeDto[] = [
    {
        id: 1,
        dds: 1,
        disponibilidadeUsuario: {} as DisponibilidadeUsuarioDto,
        horaInicio: '10:00',
        horaFim: '16:00',
        janelaPorExtenso: 'Segunda Feira - das 10:00 às 16:00',
    },
    {
        id: 2,
        dds: 3,
        disponibilidadeUsuario: {} as DisponibilidadeUsuarioDto,
        horaInicio: '08:00',
        horaFim: '14:00',
        janelaPorExtenso: 'Quarta Feira - das 08:00 às 14:00',
    },
    {
        id: 3,
        dds: 3,
        disponibilidadeUsuario: {} as DisponibilidadeUsuarioDto,
        horaInicio: '17:00',
        horaFim: '22:00',
        janelaPorExtenso: 'Quarta Feira - das 17:00 às 22:00',
    },
];