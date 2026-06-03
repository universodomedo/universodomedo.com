import styles from './styles.module.css';

import { useMemo } from 'react';
import { faMap, faFile, faHandBackFist } from '@fortawesome/free-regular-svg-icons';
import { faDisplay } from '@fortawesome/free-solid-svg-icons';
// import { faComment,faBookmark,faAddressCard,faComments,faAddressBook,faBarChart,faBell,faBuilding,faCalendar,faClock,faClosedCaptioning,faCommenting,faEdit,faEnvelope,faEye,faFlag,faNewspaper,faNoteSticky,faPaperPlane,faPaste } from '@fortawesome/free-regular-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useContextoSalaDeJogo__Narrador } from 'Contextos/ContextoSalaDeJogo__Narrador/contexto';
import TelaDeJogo from 'Componentes/ElementosDeJogo/TelaDeJogo/TelaDeJogo';
import JanelaDeMensagensDeJogo from 'Componentes/ElementosDeJogo/JanelaDeMensagensDeJogo/JanelaDeMensagensDeJogo';
import IconsRegionEmJogo, { WindowDefinition } from 'Componentes/ComponentesNarradorEmJogo/IconsRegionEmJogo/IconsRegionEmJogo';
import JanelaNarrador_Acoes from 'Componentes/ComponentesNarradorEmJogo/JanelasNarrador/JanelaNarrador_Acoes/JanelaNarrador_Acoes';
import JanelasNarrador__Participantes from 'Componentes/ComponentesNarradorEmJogo/JanelasNarrador/JanelasNarrador__Participantes/JanelasNarrador__Participantes';

export default function SPA_SalaDeJogo__Narrador() {
    const { dadosSalaDeJogo__Narrador, periciasDisponiveis, idPericiaSelecionadaParaTeste, idsUsuariosParticipantesSelecionadosParaTeste, estaSolicitandoTestePericiaParticipantes, selecionarPericiaParaTesteParticipantes, alternarSelecaoParticipanteParaTestePericia, solicitarTestePericiaParticipantesSelecionados } = useContextoSalaDeJogo__Narrador();

    const windowsDefinitions: WindowDefinition[] = useMemo(() => [
        { id: 'Testes do Mestre', icon: faHandBackFist, title: 'Ações do Mestre', color: '#ffb14a', initialSize: { width: 560, height: 420 }, contentMode: 'scroll', content: <JanelasNarrador__Participantes participantesDaSessao={dadosSalaDeJogo__Narrador.participantesDaSessao} periciasDisponiveis={periciasDisponiveis} idPericiaSelecionadaParaTeste={idPericiaSelecionadaParaTeste} idsUsuariosParticipantesSelecionadosParaTeste={idsUsuariosParticipantesSelecionadosParaTeste} estaSolicitandoTestePericiaParticipantes={estaSolicitandoTestePericiaParticipantes} selecionarPericiaParaTesteParticipantes={selecionarPericiaParaTesteParticipantes} alternarSelecaoParticipanteParaTestePericia={alternarSelecaoParticipanteParaTestePericia} solicitarTestePericiaParticipantesSelecionados={solicitarTestePericiaParticipantesSelecionados} />, },
        { id: 'Mensagens', icon: faFile, title: 'Mensagens', color: '#d816ff', initialSize: { width: 480, height: 360 }, contentMode: 'scroll', content: <JanelaDeMensagensDeJogo codigoSala={dadosSalaDeJogo__Narrador.codigoSalaDeJogo} />, },
        { id: 'Mapa', icon: faMap, title: 'Mapa', color: '#1f9529', initialSize: { width: 700 }, contentMode: 'fit', contentAspectRatio: 16 / 9, content: <TelaDeJogo codigoSala={dadosSalaDeJogo__Narrador.codigoSalaDeJogo} />, },
        { id: 'Configurações da Sala', icon: faDisplay, title: 'Configurações da Sala', color: '#ff4453', initialSize: { width: 480, height: 360 }, contentMode: 'scroll', content: <JanelaNarrador_Acoes />, },
    ], [dadosSalaDeJogo__Narrador.codigoSalaDeJogo, dadosSalaDeJogo__Narrador.participantesDaSessao, periciasDisponiveis, idPericiaSelecionadaParaTeste, idsUsuariosParticipantesSelecionadosParaTeste, estaSolicitandoTestePericiaParticipantes, selecionarPericiaParaTesteParticipantes, alternarSelecaoParticipanteParaTestePericia, solicitarTestePericiaParticipantesSelecionados]);

    return (
        <div className={styles.recipiente_pagina_de_jogo}>
            <div className={styles.recipiente__pagina_de_jogo__superior}>
                { /*
                <div style={{display: 'flex', gap: '1em', overflow: 'hidden', flexFlow: 'wrap', placeContent: 'flex-start', padding: '2em'}}>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faComment} title={'faComment'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faBookmark} title={'faBookmark'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faAddressCard} title={'faAddressCard'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faComments} title={'faComments'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faAddressBook} title={'faAddressBook'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faBarChart} title={'faBarChart'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faBell} title={'faBell'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faBuilding} title={'faBuilding'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faCalendar} title={'faCalendar'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faClock} title={'faClock'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faClosedCaptioning} title={'faClosedCaptioning'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faCommenting} title={'faCommenting'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faEdit} title={'faEdit'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faEnvelope} title={'faEnvelope'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faEye} title={'faEye'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faFile} title={'faFile'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faFlag} title={'faFlag'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faNewspaper} title={'faNewspaper'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faNoteSticky} title={'faNoteSticky'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faPaperPlane} title={'faPaperPlane'}/>
                    <FontAwesomeIcon style={{ width: '80px', height: '80px', }} icon={faPaste} title={'faPaste'}/>
                </div>
                */ }
            </div>
            <div className={styles.recipiente_regiao_icones_narrador}>
                <IconsRegionEmJogo windowsDefinitions={windowsDefinitions} />
            </div>
        </div>
    );
};
