import * as React from 'react'
import Box from '@mui/material/Box'
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import ItemCard from './ItemCard'
import Spinner from '../../components/Spinner/Spinner'
import { useNavigate } from 'react-router-dom'

export default function ShopScreen() {
  const navigate = useNavigate()

  const [product, setProduct] = React.useState([])
  const [spinnerMode, setSpinnerMode] = React.useState(false)
  const [apiFilter, setApiFilter] = React.useState([])

  const [selectedFilter, setSelectedFilter] = React.useState(false)
  const [filteredObjects, setFilteredObjects] = React.useState(null)
  const [inputValue, setInputValue] = React.useState(null)

  let filteredRecord = filteredObjects?.sort((a, b) =>
    a?.extracted_price < b?.extracted_price ? -1 : 1,
  )
  let nonFilteredRecord = product?.sort((a, b) =>
    a?.extracted_price < b?.extracted_price ? -1 : 1,
  )

  let priceWise = filteredObjects === null ? nonFilteredRecord : filteredRecord

  const makeAPICall = async (selectedFilter) => {
    try {
      setSpinnerMode(true)
      const response = await fetch(`http://localhost:7000/getProducts/?filter=${selectedFilter}&search=${inputValue}`,{ mode: 'cors' },)
      const data = await response.json()
      setProduct(data.shopping_results)
      setSpinnerMode(false)
    } catch (e) {
      setSpinnerMode(false)
      console.log(e)
    }
  }

  const getFilters = async () => {
    try {
      setSpinnerMode(true)
      setInputValue(null)
      setSelectedFilter(false)
      const response = await fetch(`http://localhost:7000/getFilters`, {mode: 'cors'})
      const data = await response.json()
      setApiFilter(data)
      setSpinnerMode(false)
    } catch (e) {
      setSpinnerMode(false)
      console.log(e)
    }
  }

  const getText = async (value) => {
    if (value === null || value?.length <= 1 || value === undefined || value === '')
      setInputValue(null)
    else setInputValue(value)

    setSpinnerMode(true)
    const response = await fetch(`http://localhost:7000/getProducts/?filter=${selectedFilter}&search=${inputValue}`, { mode: 'cors' })
    const data = await response.json()
    setProduct(data.shopping_results)
    setSpinnerMode(false)
  }

  const handleCheckBox = (val) => {
    setSelectedFilter(val)
    setFilteredObjects(null)
  }

  React.useEffect(() => {
    getText(inputValue)
  },[inputValue])

  React.useEffect(() => {
    getFilters()
  }, [])

  React.useEffect(() => {
    makeAPICall(selectedFilter)
  }, [selectedFilter])

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper sx={{ marginX: 2, marginY: 3, minHeight: '80vh' }}>
            <Box width={'100%'}>
              <Spinner spinnerMode={spinnerMode} />
              <Box mx={4} pb={4}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <Button onClick={() => navigate('/')}>Back</Button>
                  </Grid>
                  <Grid item md={12}>
                    {/* <select id="mySelect" onchange="setTimeout(myFunction, 5000);"> */}
                    <TextField
                      placeholder="Search Product..."
                      fullWidth
                      type="text"
                      onKeyUp={(e) => getText(e.target.value)}
                    />
                  </Grid>
                  <Grid item md={2.5}>
                    {(selectedFilter || inputValue) && (
                      <Box p={2} mb={2}>
                        <Button
                          sx={{ width: '100%' }}
                          variant={'contained'}
                          onClick={getFilters}
                        >
                          Reset Filter
                        </Button>
                      </Box>
                    )}
                    {apiFilter?.map((item, index) => {
                      return (
                        <Box
                          key={index}
                          borderRadius={2}
                          border={'1px solid gray'}
                          p={2}
                          mb={2}
                        >
                          <Typography>{item.type}</Typography>
                          {item?.options?.map((el, index) => {
                            return (
                              <Box key={index}>
                                <RadioGroup
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  defaultValue="female"
                                  name="radio-buttons-group"
                                >
                                  <FormControlLabel
                                    onClick={() => handleCheckBox(el.tbs)}
                                    control={
                                      <Checkbox
                                        checked={
                                          el.tbs === selectedFilter && true
                                        }
                                      />
                                    }
                                    label={el.text}
                                  />
                                </RadioGroup>
                              </Box>
                            )
                          })}
                        </Box>
                      )
                    })}
                  </Grid>
                  <Grid item md={9.5}>
                    <Grid container spacing={2}>
                      {priceWise?.map((el, index) => {
                        return (
                          <Grid
                            key={index}
                            item
                            xs={12}
                            sm={4}
                            md={3}
                            lg={3}
                            xl={2}
                          >
                            <ItemCard
                              title={el.title}
                              thumbnail={el.thumbnail}
                              price={el.price}
                              tag={el.tag}
                              rating={el.rating}
                              reviews={el.reviews}
                              extensions={el.extensions}
                              source={el.source}
                              delivery={el.delivery}
                            />
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
