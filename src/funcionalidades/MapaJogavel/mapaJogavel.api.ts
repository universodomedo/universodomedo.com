import { NoraApi } from 'Api/NoraApi';
import { EventosApiRest, type Projeto3DMinimoPersistido, type Projeto3DResumoPersistido } from 'types-nora-api';

// Mapas jogáveis = Projetos 3D do tipo MAPA (autorados no Editor 3D). Esta é a superfície de consumo do JOGO
// (configuração de Partida e Sala de Jogo) — o Editor 3D tem a própria api de projetos.
export function listaMapas3D(): Promise<Projeto3DResumoPersistido[]> {
    return NoraApi.RestGET(EventosApiRest.GET.Projeto3D.mapas, {}, { mensagemErro: 'Não foi possível listar os Mapas.' });
};

export function consultaProjetoMapa3D(idProjeto: number): Promise<Projeto3DMinimoPersistido | null> {
    return NoraApi.RestGET(EventosApiRest.GET.Projeto3D.consulta, { idProjeto }, { mensagemErro: 'Não foi possível carregar o Mapa.' });
};
