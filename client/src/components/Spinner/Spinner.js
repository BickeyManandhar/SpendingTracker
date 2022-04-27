import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Spinner({spinnerMode}) {
  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 99999 }} open={spinnerMode}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}
