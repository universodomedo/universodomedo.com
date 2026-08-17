import { NoraApi } from 'Api/NoraApi';
import { EventosApiRest, type CamadaJogoMapa, type CenaCanonicaEditor3D, type Projeto3DMinimoPersistido, type Projeto3DResumoPersistido } from 'types-nora-api';

export function listaProjetos3D(): Promise<Projeto3DResumoPersistido[]> {
    return NoraApi.RestGET(EventosApiRest.GET.Projeto3D.listagem, {}, { mensagemErro: 'Não foi possível listar os projetos.' });
};

export function consultaProjeto3D(idProjeto: number): Promise<Projeto3DMinimoPersistido | null> {
    return NoraApi.RestGET(EventosApiRest.GET.Projeto3D.consulta, { idProjeto }, { mensagemErro: 'Não foi possível abrir o projeto.' });
};

// A camada de jogo (fontes de luz + fiação) viaja junto com a cena: um salvamento só grava geometria e domínio lógico, cada um na sua tabela.
export function salvaProjeto3D(nome: string, cenaCanonica: CenaCanonicaEditor3D, idProjeto?: number, imagemCapaBase64?: string, imagemCapaTituloBase64?: string, camadaJogoMapa?: CamadaJogoMapa): Promise<Projeto3DMinimoPersistido> {
    return NoraApi.RestPOST(EventosApiRest.POST.Projeto3D.salvar, { idProjeto, nome, cenaCanonica, imagemCapaBase64, imagemCapaTituloBase64, camadaJogoMapa }, { mensagemErro: 'Não foi possível salvar o projeto.' });
};
