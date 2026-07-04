import styles from './styles.module.css';

import classNames from 'classnames';

import ListagemComposta, { ListagemCompostaModoExibicao } from 'Componentes/Listagens/ListagemComposta/ListagemComposta';
import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { useContexto__PaginaAdminCatalogoAssinatura__Listagem } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura__Listagem/contexto';
import type { RegistroProduto, RegistroPasse, RegistroVinculo, SecaoCatalogo } from 'Contextos/Contexto__PaginaAdminCatalogoAssinatura/contexto';

const SECOES: readonly { chave: SecaoCatalogo; rotulo: string }[] = [
    { chave: 'produtos', rotulo: 'Produtos' },
    { chave: 'passes', rotulo: 'Passes' },
    { chave: 'vinculos', rotulo: 'Vínculos' },
];

export default function SPA__PaginaAdminCatalogoAssinatura__Listagem() {
    const ctx = useContexto__PaginaAdminCatalogoAssinatura__Listagem();

    return (
        <div className={styles.recipiente}>
            <div className={styles.abas}>
                {SECOES.map(secao => (
                    <DivClicavel key={secao.chave} className={classNames(styles.aba, { [styles.aba_ativa]: ctx.secaoAtiva === secao.chave })} onClick={() => ctx.setSecaoAtiva(secao.chave)}>
                        {secao.rotulo}
                    </DivClicavel>
                ))}
            </div>

            {ctx.secaoAtiva === 'produtos' && (
                <ListagemComposta
                    listagem={ctx.listagemProdutos}
                    modoExibicao={ListagemCompostaModoExibicao.GRADE}
                    itensPorLinha={4}
                    obterIdRegistro={produto => produto.id}
                    renderizarItem={produto => <CartaoProduto produto={produto} aoEditar={ctx.editarProduto} />}
                    novoRegistro={{ estaEmProcessoCriacao: ctx.estaEmCriacaoProduto, aoIniciarCriacao: ctx.iniciarCriacaoProduto, textoBotao: 'Novo Produto' }}
                />
            )}

            {ctx.secaoAtiva === 'passes' && (
                <ListagemComposta
                    listagem={ctx.listagemPasses}
                    modoExibicao={ListagemCompostaModoExibicao.GRADE}
                    itensPorLinha={4}
                    obterIdRegistro={passe => passe.id}
                    renderizarItem={passe => <CartaoPasse passe={passe} aoEditar={ctx.editarPasse} />}
                    novoRegistro={{ estaEmProcessoCriacao: ctx.estaEmCriacaoPasse, aoIniciarCriacao: ctx.iniciarCriacaoPasse, textoBotao: 'Novo Passe' }}
                />
            )}

            {ctx.secaoAtiva === 'vinculos' && (
                <ListagemComposta
                    listagem={ctx.listagemVinculos}
                    modoExibicao={ListagemCompostaModoExibicao.GRADE}
                    itensPorLinha={3}
                    obterIdRegistro={vinculo => vinculo.id}
                    renderizarItem={vinculo => <CartaoVinculo vinculo={vinculo} aoEditar={ctx.editarVinculo} />}
                    novoRegistro={{ estaEmProcessoCriacao: ctx.estaEmCriacaoVinculo, aoIniciarCriacao: ctx.iniciarCriacaoVinculo, textoBotao: 'Novo Vínculo' }}
                />
            )}
        </div>
    );
};

function CartaoProduto({ produto, aoEditar }: { produto: RegistroProduto; aoEditar: (produto: RegistroProduto) => void; }) {
    return (
        <DivClicavel className={classNames(styles.cartao, { [styles.inativo]: !produto.ativo })} onClick={() => aoEditar(produto)}>
            <strong className={styles.nome}>{produto.nome}</strong>
            <span className={styles.codigo}>{produto.codigoInterno}</span>
            <span className={styles.detalhe}>{produto.valorCentavos === null ? 'Contribuição livre' : formataReais(produto.valorCentavos)}</span>
            <span className={styles.badge}>{produto.ativo ? 'Ativo' : 'Inativo'}</span>
        </DivClicavel>
    );
};

function CartaoPasse({ passe, aoEditar }: { passe: RegistroPasse; aoEditar: (passe: RegistroPasse) => void; }) {
    return (
        <DivClicavel className={classNames(styles.cartao, { [styles.inativo]: !passe.ativo })} onClick={() => aoEditar(passe)}>
            <strong className={styles.nome}>{passe.nome}</strong>
            <span className={styles.codigo}>{passe.codigoInterno}</span>
            <span className={styles.badge}>{passe.ativo ? 'Ativo' : 'Inativo'}</span>
        </DivClicavel>
    );
};

function CartaoVinculo({ vinculo, aoEditar }: { vinculo: RegistroVinculo; aoEditar: (vinculo: RegistroVinculo) => void; }) {
    return (
        <DivClicavel className={classNames(styles.cartao, { [styles.inativo]: !vinculo.ativo })} onClick={() => aoEditar(vinculo)}>
            <strong className={styles.nome}>{vinculo.produto.nome} → {vinculo.passe.nome}</strong>
            <span className={styles.detalhe}>{vinculo.diasDeValidade} dias de validade</span>
            <span className={styles.badge}>{vinculo.ativo ? 'Ativo' : 'Inativo'}</span>
        </DivClicavel>
    );
};

function formataReais(valorCentavos: number): string { return (valorCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
