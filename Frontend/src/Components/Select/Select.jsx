import "./Select.scss";

const Select = ({label, name, options, onChange}) =>{

  return(
  <div className="select-container">
    <label>{label}</label>
      <select name={name} id={name} onChange={onChange}>
        {
          options?.map(option => (
          <option value={option}>
            {option}
          </option>))
        }
      </select>
  </div>
  )
};

export default Select;