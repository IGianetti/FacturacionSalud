import React, { useState, useEffect } from "react";
//internal components
import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import FormFacturacion from "../../components/Forms/FormFacturacion";
import {
  facturasDB,
  getDocs,
  getDoc,
  doc,
  db,
  deleteDoc,
} from "../../firebase";

//external components
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

//styles
import "./HomePage.css";

export default function HomePage() {
  // traer la coleccion de datos de firebase
  const facturasCollectionRef = facturasDB;

  //declaro y seteo los estados de los botones, apertura-cierre del modal y el estado de los datos
  const [optionBtn, setOptionBtn] = useState("");
  const [facturasDatos, setFacturaDatos] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [editInfoFactura, setEditInfoFactura] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [facturaSelected, setFacturaSelected] = useState("");
  const [disabledButtons, setDisabledButtons] = useState(true);

  //se carga cada vez que renderiza
  useEffect(() => {
    const getFacturasDatos = async () => {
      const data = await getDocs(facturasCollectionRef);
      setFacturaDatos(
        data.docs.map((doc) => {
          const { id } = doc;
          const {
            nroFactura,
            obraSocial,
            puntoDeVenta,
            centro,
            estado,
            importe,
            pagoParcial,
            saldo,
          } = doc.data();
          const objFacturaDG = {
            id: id,
            nroFactura: nroFactura,
            obraSocial: obraSocial,
            puntoDeVenta: puntoDeVenta,
            centro: centro,
            estado: estado,
            importe: importe,
            pagoParcial: pagoParcial,
            saldo: saldo,
          };

          return objFacturaDG;
        })
      );
    };
    getFacturasDatos();
  }, [updateTable]);

  const handleFacturasSelected = (e) => {
    setFacturaSelected(e.id);
    setDisabledButtons(false);
  };

  const getFacturaUpdate = async () => {
    const docRef = doc(db, "facturas", facturaSelected);
    const dataUp = await getDoc(docRef);
    setEditInfoFactura(dataUp.data());
  };

  const deleteFactura = async (facturaSelected) => {
    const docRef = doc(db, "facturas", facturaSelected);
    await deleteDoc(docRef);
    closeModal(true);
    setUpdateTable(updateTable ? false : true);
  };

  const btnAdd = (e) => {
    setOptionBtn(e.target.name);
    setOpenModal(true);
  };
  const btnEdit = (e) => {
    setOptionBtn(e.target.name);

    getFacturaUpdate();
    setOpenModal(true);
  };
  const btnDelete = (e) => {
    setOptionBtn(e.target.name);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };
  return (
    <>
      <div className="container-homepage">
        <Modal
          open={openModal}
          onClose={closeModal}
          title={
            optionBtn === "delete"
              ? "Borrar Factura"
              : optionBtn === "add"
              ? "Agregar Factura"
              : "Editar Factura"
          }
        >
          <div className="body-modal">
            {optionBtn === "delete" ? (
              <div className="body-modal-msg">
                <p>Está seguro que desea eliminar la factura?</p>
                <div className="footer-modal-delete">
                  <Button
                    className="btn-cancel"
                    variant="contained"
                    onClick={closeModal}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="btn-accept"
                    type="submit"
                    variant="contained"
                    onClick={() => {
                      deleteFactura(facturaSelected);
                    }}
                  >
                    {optionBtn === "delete" ? "Aceptar" : "Guardar"}
                  </Button>
                </div>
              </div>
            ) : optionBtn === "edit" ? (
              <FormFacturacion
                editInfoFactura={editInfoFactura}
                facturaSelected={facturaSelected}
                setUpdateTable={setUpdateTable}
                updateTable={updateTable}
                closeModal={closeModal}
                optionBtn={optionBtn}
                upgrade={getFacturaUpdate}
              />
            ) : (
              <FormFacturacion
                setUpdateTable={setUpdateTable}
                facturaSelected={facturaSelected}
                updateTable={updateTable}
                closeModal={closeModal}
                optionBtn={optionBtn}
                upgrade={getFacturaUpdate}
              />
            )}
          </div>
        </Modal>
        <div className="btn-options">
          <Stack direction="row" spacing={1}>
            <Button variant="contained" name="add" onClick={btnAdd}>
              <AddIcon />
              Agregar
            </Button>
            <Button
              variant="contained"
              name="edit"
              onClick={btnEdit}
              disabled={disabledButtons}
            >
              <EditIcon />
              Editar
            </Button>
            <Button
              variant="contained"
              name="delete"
              onClick={btnDelete}
              disabled={disabledButtons}
            >
              <DeleteIcon />
              Eliminar
            </Button>
          </Stack>
        </div>

        {facturasDatos.length > 0 ? (
          <Table
            rows={facturasDatos}
            executeOnRowClick={handleFacturasSelected}
          />
        ) : (
          <div className="without-info">
            <span>Sin facturas cargadas</span>
          </div>
        )}
      </div>
    </>
  );
}
