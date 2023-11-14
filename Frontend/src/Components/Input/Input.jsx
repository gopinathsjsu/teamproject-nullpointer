import './Input.scss';
const Input = ({placeholder, value, onChange, className}) => (
  <input {...{placeholder, value, onChange, className}}/>
);

export default Input;