import React from 'react'
import ReactDOM from 'react-dom'
import { SpeechProvider } from '@speechly/react-client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from './context/context'
import App from './App'
import './index.css'

ReactDOM.render(
  <BrowserRouter>
    <SpeechProvider
      appId="7c4aee08-1073-4a32-b862-ebe1850e0732"
      language="en-US"
    >
      <Provider>
        <App />
      </Provider>
    </SpeechProvider>
  </BrowserRouter>,
  document.getElementById('root'),
)
