import { useContexto__PaginaAdminGestaoNavegacao__NovoMenu } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__NovoMenu/contexto';

export default function SPA__PaginaAdminGestaoNavegacao__NovoMenu() {
    const { formularioNovoMenu, aoCancelar } = useContexto__PaginaAdminGestaoNavegacao__NovoMenu();

    return (
        <section>
            <label>
                <span>Chave</span>
                <input type="text" {...formularioNovoMenu.input('chave')} />
                {formularioNovoMenu.erro('chave') && <small>{formularioNovoMenu.erro('chave')}</small>}
            </label>

            <label>
                <span>Tipo</span>
                <select value={formularioNovoMenu.valores.tipo} disabled={formularioNovoMenu.salvando} onChange={evento => formularioNovoMenu.setCampo('tipo', evento.target.value as 'principal' | 'interno')}>
                    <option value="principal">principal</option>
                    <option value="interno">interno</option>
                </select>
            </label>

            <label>
                <span>Descrição</span>
                <input type="text" {...formularioNovoMenu.input('descricao')} />
            </label>

            <div>
                <button type="button" onClick={aoCancelar} disabled={formularioNovoMenu.salvando}>Voltar</button>
                <button type="button" onClick={formularioNovoMenu.salvar} disabled={!formularioNovoMenu.podeSalvar}>{formularioNovoMenu.salvando ? 'Salvando...' : 'Salvar'}</button>
            </div>
        </section>
    );
};
