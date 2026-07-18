'use client';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useContexto__PaginaColaboradorPainelDoMedo__EdicaoCard } from 'Contextos/Contexto__PaginaColaboradorPainelDoMedo__EdicaoCard/contexto';

export default function SPA__PaginaColaboradorPainelDoMedo__EdicaoCard() {
    const { titulo, setTitulo, salvando, salvar } = useContexto__PaginaColaboradorPainelDoMedo__EdicaoCard();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <InputComRotulo rotulo="Título">
                    <input type="text" autoFocus value={titulo} onChange={evento => setTitulo(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Enter') salvar(); }} />
                </InputComRotulo>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" onClick={salvar} disabled={salvando || !titulo.trim()}>{salvando ? 'Salvando...' : 'Salvar Título'}</button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};
