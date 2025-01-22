// #region Imports
import style from "./style.module.css";
import "./style.css";

import { useEffect, useRef, useState } from 'react';

import SubPaginaDetalhes from "Pages/Ficha/SubPaginasFicha/SubPaginaDetalhes/page.tsx";
import SubPaginaEstatisticasDanificaveis from "Pages/Ficha/SubPaginasFicha/SubPaginaEstatisticasDanificaveis/page.tsx";
import SubPaginaAtributosPericias from "Pages/Ficha/SubPaginasFicha/SubPaginaAtributosPericias/page.tsx";
import SubPaginaInventario from "Pages/Ficha/SubPaginasFicha/SubPaginaInventario/page.tsx";
import SubPaginaAcoes from "Pages/Ficha/SubPaginasFicha/SubPaginaAcoes/page.tsx"
import SubPaginaHabilidades from 'Pages/Ficha/SubPaginasFicha/SubPaginaHabilidades/page.tsx';
import SubPaginaRituais from 'Pages/Ficha/SubPaginasFicha/SubPaginaRituais/page.tsx';
import SubPaginaEfeitos from "Pages/Ficha/SubPaginasFicha/SubPaginaEfeitos/page.tsx";

import { ContextoFichaProvider, getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';

import { Abas, ListaAbas, Aba, PainelAbas, ControleAbasExternas } from 'Components/LayoutAbas/page.tsx';
import { ContextoAbaEfeitos, ContextoAbaEfeitosProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaEfeitos/contexto.tsx';
import { ContextoAbaAtributo, ContextoAbaAtributoProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaAtributosPericias/contexto.tsx';
import { ContextoAbaInventario, ContextoAbaInventarioProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaInventario/contexto.tsx';
import { ContextoAbaAcoes, ContextoAbaAcoesProvider, useContextoAbaAcoes } from 'Pages/Ficha/SubPaginasFicha/SubPaginaAcoes/contexto.tsx';
import { ContextoAbaHabilidades, ContextoAbaHabilidadesProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaHabilidades/contexto.tsx';
import { ContextoAbaRituais, ContextoAbaRituaisProvider } from 'Pages/Ficha/SubPaginasFicha/SubPaginaRituais/contexto.tsx';

import { useLocation } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import Log from "Components/Log/page.tsx";
import 'react-toastify/dist/ReactToastify.css';

import { SingletonHelper } from "Types/classes_estaticas";


import BarraEstatisticaDanificavel from "Components/SubComponents/SubComponentesFicha/BarraEstatisticaDanificavel/page.tsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faPlus, faGear } from '@fortawesome/free-solid-svg-icons';
import img from 'Components/Assets/testeCapa1.png';

import Slider from "react-slick";
import BarraMenu from 'Recursos/Componentes/BarraMenu/page.tsx'
// #endregion

const page = () => {
    const location = useLocation();

    const indexFicha = 0;
    // const indexFicha = location.state?.indexFicha;

    return (
        <ContextoFichaProvider idFichaNoLocalStorage={indexFicha}>
            <InterseccaoParaPendencia />
        </ContextoFichaProvider>
    );
}

const InterseccaoParaPendencia = () => {
    const temPendencia = getPersonagemFromContext().temPendencia;

    return (
        <>
            {temPendencia ? (
                <PaginaEditaFicha />
            ): (
                <PaginaFicha />
            )}
        </>
    );
}

const PaginaFicha = () => {
    return (
        <>
            <div className={style.secao1}><PaginaFichaCima /></div>
            <div className={style.secao2}><PaginaFichaBaixo /></div>
        </>
    );
}

const PaginaFichaCima = () => {
    const [swiperDireitaAberto, setSwiperDireitaAberto] = useState(false);
    const alternaSwiperDireitaAberto = () => setSwiperDireitaAberto(!swiperDireitaAberto);
    const [paginaAbertaSwiper, setPaginaAbertaSwiper] = useState(0);

    const personagem = getPersonagemFromContext();

    const NextArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${style.arrow} ${style.arrow_next}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowRight}/>
            </div>
        );
    }

    const PrevArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${style.arrow} ${style.arrow_prev}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowLeft}/>
            </div>
        );
    }

    const settings = { infinite: true, speed: 300, slidesToShow: 3, centerMode: true, centerPadding: "0", nextArrow: <NextArrow />, prevArrow: <PrevArrow />, beforeChange: (current: number, next: number) => setPaginaAbertaSwiper(next) };

    const listaPaginas = [ 'Efeitos', 'Perícias', 'Inventário', 'Ações', 'Habilidades', 'Rituais' ];

    return (
        <>
            <div className={style.tela_principal} style={{ backgroundImage:`url(${img})` }}/>
            <div className={`${style.swiper_direita} ${!swiperDireitaAberto ? style.swiper_direita_fechado : ''}`}>
                <button onClick={alternaSwiperDireitaAberto} className={style.botao_swiper_direita}>o</button>
                <div className={style.conteudo_swiper_direita}>
                    <ContextoAbaAcoesProvider>
                        <div className={style.titulos_paginas_swiper_direita}>
                            <Slider {...settings}>
                                {listaPaginas.sort((a, b) => a.localeCompare(b)).map((pagina, index) => (
                                    <div key={index} className={`${style.item_slider} ${index === paginaAbertaSwiper ? style.item_slider_selecionado : ''}`}>
                                        <h1 className="noMargin">
                                            {pagina}
                                            {index === paginaAbertaSwiper && (<AbaComIconeConfig />)}
                                        </h1>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <hr style={{width:'100%'}}/>

                        <SubPaginaAcoes abaId={"aba6"} acoesPersonagem={personagem.acoes} />
                    </ContextoAbaAcoesProvider>
                </div>
            </div>
        </>
    );
}

const AbaComIconeConfig = () => {
    const { listaMenus } = useContextoAbaAcoes();

    return (
        <BarraMenu>
            {listaMenus.map((menu, indexMenu) => (
                <BarraMenu.Menu key={indexMenu}>
                    <BarraMenu.Trigger><FontAwesomeIcon icon={faGear} className={style.icone_config_pagina}/></BarraMenu.Trigger>
                    <BarraMenu.Portal>
                        {menu.itensMenu.map((itemMenu, indexItem) => {
                            if (itemMenu.tipoItem === 'CheckboxItem') {
                                return (
                                    <BarraMenu.CheckboxItem key={indexItem} checked={itemMenu.checked || false} onCheckedChange={itemMenu.funcItem} >
                                        {itemMenu.tituloItem}
                                    </BarraMenu.CheckboxItem>
                                );
                            } else if (itemMenu.tipoItem === 'Separator') {
                                return <BarraMenu.Separator key={indexItem} />;
                            } else {
                                return (
                                    <BarraMenu.Item key={indexItem} onSelect={itemMenu.funcItem}>
                                        {itemMenu.tituloItem}
                                    </BarraMenu.Item>
                                );
                            }
                        })}
                    </BarraMenu.Portal>
                </BarraMenu.Menu>
            ))}
        </BarraMenu>
    );
}

const ConteudoAbaAcoes = () => {
    const personagem = getPersonagemFromContext();
    const { listaMenus } = useContextoAbaAcoes();

    return (
        <>
            <hr style={{width:'100%', marginBottom:'0'}} />
            <div className={style.configuracoes_pagina}>
                <BarraMenu>
                    {listaMenus.map((menu, indexMenu) => (
                        <BarraMenu.Menu key={indexMenu}>
                            <BarraMenu.Trigger>{menu.tituloMenu}</BarraMenu.Trigger>
                            <BarraMenu.Portal>
                                {menu.itensMenu.map((itemMenu, indexItem) => {
                                    if (itemMenu.tipoItem === 'CheckboxItem') {
                                        return (
                                            <BarraMenu.CheckboxItem key={indexItem} checked={itemMenu.checked || false} onCheckedChange={itemMenu.funcItem} >
                                                {itemMenu.tituloItem}
                                            </BarraMenu.CheckboxItem>
                                        );
                                    } else if (itemMenu.tipoItem === 'Separator') {
                                        return <BarraMenu.Separator key={indexItem} />;
                                    } else {
                                        return (
                                            <BarraMenu.Item key={indexItem} onSelect={itemMenu.funcItem}>
                                                {itemMenu.tituloItem}
                                            </BarraMenu.Item>
                                        );
                                    }
                                })}
                            </BarraMenu.Portal>
                        </BarraMenu.Menu>
                    ))}
                </BarraMenu>
            </div>
            <hr style={{width:'100%'}} />
            <SubPaginaAcoes abaId={"aba6"} acoesPersonagem={personagem.acoes} />
        </>
    );
}

const PaginaFichaBaixo = () => {
    const personagem = getPersonagemFromContext();

    return (
        <>
            <div className={`${style.fatia_parte_baixo_detalhes}`}>
                <h2 className="noMargin">{personagem.detalhes.nome}</h2>
                <h2 className="noMargin">{personagem.detalhes.refClasse.nome}</h2>
                <h2 className="noMargin">{personagem.detalhes.refNivel.nomeDisplay}</h2>
            </div>
            <div className={style.fatia_parte_baixo_atalhos}>
                <div className={style.barras}>
                    <div className={style.barra_acoes}>
                        <div className={style.item_barra_acoes}>
                            <div className={style.icone_acao} style={{ backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+)`}}/>
                        </div>
                        <div className={style.item_barra_acoes}>
                            <div className={style.icone_acao}><FontAwesomeIcon icon={faPlus} style={{ width: '50%', height:'50%' }}/></div>
                        </div>
                    </div>
                    <div className={style.barra_atalhos}>
                        <div className={style.item_barra_atalhos}>
                            <h3 className="noMargin">Ações</h3>
                        </div>
                        <div className={style.item_barra_atalhos}>
                            <h3 className="noMargin">Contatos</h3>
                        </div>
                        <div className={style.item_barra_atalhos}>
                            <h3 className="noMargin">Novo Atalho..</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.fatia_parte_baixo_estatisticas_danificaveis}>
                {personagem.estatisticasDanificaveis.map((estatistica, index) => (
                    <div key={index} className={style.recipiente_estatistica_danificavel}>
                        <BarraEstatisticaDanificavel titulo={estatistica.refEstatisticaDanificavel.nomeAbrev} valorAtual={estatistica.valor} valorMaximo={estatistica.valorMaximo} corBarra={estatistica.refEstatisticaDanificavel.cor}/>
                    </div>
                ))}
            </div>
        </>
    );
}

const PaginaFichaa = () => {
    const [_, setState] = useState({});
    const controleRef = useRef<{ abreAba: (idAba: string) => void; fechaAba: (idAba: string) => void; }>(null);

    const personagem = getPersonagemFromContext();
    personagem.carregaOnUpdate(() => setState({}));

    return (
        <>
            <ToastContainer />
            <Log />

            {personagem && (
                <>
                    <div className={style.div_demo_acoes}>
                        <div>
                            <h1>Teste</h1>
                            <button onClick={() => console.log(personagem)}>Teste</button>
                        </div>
{/* 
                        <div>
                            <h1>Teste2</h1>
                            <button onClick={() => { personagem.inventario.items.find(item => item.id === 3)!.sacar({ tipo: 'Sobreescreve', novoGasto: { precoExecucao: {precos: [{ idTipoExecucao: 1, quantidadeExecucoes: 0 }]} } }); personagem.onUpdate(); }}>Teste2</button>
                        </div> */}

                        <div>
                            <h1>Passar Durações</h1>
                            {SingletonHelper.getInstance().duracoes.filter(duracao => duracao.id !== 5).map((duracao, index) => (
                                <button key={index} onClick={() => { personagem.rodaDuracao(duracao.id) }} >{duracao.nome}</button>
                            ))}
                        </div>

                        <div>
                            <h1>Alterar Estatística</h1>
                            <div>
                                <select id="estatistica">{personagem.estatisticasDanificaveis.map(estatistica_danificavel => (<option key={estatistica_danificavel.refEstatisticaDanificavel.id} value={estatistica_danificavel.refEstatisticaDanificavel.id}> {estatistica_danificavel.refEstatisticaDanificavel.nome} </option>))}</select>
                                <select id="valorRecuperar">{Array.from({length:100}, (_, index) => (index + 1)).map((option) => (<option key={option} value={option}>{option}</option>))}</select>
                            </div>
                            <div>
                                <select id="danificarOuRecuperar"><option key={1} value={'Danificar'}>Danificar</option><option key={2} value={'Recuperar'}>Recuperar</option></select>
                                <button onClick={() => {personagem.receptor.teste(
                                    parseInt((document.querySelector('#estatistica') as HTMLSelectElement).value),
                                    parseInt((document.querySelector('#valorRecuperar') as HTMLSelectElement).value),
                                    (document.querySelector('#danificarOuRecuperar') as HTMLSelectElement).selectedIndex+1,
                                );}}>Aplicar</button>
                            </div>
                        </div>

                        {/* <div>
                            <h1>Shopping</h1>
                            <button onClick={(e) => { e.preventDefault(); openModal(); }}>Abrir Shopping</button>
                        </div> */}
                    </div>
                </>
            )}

            {personagem && (
                <Abas>
                    <ControleAbasExternas ref={controleRef} />

                    <ListaAbas>
                        <Aba id="aba1">Nome</Aba>
                        <Aba id="aba2">Estatísticas</Aba>
                        <Aba id="aba3">Efeitos</Aba>
                        <Aba id="aba4">Atributos</Aba>
                        <Aba id="aba5">Inventário</Aba>
                        <Aba id="aba6">Ações</Aba>
                        <Aba id="aba7">Habilidades</Aba>
                        <Aba id="aba8">Rituais</Aba>
                    </ListaAbas>

                    <div className={style.wrapper_conteudo_abas}>
                        <PainelAbas id="aba1"><SubPaginaDetalhes detalhesPersonagem={personagem.detalhes} /></PainelAbas>

                        <PainelAbas id="aba2"><SubPaginaEstatisticasDanificaveis estatisticasDanificaveis={personagem.estatisticasDanificaveis} reducoesDanoPersonage={personagem.reducoesDano} estatisticasBuffaveis={personagem.estatisticasBuffaveis} /></PainelAbas>

                        <ContextoAbaEfeitosProvider>
                            <PainelAbas id="aba3" contextoMenu={ContextoAbaEfeitos}><SubPaginaEfeitos controladorModificadores={personagem.controladorModificadores} abaId={"aba3"} /></PainelAbas>
                        </ContextoAbaEfeitosProvider>

                        <ContextoAbaAtributoProvider>
                            <PainelAbas id="aba4" contextoMenu={ContextoAbaAtributo}><SubPaginaAtributosPericias atributos={personagem.atributos} pericias={personagem.pericias} /></PainelAbas>
                        </ContextoAbaAtributoProvider>

                        <ContextoAbaInventarioProvider>
                            <PainelAbas id="aba5" contextoMenu={ContextoAbaInventario}><SubPaginaInventario abaId={"aba5"} inventarioPersonagem={personagem.inventario} estatisticasBuffaveis={personagem.estatisticasBuffaveis} abrirAbaAcao={() => { controleRef.current?.abreAba("aba6") }} /></PainelAbas>
                        </ContextoAbaInventarioProvider>

                        <ContextoAbaAcoesProvider>
                            <PainelAbas id="aba6" contextoMenu={ContextoAbaAcoes}><SubPaginaAcoes abaId={"aba6"} acoesPersonagem={personagem.acoes} /></PainelAbas>
                        </ContextoAbaAcoesProvider>

                        <ContextoAbaHabilidadesProvider>
                            <PainelAbas id="aba7" contextoMenu={ContextoAbaHabilidades}><SubPaginaHabilidades abaId={"aba7"} habilidadesPersonagem={personagem.habilidades} abrirAbaAcao={() => { controleRef.current?.abreAba("aba6") }} /></PainelAbas>
                        </ContextoAbaHabilidadesProvider>

                        <ContextoAbaRituaisProvider>
                            <PainelAbas id="aba8" contextoMenu={ContextoAbaRituais}><SubPaginaRituais abaId={"aba8"} rituaisPersonagem={personagem.rituais} abrirAbaAcao={() => { controleRef.current?.abreAba("aba6") }} /></PainelAbas>
                        </ContextoAbaRituaisProvider>
                    </div>
                </Abas>
            )}
        </>
    );
}

const PaginaEditaFicha = () => {
    return (
        <></>
    );
}

export default page;