import React, {useEffect, useState} from 'react';

export const InlineEditRange = (props) => {
  const initial = props.value;
  const [v, setV] = useState(props.value || 0);
  const [value, setValue] = useState(props.value || 0);
  const [edit, setEdit] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setValue(props.value)
  }, [props.value]);

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const onEdit = async (e) => {
    setEdit(false);
    if (e.target.value === initial) return;
    setLoader(true);
    setValue(e.target.value);
    props.item[props.name] = e.target.value;
    const res = await props.item.save();
    if (res) {
      setLoader(false);
    }
  };

  return (
    edit
      ? <span>[{v}]<input tabIndex={props.tabindex} onChange={(e) => {
        setV(e.target.value)
      }} onBlur={onEdit} type="range" className="custom-range" min={props.min || -5}
                          max={props.max || 5} step={props.step || 1}
                          defaultValue={value}/></span>
      : <span className={loader && 'text-muted'} onClick={toggleEdit} onFocus={toggleEdit}
              tabIndex={props.tabindex}>{value}</span>
  )

};
