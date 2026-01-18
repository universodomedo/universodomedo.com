import styles from './styles.module.css';

import ScrollingTag from '../ScrollingTag/ScrollingTag';

export default function SecaoTags() {
	return (
		<div className={styles.recipiente_tags}>
			<ScrollingTag />
			<ScrollingTag />
		</div>
	);
};