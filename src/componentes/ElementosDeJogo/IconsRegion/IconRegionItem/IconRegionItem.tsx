'use client';

import styles from './styles.module.css';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';

interface IconRegionItemProps {
    icon: IconDefinition;
    title: string;
    color: string;
    isActive: boolean;
    onClick: () => void;
};

export default function IconRegionItem({ icon, title, color, isActive, onClick }: IconRegionItemProps) {
    return (
        <button type='button' className={cn(styles.container, isActive && styles.container__active)} title={title} aria-label={title} style={{ backgroundColor: color }} onClick={onClick}>
            <FontAwesomeIcon icon={icon} className={styles.icon} />
        </button>
    );
};