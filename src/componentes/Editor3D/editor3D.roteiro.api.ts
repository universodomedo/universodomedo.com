import { NoraApi } from 'Api/NoraApi';
import { EventosApiRest, type GoldenRoteiroEditor3D, type PassoRoteiroEditor3D, type RoteiroEditor3DPersistido, type RoteiroEditor3DResumoPersistido } from 'types-nora-api';

export function listaRoteirosEditor3D(): Promise<RoteiroEditor3DResumoPersistido[]> {
    return NoraApi.RestGET(EventosApiRest.GET.RoteiroEditor3D.listagem, {}, { mensagemErro: 'Não foi possível listar os roteiros.' });
};

export function consultaRoteiroEditor3D(idRoteiro: number): Promise<RoteiroEditor3DPersistido | null> {
    return NoraApi.RestGET(EventosApiRest.GET.RoteiroEditor3D.consulta, { idRoteiro }, { mensagemErro: 'Não foi possível abrir o roteiro.' });
};

export function criaRoteiroEditor3D(nome: string, objetivo: string): Promise<RoteiroEditor3DPersistido> {
    return NoraApi.RestPOST(EventosApiRest.POST.RoteiroEditor3D.criar, { nome, objetivo }, { mensagemErro: 'Não foi possível criar o roteiro.' });
};

// Atualizar passos INVALIDA a aprovação no servidor (golden pertence à sequência exata que o gerou).
export function atualizaPassosRoteiroEditor3D(idRoteiro: number, passos: readonly PassoRoteiroEditor3D[]): Promise<RoteiroEditor3DPersistido> {
    return NoraApi.RestPOST(EventosApiRest.POST.RoteiroEditor3D.atualizarPassos, { idRoteiro, passos }, { mensagemErro: 'Não foi possível salvar os passos do roteiro.' });
};

export function aprovaRoteiroEditor3D(idRoteiro: number, golden: GoldenRoteiroEditor3D): Promise<RoteiroEditor3DPersistido> {
    return NoraApi.RestPOST(EventosApiRest.POST.RoteiroEditor3D.aprovar, { idRoteiro, golden }, { mensagemErro: 'Não foi possível aprovar o resultado do roteiro.' });
};

// Bloqueio = a ferramenta ainda não permite completar (backlog visível do editor); null desbloqueia. Não mexe em passos/golden.
export function bloqueiaRoteiroEditor3D(idRoteiro: number, motivo: string | null): Promise<RoteiroEditor3DPersistido> {
    return NoraApi.RestPOST(EventosApiRest.POST.RoteiroEditor3D.bloquear, { idRoteiro, motivo }, { mensagemErro: 'Não foi possível atualizar o bloqueio do roteiro.' });
};

// Exclusão DEFINITIVA (curadoria do catálogo): leva passos e golden juntos — não há lixeira.
export function removeRoteiroEditor3D(idRoteiro: number): Promise<void> {
    return NoraApi.RestPOST(EventosApiRest.POST.RoteiroEditor3D.remover, { idRoteiro }, { mensagemErro: 'Não foi possível remover o roteiro.' });
};