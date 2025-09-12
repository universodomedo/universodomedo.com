'use client';

import styles from './styles.module.css';
import React, { ReactNode } from 'react';
import cn from 'classnames';

export default function InputComRotulo({ rotulo, classname, children }: { rotulo: string; classname?: string; children: ReactNode; }) {
    return (
        <div className={cn(styles.input_e_rotulo, classname)}>
            <h3>{rotulo}</h3>

            {children}
        </div>
    );
};