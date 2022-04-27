import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
} from "@material-ui/core";
import { Doughnut, Bar } from "react-chartjs-2";

import useStyles from "./styles";
import useTransactions from "../../useTransactions";
import formatDate from "../../utils/formatDate";

const DetailsCard = ({ title, subheader }) => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(
    formatDate(new Date().toUTCString())
  );
  const [endDate, setEndDate] = useState(formatDate(new Date().toUTCString()));

  const { total, chartData, barData, monthlyTotal } = useTransactions(
    startDate,
    endDate,
    title
  );

  return (
    <div>
      <Card className={title === "Income" ? classes.income : classes.expense}>
        <CardHeader title={title} subheader={subheader} />
        <CardContent>
          <Typography variant="h5">${total}</Typography>
          <Doughnut data={chartData} />
        </CardContent>
      </Card>
      <Box mt={5}>
        <Card className={title === "Income" ? classes.income : classes.expense}>
          <CardHeader
            title={`Last Month ${title} Summary`}
            subheader={subheader}
          />

          <Box mx={2}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>

          <CardContent>
            <Typography variant="h5">${monthlyTotal}</Typography>
            <Bar data={barData} />
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default DetailsCard;
