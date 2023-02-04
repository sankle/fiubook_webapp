import styles from '@styles/IconWithText.module.css';

export default function IconWithText({
  icon,
  text,
}: {
  icon: JSX.Element;
  text: JSX.Element;
}): JSX.Element {
  return (
    <div className={styles.iconWithText}>
      {icon}
      {text}
    </div>
  );
}
