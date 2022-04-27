import React, { useContext, useState, Typography } from "react";
import {
  List as MUIList,
  ListItem,
  Box,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Grid,
  ListItemSecondaryAction,
  IconButton,
  Slide,
} from "@material-ui/core";
import { Delete, MoneyOff } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import { ExpenseTrackerContext } from "../../../context/context";
import useStyles from "./styles";
import formatDate from "../../../utils/formatDate";

const List = () => {
  const classes = useStyles();
  const { transactions, deleteTransaction } = useContext(ExpenseTrackerContext);
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState(
    formatDate(new Date().toUTCString())
  );
  const [endDate, setEndDate] = useState(formatDate(new Date().toUTCString()));
  const [newTransactions, setNewTransactions] = useState(transactions);

  function SearchByCat() {
    let output = transactions.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
    setNewTransactions(output);
    return output;
  }

  function SearchByDate() {
    let output = transactions.filter(
      (item) => item.date >= startDate && item.date <= endDate
    );
    setNewTransactions(output);
    return output;
  }

  React.useEffect(() => {
    setNewTransactions(transactions);
  }, [transactions]);

  return (
    <Box>
      <Grid container mt={1} spacing={2}>
        <Grid item xs={9}>
          <TextField
            label="Search By Category"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <IconButton onClick={() => SearchByCat()}>
            <SearchIcon />
          </IconButton>
        </Grid>
        <Grid item xs={9}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={9}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <IconButton onClick={() => SearchByDate()}>
            <SearchIcon />
          </IconButton>
        </Grid>
      </Grid>
      <MUIList dense={false} className={classes.list}>
        {newTransactions ? (
          newTransactions.map((transaction) => (
            <Slide
              direction="down"
              in
              mountOnEnter
              unmountOnExit
              key={transaction.id}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    className={
                      transaction.type === "Income"
                        ? classes.avatarIncome
                        : classes.avatarExpense
                    }
                  >
                    <MoneyOff />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={transaction.category}
                  secondary={`$${transaction.amount} - ${transaction.date}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Slide>
          ))
        ) : (
          <Typography>No Record Found</Typography>
        )}
      </MUIList>
    </Box>
  );
};

export default List;
