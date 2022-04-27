import React, { useEffect, useRef } from 'react'
import { Grid } from '@material-ui/core'

import { SpeechState, useSpeechContext } from '@speechly/react-client'
//import { PushToTalkButton, PushToTalkButtonContainer } from '@speechly/react-ui'

import { Details, Main } from '../components'
import useStyles from '../styles'
import { Box, Button, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function MainIndex() {
  const classes = useStyles()
  const { speechState } = useSpeechContext()
  const main = useRef(null)

  const executeScroll = () => main.current.scrollIntoView()

  useEffect(() => {
    if (speechState === SpeechState.Recording) {
      executeScroll()
    }
  }, [speechState])

  const navigate = useNavigate()

  return (
    <div>
      <Box top={15} left={15} position={'absolute'}>
        <Paper elevation={4}>
          <Button onClick={() => navigate('/shop')} sx={{ color: 'black' }}>
            Shop
          </Button>
        </Paper>
      </Box>
      <Grid
        className={classes.grid}
        container
        spacing={0}
        alignItems="center"
        style={{ height: '100vh' }}
      >
        <Grid item xs={12} sm={4} className={classes.mobile}>
          <Details title="Income" />
        </Grid>
        <Grid ref={main} item xs={12} sm={3} className={classes.main}>
          <Main />
        </Grid>
        <Grid item xs={12} sm={4} className={classes.desktop}>
          <Details title="Income" />
        </Grid>
        <Grid item xs={12} sm={4} className={classes.last}>
          <Details title="Expense" />
        </Grid>
        {/* <PushToTalkButtonContainer>
          <PushToTalkButton />
        </PushToTalkButtonContainer> */}
      </Grid>
    </div>
  )
}

export default MainIndex
