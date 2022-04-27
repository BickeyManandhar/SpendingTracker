import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";

import { useSpeechContext } from "@speechly/react-client";
import Snackbar from "../../Snackbar/Snackbar";
import formatDate from "../../../utils/formatDate";
import { ExpenseTrackerContext } from "../../../context/context";
import {
  incomeCategories,
  expenseCategories,
} from "../../../constants/categories";
import useStyles from "./styles";
import { Box } from "@mui/material";
import Ocr from "./Ocr";
import Spinner from "../../Spinner/Spinner";

const initialState = {
  amount: "",
  category: "",
  type: "Income",
  date: formatDate(new Date().toUTCString()),
};

const NewTransactionForm = () => {
  const classes = useStyles();
  const { addTransaction } = useContext(ExpenseTrackerContext);
  const [formData, setFormData] = useState(initialState);
  const { segment } = useSpeechContext();
  const [open, setOpen] = React.useState(false);
  const [spinnerMode, setSpinnerMode] = React.useState(false);
  const [dataOject, setDataOject] = React.useState(null);
  const [errorText, setErrorText] = React.useState("");
  const [catText, setCatText] = React.useState("");

  const createTransaction = () => {
    let catRegex = /[a-z0-9]/gi;
    if (catRegex.test(formData.category) === false) {
      setCatText("Category is required");
      return;
    }

    let amountRegex = /([1-9]*[.])?[1-9]+/gi;

    if (
      amountRegex.test(formData.amount) === false ||
      !formData.date.includes("-")
    ) {
      setErrorText("Amount is not correct");
      return;
    }

    if (incomeCategories.map((iC) => iC.type).includes(formData.category)) {
      setFormData({ ...formData, type: "Income" });
    } else if (
      expenseCategories.map((iC) => iC.type).includes(formData.category)
    ) {
      setFormData({ ...formData, type: "Expense" });
    }

    setOpen(true);
    addTransaction({
      ...formData,
      amount: Number(formData.amount),
      id: uuidv4(),
    });
    setFormData(initialState);
    setErrorText("");
    setCatText("");
  };

  const amountFun = (value) => {
    let regexValue = /([0-9]*[.])?[0-9]+/gi.test(value);

    if (regexValue) {
      setFormData({
        ...formData,
        amount: value,
      });
    } else {
      setFormData({
        ...formData,
        amount: "",
      });
    }
  };

  useEffect(() => {
    if (segment) {
      if (segment.intent.intent === "add_expense") {
        setFormData({ ...formData, type: "Expense" });
      } else if (segment.intent.intent === "add_income") {
        setFormData({ ...formData, type: "Income" });
      } else if (
        segment.isFinal &&
        segment.intent.intent === "create_transaction"
      ) {
        return createTransaction();
      } else if (
        segment.isFinal &&
        segment.intent.intent === "cancel_transaction"
      ) {
        return setFormData(initialState);
      }

      segment.entities.forEach((s) => {
        const category = `${s.value.charAt(0)}${s.value
          .slice(1)
          .toLowerCase()}`;

        switch (s.type) {
          case "amount":
            setFormData({ ...formData, amount: s.value });
            break;
          case "category":
            if (incomeCategories.map((iC) => iC.type).includes(category)) {
              setFormData({ ...formData, type: "Income", category });
            } else if (
              expenseCategories.map((iC) => iC.type).includes(category)
            ) {
              setFormData({ ...formData, type: "Expense", category });
            }
            break;
          case "date":
            setFormData({ ...formData, date: s.value });
            break;
          default:
            break;
        }
      });

      if (
        segment.isFinal &&
        formData.amount &&
        formData.category &&
        formData.type &&
        formData.date
      ) {
        createTransaction();
      }
    }

    if (dataOject) {
      if (dataOject?.arrDate[0]) {
        var dd = new Date(dataOject?.arrDate[0]);
        dd.setUTCDate(dd.getUTCDate() + 1);
      }

      setFormData({
        ...formData,
        amount: dataOject?.value[0] ? dataOject?.value[0] : "",
        date: formatDate(
          dataOject?.arrDate[0] ? dd : formatDate(new Date().toUTCString())
        ),
      });
    }
  }, [dataOject, segment]);

  const selectedCategories =
    formData.type === "Income" ? incomeCategories : expenseCategories;

  return (
    <Grid container spacing={2}>
      <Snackbar open={open} setOpen={setOpen} />
      <Spinner spinnerMode={spinnerMode} />
      <Grid item xs={12}>
        <Box display={"flex"} justifyContent={"center"}>
          <Ocr setDataOject={setDataOject} setSpinnerMode={setSpinnerMode} />
        </Box>
        <Typography align="center" variant="subtitle2" gutterBottom>
          {segment ? (
            <div className="segment">
              {segment.words.map((w) => w.value).join(" ")}
            </div>
          ) : null}
          {/* {isSpeaking ? <BigTranscript /> : "Start adding transactions"} */}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {selectedCategories.map((c) => (
              <MenuItem key={c.type} value={c.type}>
                {c.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography style={{ marginLeft: 7, color: "red", fontSize: "12px" }}>
          {catText}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <TextField
          type="text"
          label="Amount"
          value={formData.amount}
          onChange={(e) => amountFun(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: formatDate(e.target.value) })
          }
        />
      </Grid>
      <Typography style={{ marginLeft: 7, color: "red", fontSize: "12px" }}>
        {errorText}
      </Typography>
      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        fullWidth
        onClick={createTransaction}
      >
        Create
      </Button>
    </Grid>
  );
};

export default NewTransactionForm;
