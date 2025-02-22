import style from 'Paginas/Loja/style.module.css';

import { ContextoLojaProvider, useContextoLoja } from 'Contextos/ContextoLoja/contexto.tsx';

import { useClasseContextualPersonagemInventario } from 'Classes/ClassesContextuais/PersonagemInventario';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconeFACustomizavel from 'Componentes/IconeFACustomizavel/IconeFACustomizavel.tsx';
import { faMagnifyingGlassDollar } from '@fortawesome/free-solid-svg-icons';

const Pagina = () => {
    return (
        <ContextoLojaProvider>
            <PageComContexto />
        </ContextoLojaProvider>
    );
};

const PageComContexto = () => {
    const { inventario } = useClasseContextualPersonagemInventario();
    
    return (
        <div className={style.recipiente_loja}>
            <h1>Loja</h1>

            <div className={style.recipiente_particoes}>
                {inventario.particoes.map((particao, indexParticao) => (
                    <details key={indexParticao} className={style.particao}>
                        <summary>
                            <div className={style.particao_header}>
                                <div className={style.recipiente_nome_particao}><h3>{particao.nome}</h3></div>
                                <div className={style.recipiente_detalhes_particao}>
                                    <IconeFACustomizavel
                                        icon={faMagnifyingGlassDollar}
                                        exibeX={particao.tipoParticao === 'Desconsidera Categoria'}
                                        titulo={particao.tipoParticao === 'Desconsidera Categoria' ? 'Essa Partição desconsidera a Categoria dos Itens' : 'Essa Partição contabiliza a Categoria dos Itens'}
                                    />
                                </div>
                            </div>
                        </summary>
                        <div className={style.particao_conteudo}>
                            {particao.itens.map((item, index) => (
                                <p key={index}>{item.nome.nomeExibicao}</p>
                            ))}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
};

const PageComContexto2 = () => {
    const { idPaginaAberta, paginas, removeItem } = useContextoLoja();

    return (
        <div className={style.recipiente_loja}>
            <h1>Loja</h1>
            <div className={style.recipiente_conteudo_tipo_item}>
                {paginas[idPaginaAberta] || <p>Página não encontrada</p>}
            </div>
        </div>
    );
};

export default Pagina;