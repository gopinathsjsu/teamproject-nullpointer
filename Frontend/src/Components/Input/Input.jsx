import './Input.scss';
const Input = ({placeholder, value, onChange, className, type, min, max, disabled, name}) => (
  <input {...{placeholder, value, onChange, className, type: type || "text", min, max, disabled, name}}/>
);

export default Input;