import Field from "./Field.jsx";
import React from "react";

export default function Table(props) {
  const fields = [];
  for (let id in props.fields) {
    const el = props.fields[id];
    fields.push(
      <Field
        key={"field"+id}
        {...el}
        update={props.update("fields", id, validateField)}
        removeField={() => removeField(id)}
        tableName={props.name}
      />
    );
  }

  let newName;
  function handleChange(e) {
    newName = e.target.value;
    props.update({ name: newName });
  }
  function addField() {
    const id = parseInt(Object.keys(props.fields).pop()) + 1 || 1;
    props.update({
      fields: {
        ...props.fields,
        [id]: {
          name: "",
          type: "",
          length: "",
          primaryKey: false,
          unique: false,
          notNull: false,
          defaultValue: "",
          checkCondition: "",
          foreignKey: {
            tableName: "",
            fieldName: "",
          },
        },
      }
    });
  }
  function removeField(id) {
    const newFields = { ...props.fields };
    delete newFields[id];
    props.update({
      fields: newFields
    });
  }

  function validateField (delta, path) {
    if (delta.name) {
      for (const id in props.fields) {
        const field = props.fields[id];
        if (field.name === delta.name) {
          throw new Error(`Cannot rename table '${field.name}' to '${delta.name}' because the name is already in use.`)
        }
      }
    }
    return true;
  }

  //style={{ position: 'absolute', top: props.position.y, left: props.position.x }}
  return (
    <div id="tables" onMouseDown={props.move}>
      <input type="text" id="Rename" value={props.name} onChange={handleChange}></input>

      <button className="fieldButtons" id="addtable" onClick={addField}>
        Add Field
      </button>
      <button className="removeTable" id="removetable" onClick={props.remove}>
        Remove Table
      </button>

      <div className="fieldsList" onMouseDown={(ev) => ev.stopPropagation()}>
        <div className="row">
          <div></div>
          <div className="column-header">Name</div>
          <div className="column-header">Type</div>
          <div className="column-header">Length</div>
          <div className="column-header">Default</div>
          <div className="column-header">Condition</div>
          <div className="column-header">P</div>
          <div className="column-header">U</div>
          <div className="column-header">R</div>
          <div className="column-header">F-Key</div>
          <div></div>
        </div>  
        {fields}
      </div>
    </div>
  );
}
