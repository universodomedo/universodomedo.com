import styles from './styles.module.css';

import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export function IconeLinkInformativo({ href, texto }: { href: string; texto: string }) {
    return (
        <Link href={href} target={'_blank'}>
            <FontAwesomeIcon icon={faCircleInfo} className={styles.icone_informativo} title={texto} />
        </Link>
    );
};