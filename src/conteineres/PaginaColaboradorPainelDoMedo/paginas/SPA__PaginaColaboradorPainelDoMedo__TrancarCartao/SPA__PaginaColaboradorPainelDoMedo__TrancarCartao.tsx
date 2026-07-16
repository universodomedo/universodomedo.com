'use client';

import styles from './styles.module.css';

import type { MotivoTranca } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorOpcoes from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorOpcoes/SelecionadorOpcoes';
import { useContexto__PaginaColaboradorPainelDoMedo__TrancarCartao } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__TrancarCartao/contexto';

const OPCOES_MOTIVO = [
    { value: 'CONCLUIDO', label: 'Concluído — o trabalho deste cartão terminou' },
    { value: 'INTERROMPIDO', label: 'Interrompido — o trabalho deste cartão foi suspenso' },
] as const;

export default function SPA__PaginaColaboradorPainelDoMedo__TrancarCartao() {
    const { motivo, setMotivo, salvando, trancar, cancelar, totalEvidencias } = useContexto__PaginaColaboradorPainelDoMedo__TrancarCartao();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Motivo da tranca">
                    <SelecionadorOpcoes opcoes={OPCOES_MOTIVO} valor={motivo} onChange={valor => setMotivo(valor as MotivoTranca | null)} placeholder="Selecione o motivo..." isClearable />
                </InputComRotulo>
                <p className={styles.efeito}>Trancado, o cartão fica visível para todos, mas <strong>nenhuma alteração</strong> é permitida — nem pelo criador — até ser destrancado.</p>
                {totalEvidencias > 0 && <p className={styles.avisoEvidencias}>🖼 <strong>{totalEvidencias} evidência{totalEvidencias > 1 ? 's' : ''}</strong> anexada{totalEvidencias > 1 ? 's' : ''} ser{totalEvidencias > 1 ? 'ão' : 'á'} <strong>descartada{totalEvidencias > 1 ? 's' : ''} definitivamente</strong> ao trancar — destrancar não as recupera. O texto dos comentários permanece.</p>}
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={trancar} disabled={salvando || motivo === null}>{salvando ? 'Trancando...' : 'Trancar Cartão'}</button>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
