// #region Imports
import style from './style.module.css';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import Slider from "react-slick";
// #endregigon

const pagina = () => {
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
        { id: 2, nome: 'Combatente' },
        { id: 3, nome: 'Especialista' },
        { id: 4, nome: 'Ocultista' },
    ];
    const initialSlideIndex = classes.findIndex((classe) => classe.nome === 'Combatente');
    const [classeSelecionada, setClasseSelecionada] = useState(initialSlideIndex);

    const settings = {
        variableWidth: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '0',
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        // initialSlide: initialSlideIndex, // Adicionei isso para definir o slide inicial como o Combatente
        beforeChange: (current: number, next: number) => {
            setClasseSelecionada(next)
            console.log(`Mudando do slide ${current} para o slide ${next}`); // Adicionei isso para depurar
        },
    };

    return (
        <div className={style.recipiente_carrossel_classes}>
            <Slider {...settings}>
                {classes.map((classe, index) => (
                    <div key={index} className={style.item_carrossel_classes} />
                ))}
            </Slider>
        </div>
    );
}

export default pagina;