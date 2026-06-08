import type { Editor3DState } from '../estado/editor3D.estado.types';
import type { Projeto3DResumoPersistido } from 'types-nora-api/shared';

export function obtemMensagemConfirmacaoDescarteCenaEditor3D(estado: Editor3DState, projetoDestino: Projeto3DResumoPersistido): string | null {
    if (estado.objetos.length === 0) return null;

    return `Carregar "${projetoDestino.nome}" vai substituir a cena atual. Alteracoes nao salvas serao perdidas. Deseja continuar?`;
};
