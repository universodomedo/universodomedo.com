import formStyles from './formulario.module.css';

import type { ContextoCapacidades } from './SPA__PaginaModeradorCapacidadesFuncionais';

export default function NaturezasCapacidadeFuncional({ contexto }: { contexto: ContextoCapacidades; }) {
    const { formulario, opcoes, alternaNatureza } = contexto;

    return (
        <section className={formStyles.secao}>
            <header><h3>Naturezas funcionais</h3></header>
            <div className={formStyles.lista_chips}>
                {opcoes?.naturezasFuncionais.map(opcao => (
                    <label key={opcao.key} className={formStyles.chip}>
                        <input type="checkbox" checked={formulario.estrutura.naturezasFuncionais.includes(opcao.key)} onChange={() => alternaNatureza(opcao.key)} />
                        <span>{opcao.nome}</span>
                    </label>
                ))}
            </div>
        </section>
    );
};
