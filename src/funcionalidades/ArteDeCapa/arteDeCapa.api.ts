import { NoraApi } from 'Api/NoraApi';
import { EventosApiRest, type Projeto3DCapaArteImagemPersistida, type Projeto3DCapaArteResumoPersistido } from 'types-nora-api';

export function listaCapasArte3D(): Promise<Projeto3DCapaArteResumoPersistido[]> {
    return NoraApi.RestGET(EventosApiRest.GET.Projeto3D.capasArte, {}, { mensagemErro: 'Não foi possível listar as capas de arte.' });
};

export function obtemImagemCapaArte3D(idProjeto: number): Promise<Projeto3DCapaArteImagemPersistida | null> {
    return NoraApi.RestGET(EventosApiRest.GET.Projeto3D.imagemCapaArte, { idProjeto }, { mensagemErro: 'Não foi possível carregar a imagem da capa.' });
};
