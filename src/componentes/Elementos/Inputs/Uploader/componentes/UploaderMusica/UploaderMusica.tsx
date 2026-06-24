'use client';

import styles from './styles.module.css';

import { useContextoUploadImagem } from 'Contextos/ContextoUploadImagem/contexto';
import Uploader from '../../Uploader';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorFonteMusica from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorFonteMusica/SelecionadorFonteMusica';

export default function UploaderMusica() {
    const { musica, isCarregando } = useContextoUploadImagem();
    if (!musica) throw new Error('UploaderMusica precisa de contexto musica');

    return (
        <>
            <Uploader />

            <div className={styles.campos}>
                <InputComRotulo rotulo="Nome da música *">
                    <input className={styles.input} type="text" value={musica.nome} onChange={e => musica.setNome(e.target.value)} disabled={isCarregando} placeholder="Ex: Tema de Investigação" />
                </InputComRotulo>

                <InputComRotulo rotulo="Fonte *">
                    <SelecionadorFonteMusica options={musica.fontes.map(fonte => ({ id: fonte.id, nome: fonte.nome }))} idSelecionado={musica.fonteSelecao.idFonteMusica} nomeNovo={musica.fonteSelecao.nomeFonteNova} onSelecionar={musica.setFonteSelecao} disabled={isCarregando} />
                </InputComRotulo>

                {musica.erro ? <div className={styles.erro} aria-live="polite">{musica.erro}</div> : null}
            </div>
        </>
    );
};
