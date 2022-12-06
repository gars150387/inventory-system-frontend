import React, { useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useForm } from "../../hooks/useForm";
import { apiBase } from "../api/Api";
import "../feedStock/formatFeed.css";

const customStyles = {
  content: {
    width: "40%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#212529",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

const objItem = {
  nombre: "",
  tamano: "",
  color: "",
  marca: "",
  descripcion: "",
  costo: "",
  cantidad: "",
  precio: "",
};
export const EditItemModal = ({
  itemInfoToModal,
  modalState,
  setModalState,
}) => {
  console.log(
    "🚀 ~ file: EditItemModal.js:37 ~ itemInfoToModal",
    itemInfoToModal
  );
  const [inputValues, setInputValues] = useState(objItem);
  const {
    nombre,
    tamano,
    color,
    marca,
    descripcion,
    costo,
    precio,
    onInputChange,
  } = useForm(inputValues);

  //   function afterOpenModal() {
  //     // references are now sync'd and can be accessed.
  //     subtitle.style.color = "#f00";
  //   }

  function closeModal() {
    setModalState(false);
  }

  const handleEditItem = async (event) => {
    event.preventDefault();
    console.log("item info", itemInfoToModal);

    const response = await apiBase.put(
      `/item/edit-item-quantity/${itemInfoToModal._id}`,
      {
        name: nombre,
        size: tamano,
        color: color,
        brand: marca,
        resume: `${descripcion}, ${nombre}, ${tamano}, ${color}, ${marca}`,
        cost: costo,
        quantity: itemInfoToModal.quantity,
        price: precio,
      }
    );
    if (response) {
      Swal.fire("Success", "item fue editado exitosamente", "success");
    }
    closeModal();
    setInputValues({
      nombre: "",
      tamano: "",
      color: "",
      marca: "",
      descripcion: "",
      costo: "",
      cantidad: "",
      precio: ""
    });
  };

  return (
    <div>
      <Modal
        isOpen={modalState}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Editar Item"
      >
        <form className="container-form">
          <div className="input-field">
            <label>Nombre</label>
            <input
              name="nombre"
              value={nombre}
              onChange={onInputChange}
              placeholder={itemInfoToModal.name}
            />
          </div>
          <div className="input-field">
            <label>Tamano</label>
            <input
              name="tamano"
              value={tamano}
              onChange={onInputChange}
              placeholder={itemInfoToModal.size}
            />
          </div>
          <div className="input-field">
            <label>color</label>
            <input
              name="color"
              value={color}
              onChange={onInputChange}
              placeholder={itemInfoToModal.color}
            />
          </div>
          <div className="input-field">
            <label>Marca</label>
            <input
              name="marca"
              value={marca}
              onChange={onInputChange}
              placeholder={itemInfoToModal.brand}
            />
          </div>
          <div className="input-field">
            <label>Descripcion</label>
            <input
              name="descripcion"
              value={descripcion}
              onChange={onInputChange}
              placeholder={itemInfoToModal.resume}
            />
          </div>
          <div className="input-field">
            <label>Costo</label>
            <input
              name="costo"
              value={costo}
              onChange={onInputChange}
              placeholder={itemInfoToModal.cost}
            />
          </div>
          <div className="input-field">
            <label>Precio</label>
            <input
              name="precio"
              value={precio}
              onChange={onInputChange}
              placeholder={itemInfoToModal.price}
            />
          </div>
          <button onClick={closeModal}>Cancelar</button>
          <button onClick={handleEditItem}>Editar Item</button>
        </form>
      </Modal>
    </div>
  );
};
