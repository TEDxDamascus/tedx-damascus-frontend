import { color } from "framer-motion";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

//#region section styles
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const containerStyle = {
  background: "#fff",
  borderRadius: "10px",
  width: "500px",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const headerStyle = {
  padding: "16px",
  borderBottom: "1px solid #eee",
  display: "flex",
  color: "white",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#EB0028",
};

const bodyStyle = {
  padding: "16px",
  overflowY: "auto",
};

const footerStyle = {
  padding: "16px",
  borderTop: "1px solid #eee",
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};
//#endregion

const Dialog = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={overlayStyle} onClick={onClose}>
      <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3>{title}</h3>
          <button onClick={onClose}>×</button>
        </div>

        <div style={bodyStyle}>{children}</div>

        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};

export default Dialog;

//#region How we can use it

// First define what the dialog should display
// const { openDialog, closeDialog } = useDialog();
//   const showDialog = () => {
//     openDialog({
//       title: "Delete User",
//       content: <p>Are you sure you want to delete this user?</p>,
//       footer: (
//         <>
//           <Button
//             variant="outlined"
//             onClick={() => closeDialog}
//             sx={{
//               borderColor: "#e0e0e0",
//               color: "#666",
//               width: "50%",
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={() => {
//               console.log("Deleted!");
//               closeDialog();
//             }}
//             startIcon={<Delete />}
//             sx={{
//               backgroundColor: "#EB0028",
//               width: "50%",
//               "&:hover": { backgroundColor: "#C00020" },
//             }}
//           >
//             Delete
//           </Button>
//         </>
//       ),
//     });
//   };

// Then use it where we want
// <button onClick={showDialog}>Button to open dialog</button>

//#endregion
