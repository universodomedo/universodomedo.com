'use client';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist() {
    const { texto, setTexto, salvando, adicionar, cancelar } = useContexto__PaginaColaboradorPainelDoMedo__AdicionarItemChecklist();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Item executável">
                    <input type="text" autoFocus value={texto} onChange={evento => setTexto(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') adicionar(); }} placeholder="Quebre em um ponto executável…" />
                </InputComRotulo>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={adicionar} disabled={salvando || !texto.trim()}>{salvando ? 'Adicionando...' : 'Adicionar item'}</button>
                <button type="button" data-variante="secundario" onClick={cancelar} disabled={salvando}>Cancelar</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
