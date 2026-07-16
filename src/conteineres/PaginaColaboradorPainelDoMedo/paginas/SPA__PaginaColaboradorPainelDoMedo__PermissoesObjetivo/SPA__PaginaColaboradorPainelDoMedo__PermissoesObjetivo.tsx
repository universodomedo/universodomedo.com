'use client';

import styles from './styles.module.css';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorUsuarioEmCache from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorUsuarioEmCache/SelecionadorUsuarioEmCache';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import { useContexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo/contexto';

// Sem AreaBotoes: sair e papel do fecharProps do header. Conceder (SelecionadorUsuarioEmCache) e revogar (✕) sao inline. Campo no topo, centralizado horizontalmente.
export default function SPA__PaginaColaboradorPainelDoMedo__PermissoesObjetivo() {
    const { permitidos, idsExcluidos, salvando, conceder, revogar } = useContexto__PaginaColaboradorPainelDoMedo__PermissoesObjetivo();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.topoCentralizado}>
                    <div className={styles.campo}>
                        <InputComRotulo rotulo="Conceder permissão de Criar Cartão a">
                            <SelecionadorUsuarioEmCache idSelecionado={null} idsExcluidos={idsExcluidos} onSelectIdUsuario={idUsuario => { if (idUsuario !== null) conceder(idUsuario); }} />
                        </InputComRotulo>
                    </div>

                    <div className={styles.linhaChips}>
                        {permitidos.length === 0 && <span className={styles.estado}>Nenhuma permissão concedida ainda (o criador do objetivo já pode por natureza).</span>}
                        {permitidos.map(permitido => (
                            <span key={permitido.usuarioId} className={styles.permitido} title={permitido.username}>
                                <span className={styles.avatarPermitido}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={permitido.usuarioId} /></span>
                                <span className={styles.nomePermitido}>{permitido.username}</span>
                                <button className={styles.removerChip} onClick={() => revogar(permitido.permissaoId)} disabled={salvando} title="Revogar permissão">✕</button>
                            </span>
                        ))}
                    </div>
                </div>
            </ConteudoForm.AreaCorpo>
        </ConteudoForm>
    );
};
