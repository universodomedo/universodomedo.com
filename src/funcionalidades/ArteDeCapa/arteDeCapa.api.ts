import { NoraApi } from 'Api/NoraApi';
import { EventosApiRest, type AssinaturaArtistaPersistida, type CamadaTituloArteCapaUDM, type ConteudoArteCapaUDM, type ImagemBaseArteCapaUDM, type Projeto3DCapaArteImagemPersistida, type Projeto3DCapaArteResumoPersistido } from 'types-nora-api';

export function listaCapasArte3D(): Promise<Projeto3DCapaArteResumoPersistido[]> {
    return NoraApi.RestGET(EventosApiRest.GET.Projeto3D.capasArte, {}, { mensagemErro: 'Não foi possível listar as capas de arte.' });
};

export function obtemImagemCapaArte3D(idProjeto: number): Promise<Projeto3DCapaArteImagemPersistida | null> {
    return NoraApi.RestGET(EventosApiRest.GET.Projeto3D.imagemCapaArte, { idProjeto }, { mensagemErro: 'Não foi possível carregar a imagem da capa.' });
};

// Monta o objeto único e BRANDED que o Renderiza__ImagemUDM__ArteCapa recebe — único ponto que "carimba" os base64 como subitens tipados da Arte de Capa (imagem base / camada do título) + anexa a assinatura.
export function montaConteudoArteCapaUDM(capa: Projeto3DCapaArteImagemPersistida, assinatura: AssinaturaArtistaPersistida | null): ConteudoArteCapaUDM {
    return {
        imagem: capa.imagemBase64 as ImagemBaseArteCapaUDM,
        camadaTitulo: capa.imagemTituloBase64 === null ? null : capa.imagemTituloBase64 as CamadaTituloArteCapaUDM,
        assinatura,
    };
};
