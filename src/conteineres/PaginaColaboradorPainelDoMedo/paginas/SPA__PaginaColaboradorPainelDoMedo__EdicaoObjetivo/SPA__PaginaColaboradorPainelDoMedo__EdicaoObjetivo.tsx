'use client';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__EdicaoObjetivo() {
    const { nome, setNome, salvando, salvar, cancelar } = useContexto__PaginaColaboradorPainelDoMedo__EdicaoObjetivo();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Nome do objetivo">
                    <input type="text" autoFocus value={nome} onChange={evento => setNome(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') salvar(); }} />
                </InputComRotulo>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar} disabled={salvando || !nome.trim()}>{salvando ? 'Salvando...' : 'Salvar Objetivo'}</button>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
