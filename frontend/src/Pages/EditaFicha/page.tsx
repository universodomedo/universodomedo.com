// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';

import { GanhoIndividualNex, GanhoIndividualNexAtributo, GanhoIndividualNexFactory, GanhoIndividualNexPericia, GanhosNex, RLJ_Ficha2, ValoresGanhoETroca } from 'Types/classes/index.ts';

import EditaAtributos from 'Pages/EditaFicha/Componentes/EditaAtributos/page.tsx';
import EditaPericias from 'Pages/EditaFicha/Componentes/EditaPericias/page.tsx';
import EditaEstatisticas from 'Pages/EditaFicha/Componentes/EditaEstatisticas/page.tsx';
import EscolheClasse from 'Pages/EditaFicha/Componentes/EscolheClasse/page.tsx';
import EditaRituais from 'Pages/EditaFicha/Componentes/EditaRituais/page.tsx';

import { FichaProvider, useFicha } from 'Pages/EditaFicha/NexUpContext/page.tsx';

import Modal from "Components/Modal/page.tsx";

import { useNavigate, useLocation } from 'react-router-dom';

import { obterGanhosPorNivel, retornaFichaZerada } from './Componentes/GanhosHelper/helper.ts'
// #endregion

const page = () => {
    const navigate = useNavigate();
    const [ganhosNex, setGanhosNex] = useState<GanhosNex | null>(null);
    const [_, setState] = useState({});
    const atualizarFicha = () => setState({});
    const location = useLocation();
    const idNivelFinal = location.state?.idNivel;
    const nome = location.state?.nome;
    const [idNivelAtual, setIdNivelAtual] = useState(0);
    const idNivelFazendoAgora = idNivelAtual + 1;

    useEffect(() => {
        const ficha = retornaFichaZerada(idNivelAtual, nome);
        GanhoIndividualNexFactory.setFicha(ficha);
        setGanhosNex(new GanhosNex(ficha));
    }, []);

    useEffect(() => {
        atualizaGanhos();
    }, [ganhosNex, idNivelAtual]);

    const atualizaGanhos = () => {
        ganhosNex?.adicionarNovoGanho(obterGanhosPorNivel(idNivelFazendoAgora));
        atualizarFicha();
    }

    const atualizaGanhosParaFicha = () => {
        if (!ganhosNex) return;

        ganhosNex.dadosFicha.detalhes!.idNivel = idNivelFazendoAgora;

        ganhosNex.dadosFicha.estatisticasDanificaveis = [
            { id: 1, valorMaximo: ganhosNex.pvAtualizado, valor: ganhosNex.pvAtualizado},
            { id: 2, valorMaximo: ganhosNex.psAtualizado, valor: ganhosNex.psAtualizado},
            { id: 3, valorMaximo: ganhosNex.peAtualizado, valor: ganhosNex.peAtualizado},
        ];

        if (ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 1)) {
            const atributosAtuais = ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 1) as GanhoIndividualNexAtributo;

            ganhosNex.dadosFicha.atributos = atributosAtuais.atributos.map(atributoAtual => ({ id: atributoAtual.refAtributo.id, valor: atributoAtual.valorAtual}));
        }

        if (ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 2)) {
            const periciasAtuais = ganhosNex.ganhosQueTemAlteracao.find(ganho => ganho.id === 2) as GanhoIndividualNexPericia;

            ganhosNex.dadosFicha.periciasPatentes = periciasAtuais.pericias.map(periciaAtual => ({ idPericia: periciaAtual.refPericia.id, idPatente: periciaAtual.refPatenteAtual.id }))
        }
    }

    const closeModal = () => {
        atualizaGanhosParaFicha();
        if (idNivelFazendoAgora < idNivelFinal) {
            setIdNivelAtual(idNivelFazendoAgora);
        } else {
            addFichaLocalStore(ganhosNex!.dadosFicha);
            navigate('/pagina-interna');
        }
    };

    const addFichaLocalStore = (novaFicha: RLJ_Ficha2) => {
        const data = localStorage.getItem('dadosFicha');
        const dadosFicha = data ? JSON.parse(data) : [];

        dadosFicha.push({ dados: novaFicha });
        localStorage.setItem('dadosFicha', JSON.stringify(dadosFicha));
    }

    const proximo = () => {
        ganhosNex?.avancaEtapa();
        atualizarFicha();

        if (ganhosNex?.finalizando) closeModal();
    };

    const volta = () => {
        ganhosNex?.retrocedeEtapa();
        atualizarFicha();
    };

    return (
        <>
            {ganhosNex && ganhosNex.ganhos.length > 0 && (
                <FichaProvider ganhosNex={ganhosNex} atualizarFicha={atualizarFicha}>
                    <div className={style.editando_ficha}>
                        <h1>Criando Ficha - NEX 0%</h1>

                        {/* {ganhosNex?.finalizando && (
                            <>
                            <Modal isOpen={true} onClose={closeModal}>
                                <h1>Confirmar (clique no X)</h1>
                            </Modal>
                            </>
                        )} */}

                        <div className={style.area_edicao}>
                            {ganhosNex.etapa.id === 1 && (
                                <EditaAtributos />
                            )}
                            {ganhosNex.etapa.id === 2 && (
                                <EditaPericias />
                            )}
                            {ganhosNex.etapa.id === 3 && (
                                <EditaEstatisticas />
                            )}
                            {ganhosNex.etapa.id === 4 && (
                                <EscolheClasse />
                            )}
                            {ganhosNex.etapa.id === 5 && (
                                <EditaRituais />
                            )}
                        </div>

                        <div className={style.botoes}>
                            <button onClick={volta} disabled={!ganhosNex.podeRetrocederEtapa} className={style.prosseguir}>Voltar</button>
                            <button onClick={proximo} disabled={!ganhosNex.podeAvancarEtapa} className={style.prosseguir}>{ganhosNex.textoBotaoProximo}</button>
                        </div>
                    </div>
                </FichaProvider>
            )}
        </>
    );
}

export default page;