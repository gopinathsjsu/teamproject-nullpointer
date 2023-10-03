import "./Button.scss";
// import cx from 'clas'

const Button = ({children, onClick, type}) => {
  return (
    <button className={type} onClick={onClick}>
      {children}
    </button>
  )
};

export default Button;