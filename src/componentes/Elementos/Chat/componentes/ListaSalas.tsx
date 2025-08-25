'use client';

import styles from '../styles.module.css';
import cn from 'classnames';

import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { selectSalas, selectSalaSelecionadaId } from 'redux/selectors/chatsSelectors';
import { selecionarSala } from 'Redux/slices/chatsSlice';

export default function ListaSalas() {
    const dispatch = useAppDispatch();
    const salas = useAppSelector(selectSalas);

    const salaSelecionadaId = useAppSelector(selectSalaSelecionadaId);

    return (
        <div id={styles.recipiente_salas}>
            <div id={styles.recipiente_lista_salas}>
                {salas.map((sala) => (
                    <div key={sala.id} className={cn(styles.item_sala, salaSelecionadaId === sala.id ? styles.item_sala_selecionada : styles.item_sala_nao_selecionada)} onClick={() => dispatch(selecionarSala(sala.id))}>
                        <h4>{sala.id}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};