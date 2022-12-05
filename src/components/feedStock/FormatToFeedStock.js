import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { apiBase } from "../api/Api";
import './formatFeed.css'

const initialForm = {
  nombre: "",
  tamano: "",
  color: "",
  marca: "",
  descripcion: "",
  costo: "",
  cantidad: "",
  precio: "",
};
export const FormatToFeedStock = () => {
  const [inputValues, setInputValues] = useState(initialForm)
  const {
    nombre,
    tamano,
    color,
    marca,
    descripcion,
    costo,
    cantidad,
    precio,
    onInputChange,
  } = useForm(inputValues);

  const handleSubmitInfo = async (event) => {
    event.preventDefault();
    const response = await apiBase.post("/item/new_item", {
      name: nombre,
      size: tamano,
      color: color,
      brand: marca,
      resume: `${descripcion}, ${nombre}, ${tamano}, ${color}, ${marca}`,
      cost: costo,
      quantity: cantidad,
      price: precio,
    });
    if (response) {
      alert("Item agregado");
      setInputValues({
        nombre: "",
        tamano: "",
        color: "",
        marca: "",
        descripcion: "",
        costo: "",
        cantidad: "",
        precio: "",
      })
    }
  };

  return (
    <div className="container-form-page">
      <form onClick={handleSubmitInfo} className="container-form">
        <div className="input-field">
          <label>Nombre</label>
          <input name="nombre" value={nombre} onChange={onInputChange} />
        </div>
        <div className="input-field">
          <label>Tamano</label>
          <input name="tamano" value={tamano} onChange={onInputChange} />
        </div>
        <div className="input-field">
          <label>color</label>
          <input name="color" value={color} onChange={onInputChange} />
        </div>
        <div className="input-field">
          <label>Marca</label>
          <input name="marca" value={marca} onChange={onInputChange} />
        </div>
        <div className="input-field">
          <label>Descripcion</label>
          <input
            name="descripcion"
            value={descripcion}
            onChange={onInputChange}
          />
        </div>
        <div className="input-field">
          <label>Costo</label>
          <input name="costo" value={costo} onChange={onInputChange} />
        </div>
        <div className="input-field">
          <label>Cantidad</label>
          <input name="cantidad" value={cantidad} onChange={onInputChange} />
        </div>
        <div className="input-field">
          <label>Precio</label>
          <input name="precio" value={precio} onChange={onInputChange} />
        </div>
        <button type="submit">Agredar a inventario</button>
      </form>
    </div>
  );
};
