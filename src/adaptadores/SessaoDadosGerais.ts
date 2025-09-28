import { EstiloSessao, PersonagemDto, SessaoDto, UsuarioDto } from "types-nora-api";

export type SessaoDadosGerais = {
    mestre: UsuarioDto;
    participantes: ParticipanteSessao[];
};

type ParticipanteSessao = {
    jogador: UsuarioDto;
    personagem: PersonagemDto | null;
};

export function mapSessaoDadosGerais(sessao: SessaoDto): SessaoDadosGerais {
    return {
        mestre: SessaoDadosGerais_getMestre(sessao),
        participantes: SessaoDadosGerais_getParticipantes(sessao),
    };
};

function SessaoDadosGerais_getMestre(sessao: SessaoDto): UsuarioDto { return sessao.estiloSessao == EstiloSessao.SESSAO_DE_AVENTURA ? sessao.detalheSessaoAventura.grupoAventura.usuarioMestre : sessao.detalheSessaoUnica.usuarioMestre; };

function SessaoDadosGerais_getParticipantes(sessao: SessaoDto): ParticipanteSessao[] {
    return sessao.estiloSessao == EstiloSessao.SESSAO_DE_AVENTURA
        ? sessao.detalheSessaoAventura.grupoAventura.personagensDaAventura.map(personagemDaAventura => ({ jogador: personagemDaAventura.personagem.usuario, personagem: personagemDaAventura.personagem }))
        : sessao.detalheSessaoUnica.participantesSessaoUnica.map(participanteSessaoUnica => ({ jogador: participanteSessaoUnica.usuario, personagem: participanteSessaoUnica.personagem }))
};