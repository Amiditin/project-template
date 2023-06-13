import styles from './TemplateName.module.scss';

interface ITemplateNameProps {
  title: string;
}

export const TemplateName: React.FC<ITemplateNameProps> = () => {
  return <div className={styles.templateName}>TemplateName Component</div>;
};
