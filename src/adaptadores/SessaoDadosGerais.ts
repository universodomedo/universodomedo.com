import { EstiloSessao, PersonagemDto, SessaoDto, UsuarioDto } from "types-nora-api";

export type SessaoDadosGerais = {
    mestre: UsuarioDto;
    jogadores: UsuarioDto[];
    personagens: PersonagemDto[];
};

export function mapSessaoDadosGerais(sessao: SessaoDto): SessaoDadosGerais {
    return {
        mestre: SessaoDadosGerais_getMestre(sessao),
        jogadores: SessaoDadosGerais_getJogadores(sessao),
        personagens: SessaoDadosGerais_getPersonagens(sessao),
    };
};

function SessaoDadosGerais_getMestre(sessao: SessaoDto): UsuarioDto { return sessao.estiloSessao == EstiloSessao.SESSAO_DE_AVENTURA ? sessao.detalheSessaoAventura.grupoAventura.usuarioMestre : sessao.detalheSessaoUnica.usuarioMestre; };

function SessaoDadosGerais_getJogadores(sessao: SessaoDto): UsuarioDto[] {
    return sessao.estiloSessao == EstiloSessao.SESSAO_DE_AVENTURA
        ? sessao.detalheSessaoAventura.grupoAventura.personagensDaAventura.reduce((acc: UsuarioDto[], cur) => { acc.push(cur.personagem.usuario); return acc; }, [])
        : [];
};

function SessaoDadosGerais_getPersonagens(sessao: SessaoDto): PersonagemDto[] {
    if (sessao.estiloSessao == EstiloSessao.SESSAO_DE_AVENTURA) return sessao.detalheSessaoAventura.grupoAventura.personagensDaAventura.reduce((acc: PersonagemDto[], cur) => { acc.push(cur.personagem); return acc; }, []);
    if (sessao.estiloSessao == EstiloSessao.SESSAO_UNICA_CANONICA) return [];
    if (sessao.estiloSessao == EstiloSessao.SESSAO_UNICA_NAO_CANONICA) return [];
    
    return [];
};