'use client';

import styles from './styles.module.css';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import cn from 'classnames';

import IconRegionItem from '../IconRegionItem/IconRegionItem';

export interface IconsRegionItemDto {
    id: string;
    icon: IconDefinition;
    title: string;
    color: string;
    isActive: boolean;
    onClick: () => void;
};

interface IconsRegionProps {
    items: IconsRegionItemDto[];
    className?: string;
};

export default function IconsRegion({ items, className }: IconsRegionProps) {
    return (
        <div className={cn(styles.container, className)}>
            {items.map((item) => <IconRegionItem key={item.id} icon={item.icon} title={item.title} color={item.color} isActive={item.isActive} onClick={item.onClick} />)}
        </div>
    );
};