import React, {useEffect, useState} from 'react';

export const InlineEdit = (props) => {
  const initial = props.value;
  const [value, setValue] = useState(props.value || '-');
  const [edit, setEdit] = useState(false);
  const [loader, setLoader] = useState(false);


  useEffect(() => {
    setValue(props.value)
  }, [props.value]);

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const onSave = async (e) => {
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

  const onEdit = async (e) => {
    if (e.target.value && e.key === 'Enter') {
      await onSave(e)
    }
  };

  return (
    edit
      ? <input tabIndex={props.tabindex} onKeyUp={onEdit} onBlur={onSave} defaultValue={value}/>
      : <span className={loader && 'text-muted'} onClick={toggleEdit} onFocus={toggleEdit}
              tabIndex={props.tabindex}>{value}</span>
  )

};
