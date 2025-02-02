// #region Imports
import style from './style.module.css';

import { GanhoIndividualNexEscolhaClasse } from 'Classes/ClassesTipos/index.ts';
import { useContextoNexUp } from 'Contextos/ContextoNexUp/contexto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import imgCombatente from 'Assets/imgClasseCombatente.png';
import imgEspecialista from 'Assets/imgClasseEspecialista.png';
import imgOcultista from 'Assets/imgClasseOcultista.png';

import Slider from "react-slick";
// #endregion

const pagina = () => {
    const { ganhosNex, triggerSetState } = useContextoNexUp();
    
    const ganhoClasse = ganhosNex.ganhos.find(ganho => ganho instanceof GanhoIndividualNexEscolhaClasse)!;

    const NextArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${style.arrow} ${style.arrow_next}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowRight} />
            </div>
        );
    };

    const PrevArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${style.arrow} ${style.arrow_prev}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
        );
    };

    const classes = [
        { id: 2, nome: 'Combatente', img: imgCombatente },
        { id: 3, nome: 'Especialista', img: imgEspecialista },
        { id: 4, nome: 'Ocultista', img: imgOcultista },
    ];

    const settings = {
        variableWidth: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '0',
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        onInit: () => {
            if (classes.length > 0) ganhoClasse.setIdEscolhido(classes[0].id);
            triggerSetState();
        },
        beforeChange: (current: number, next: number) => {
            const nextClasse = classes[next];
            if (nextClasse) ganhoClasse.setIdEscolhido(nextClasse.id);
            triggerSetState();
        },
    };

    return (
        <div className={style.recipiente_carrossel_classes}>
            <Slider {...settings}>
                {classes.map((classe, index) => (
                    <div key={index} className={style.recipiente_conteudo_slide}>
                        <div className={style.item_carrossel_classes} style={{ backgroundImage: `url(${classe.img})` }} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default pagina;