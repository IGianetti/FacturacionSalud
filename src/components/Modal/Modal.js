import React from "react";
import Dialog from "@mui/material/Dialog";

import "./Modal.css";

export default function Modal({ open, onClose, children, title }) {
  return (
    <Dialog
      onClose={() => onClose}
      open={open}
      className="modal-custom"
      disableEnforceFocus
    >
      {title && <h2 className="subtitle">{title}</h2>}
      {children}
    </Dialog>
  );
}
