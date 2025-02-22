import style from './style.module.css';
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faX } from "@fortawesome/free-solid-svg-icons";

interface IconeFACustomizavelProps {
    icon: IconDefinition;
    exibeX?: boolean;
    titulo?: string;
};

const IconeFACustomizavel: React.FC<IconeFACustomizavelProps> = ({ icon, exibeX, titulo }) => {
    return (
        <div className={style.recipiente_icone_customizavel}>
            <FontAwesomeIcon icon={icon} title={titulo} />
            {exibeX && ( <FontAwesomeIcon className={style.icone_customizavel_x} icon={faX} />)}
        </div>
    );
};

export default IconeFACustomizavel;