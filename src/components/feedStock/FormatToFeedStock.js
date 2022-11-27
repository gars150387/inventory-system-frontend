import React from "react";
import { useForm } from "../../hooks/useForm";
import { apiBase } from "../api/Api";

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
  } = useForm(initialForm);

  const handleSubmitInfo = async (event) => {
    event.preventDefault();
    apiBase.post("/item/new_item", {
      name: initialForm.nombre,
      description:{
        size: initialForm.nombre,
        color: initialForm.color,
        brand: initialForm.marca,
        resume: initialForm.descripcion,
      },
        cost: initialForm.costo,
        quantity: initialForm.cantidad,
        price: initialForm.precio
    });
  };

  return (
    <div className="container-form-page">
      <form onClick={handleSubmitInfo} className="container-form">
        <div>
          <label>Nombre</label>
          <input name="nombre" value={nombre} onChange={onInputChange} />
        </div>
        <div>
          <label>Tamano</label>
          <input name="tamano" value={tamano} onChange={onInputChange} />
        </div>
        <div>
          <label>color</label>
          <input name="color" value={color} onChange={onInputChange} />
        </div>
        <div>
          <label>Marca</label>
          <input name="marca" value={marca} onChange={onInputChange} />
        </div>
        <div>
          <label>Descripcion</label>
          <input
            name="descripcion"
            value={descripcion}
            onChange={onInputChange}
          />
        </div>
        <div>
          <label>Costo</label>
          <input name="costo" value={costo} onChange={onInputChange} />
        </div>
        <div>
          <label>Cantidad</label>
          <input name="cantidad" value={cantidad} onChange={onInputChange} />
        </div>
        <div>
          <label>Precio</label>
          <input name="precio" value={precio} onChange={onInputChange} />
        </div>
          <button type="submit">Agredar a inventario</button>
      </form>
    </div>
  );
};
