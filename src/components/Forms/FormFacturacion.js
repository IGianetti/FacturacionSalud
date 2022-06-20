import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import "./FormFacturacion.css";
import {
  facturasDB,
  obrasSocialesDB,
  puntosDeVentaDB,
  estadosDB,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  db,
} from "../../firebase";

const initialState = {
  nroFactura: "",
  obraSocial: "",
  puntoDeVenta: "",
  centro: "",
  estado: "",
  importe: "",
  pagoParcial: "",
};
export default function FormFacturacion(props) {
  const [estadoFactura, setEstadoFactura] = useState([]);
  const [obrasSociales, setObrasSociales] = useState([]);
  const [puntosVenta, setPuntosVenta] = useState([]);
  const [saldo, setSaldo] = useState({
    importSaldo: 0,
  });
  const [formInfo, setFormInfo] = useState(initialState);
  useEffect(() => {
    getObrasSociales();
    getPuntosVenta();
    getEstadoFactura();
  }, []);

  useEffect(() => {
    if (props.editInfoFactura) {
      setFormInfo({
        ...formInfo,
        nroFactura: props.editInfoFactura.nroFactura,
        obraSocial: props.editInfoFactura.obraSocial,
        puntoDeVenta: props.editInfoFactura.puntoDeVenta,
        centro: props.editInfoFactura.centro,
        estado: props.editInfoFactura.estado,
        importe: props.editInfoFactura.importe,
        pagoParcial: props.editInfoFactura.pagoParcial,
      });
    }
  }, [props.editInfoFactura]);

  const getObrasSociales = async () => {
    const data = await getDocs(obrasSocialesDB);
    setObrasSociales(data.docs.map((doc) => ({ ...doc.data() }))); //traigo todos los documentos de obras_sociales
  };
  const getPuntosVenta = async () => {
    const data = await getDocs(puntosDeVentaDB);
    setPuntosVenta(data.docs.map((doc) => ({ ...doc.data() }))); //traigo todos los documentos de puntos de venta
  };
  const getEstadoFactura = async () => {
    const data = await getDocs(estadosDB);
    setEstadoFactura(data.docs.map((doc) => ({ ...doc.data() }))); //traigo todos los documentos de estados
  };

  const handleSelectChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
  };

  const handleInputsChange = (e) => {
    let dataUpdate = { ...formInfo, [e.target.name]: e.target.value };
    console.log("data: ", dataUpdate);
    setFormInfo(dataUpdate);
    calcularSaldo(dataUpdate);
  };

  const calcularSaldo = (dataUpdate) => {
    const result = dataUpdate.importe - dataUpdate.pagoParcial;
    console.log("FORMINFO: ", formInfo);
    console.log("resultado: ", result);
    let keySaldo = "importSaldo";

    setSaldo({ ...saldo, [keySaldo]: result });
  };

  const handleSaveForm = () => {
    // eslint-disable-next-line no-unused-expressions
    props.optionBtn === "add"
      ? createFactura()
      : props.optionBtn === "edit"
      ? updateFactura(props.facturaSelected)
      : null;
  };
  const createFactura = async (e) => {
    await addDoc(facturasDB, {
      nroFactura: formInfo.nroFactura,
      obraSocial: formInfo.obraSocial,
      puntoDeVenta: formInfo.puntoDeVenta,
      centro: formInfo.centro,
      estado: formInfo.estado,
      importe: formInfo.importe,
      pagoParcial: formInfo.pagoParcial,
      saldo: saldo.importSaldo,
    });
    setFormInfo(initialState);

    props.setUpdateTable(props.updateTable ? false : true);
  };

  const updateFactura = async (id) => {
    const facturaDoc = doc(db, "facturas", id);
    await updateDoc(facturaDoc, {
      nroFactura: formInfo.nroFactura,
      obraSocial: formInfo.obraSocial,
      puntoDeVenta: formInfo.puntoDeVenta,
      centro: formInfo.centro,
      estado: formInfo.estado,
      importe: formInfo.importe,
      pagoParcial: formInfo.pagoParcial,
      saldo: saldo.importSaldo,
    });
    props.setUpdateTable(props.updateTable ? false : true);
    props.closeModal(true);
  };

  return (
    <Box
      className="box-form"
      sx={{
        width: "100%",
        marginBottom: "1rem",
        flexDirection: "column",
      }}
    >
      <ValidatorForm>
        <Grid container spacing={2}>
          <Grid className="inputs-form" item xs={6} md={6}>
            <TextValidator
              id="outlined-full-width"
              name="nroFactura"
              label="Nro. Factura"
              style={{ margin: 8 }}
              placeholder="000-00000"
              value={formInfo.nroFactura}
              fullWidth
              margin="normal"
              onChange={handleInputsChange}
              variant="outlined"
            />
          </Grid>
          <Grid className="inputs-form" item xs={6} md={6}>
            <SelectValidator
              labelId="demo-multiple-name-label"
              id="select-multiple-op"
              style={{ margin: 8 }}
              name="obraSocial"
              value={
                formInfo.obraSocial === "" || formInfo.obraSocial === undefined
                  ? ""
                  : formInfo.obraSocial
              }
              label="Ob. Social"
              onChange={handleSelectChange}
            >
              {obrasSociales.map((obSoc) => (
                <MenuItem value={obSoc.nombre}>{obSoc.nombre}</MenuItem>
              ))}
            </SelectValidator>
          </Grid>

          <Grid className="inputs-form" item xs={6} md={6}>
            <SelectValidator
              labelId="demo-multiple-name-label"
              id="select-multiple-op"
              style={{ margin: 8 }}
              name="puntoDeVenta"
              value={formInfo.puntoDeVenta === "" ? "" : formInfo.puntoDeVenta}
              label="Punto de Venta"
              onChange={handleSelectChange}
            >
              {puntosVenta.map((puntoVenta) => (
                <MenuItem value={puntoVenta.nombre}>
                  {puntoVenta.nombre}
                </MenuItem>
              ))}
            </SelectValidator>
          </Grid>

          <Grid className="inputs-form" item xs={6} md={6}>
            <TextValidator
              id="outlined-full-width"
              name="centro"
              label="Centro"
              style={{ margin: 8 }}
              placeholder="Centro"
              value={formInfo.centro}
              fullWidth
              margin="normal"
              onChange={handleInputsChange}
              variant="outlined"
            />
          </Grid>

          <Grid className="inputs-form" item xs={6} md={6}>
            <SelectValidator
              id="select-multiple-op"
              style={{ margin: 8 }}
              name="estado"
              value={formInfo.estado === "" ? "" : formInfo.estado}
              label="Estado"
              onChange={handleSelectChange}
            >
              {estadoFactura.map((estado) => (
                <MenuItem value={estado.nombre}>{estado.nombre}</MenuItem>
              ))}
            </SelectValidator>
          </Grid>

          <Grid className="inputs-form" item xs={6} md={6}>
            <TextValidator
              id="outlined-full-width"
              name="pagoParcial"
              label="Pago Parcial"
              style={{ margin: 8 }}
              placeholder="Pago Parcial"
              value={formInfo.pagoParcial}
              fullWidth
              margin="normal"
              onChange={handleInputsChange}
              variant="outlined"
            />
          </Grid>

          <Grid className="inputs-form" item xs={6} md={6}>
            <TextValidator
              id="outlined-full-width"
              name="importe"
              label="Importe"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              style={{ margin: 8 }}
              placeholder="Importe"
              value={formInfo.importe}
              fullWidth
              margin="normal"
              onChange={handleInputsChange}
              variant="outlined"
            />
          </Grid>

          <div className="footer-form">
            <Button
              className="btn-cancel"
              variant="contained"
              onClick={props.closeModal}
            >
              Cancelar
            </Button>
            <Button
              className="btn-accept"
              variant="contained"
              onClick={handleSaveForm}
            >
              {props.optionBtn === "delete" ? "Aceptar" : "Guardar"}
            </Button>
          </div>
        </Grid>
      </ValidatorForm>
      
    </Box>
  );
}
