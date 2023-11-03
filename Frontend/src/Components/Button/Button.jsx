import "./Button.scss";
import cx from 'classnames';

const Button = ({children, onClick, type, className}) => {
  return (
    <button className={cx(type, className)} onClick={onClick}>
      {children}
    </button>
  )
};

export default Button;