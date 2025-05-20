import styles from './styles.module.css';

import { EtapaGanhoEvolucao_Classes, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

import Image from 'next/image';
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function CarrosselClasses() {
    const { ganhos, executaEAtualiza } = useContextoEdicaoFicha();

    const etapaSelecaoClasse = ganhos.etapas.find(ganho => ganho instanceof EtapaGanhoEvolucao_Classes)!;

    const NextArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${styles.arrow} ${styles.arrow_next}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowRight} />
            </div>
        );
    };

    const PrevArrow = ({ onClick }: { onClick?: React.MouseEventHandler<HTMLDivElement> }) => {
        return (
            <div className={`${styles.arrow} ${styles.arrow_prev}`} onClick={onClick}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
        );
    };

    const classes = [
        { id: 2, nome: 'Dominante', img: '/imgClasseCombatente.png' },
        { id: 3, nome: 'Versátil', img: '/imgClasseEspecialista.png' },
        { id: 4, nome: 'Marcado', img: '/imgClasseOcultista.png' },
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
            if (classes.length > 0) executaEAtualiza(() => { etapaSelecaoClasse.idClasseEmSelecao = classes[0].id });
        },
        beforeChange: (current: number, next: number) => {
            const nextClasse = classes[next];
            if (nextClasse) executaEAtualiza(() => { etapaSelecaoClasse.idClasseEmSelecao = nextClasse.id });
        },
    };

    // sim, o visual do carrossel e das imagens estao zuadas em esmagadas, tem q ver isso ai
    return (
        <div className={styles.recipiente_carrossel_classes}>
            <Slider {...settings}>
                {classes.map((classe, index) => (
                    <div key={index} className={styles.recipiente_conteudo_slide}>
                        <Image className={styles.item_carrossel_classes} src={classe.img} alt='' fill quality={100} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}