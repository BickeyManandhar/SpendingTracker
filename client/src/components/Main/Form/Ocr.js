import React, { useState, useEffect, useCallback } from 'react'
import { Box, Button } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import Tesseract from 'tesseract.js'

function Ocr({ setDataOject, setSpinnerMode }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [image, setImage] = useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (image) {
      setSpinnerMode(true)
    } else {
      setSpinnerMode(false)
    }

    if (error) {
      console.log(error)
    }
  }, [error, image])

  useEffect(() => {
    setImage(true)
    // TODO Regex Expressions Start
    let monthDayYear = /\d{1,2}[\- \/ \.]\d{1,2}[\- \/ \.]\d{2,4}/gi
    let engDate = /[a-z]+[ 0-9]+[,][ ]\d{2,4}/gi
    let totalAmount = /[total amount]+\$[0-9]*[.]?[0-9]+/gi
    let payment = /[payment: ]+\$[0-9]*[.]?[0-9]+/gi
    // TODO Regex Expressions End

    Tesseract.recognize(selectedImage, 'eng')
      .then(({ data: { text } }) => {

        var arrTAmount = text.match(totalAmount)
        var arrPayment = text.match(payment)
        var arrDate = text.match(monthDayYear)
        let engArrDate = text.match(engDate)

        let TA = arrTAmount.find((el) => el.match('TOTAL'))
        let T = arrTAmount.find((el) => el.match('Total'))
        let P = arrPayment.find((el) => el.match('Payment'))

        if (P) {
          var words = P.split(' ')
          let lastElement = words[words.length - 1]
          let value = lastElement.match(/[0-9]*[.]?[0-9]+/gi)

          let obj = { value, arrDate: engArrDate ? engArrDate : arrDate || [] }
          setDataOject(obj)
        }

        if (TA) {
          var words = TA.split(' ')
          let lastElement = words[words.length - 1]
          let value = lastElement.match(/[0-9]*[.]?[0-9]+/gi)

          let obj = { value, arrDate: engArrDate ? engArrDate : arrDate || [] }
          setDataOject(obj)
        }

        if (T) {
          var words = T.split(' ')
          let lastElement = words[words.length - 1]
          let value = lastElement.match(/[0-9]*[.]?[0-9]+/gi)

          let obj = { value, arrDate: engArrDate ? engArrDate : arrDate || [] }
          setDataOject(obj)
        }
        setImage(false)
      })
      .catch((error) => {
        setImage(false)
        console.log(error, 'error')
      })
  }, [selectedImage])

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          if (error.code === 'file-invalid-type')
            setError(`${file.name}: File type is not supported.`)
          else if (error.code === 'too-many-files')
            setError(`Only one image accepted!.`)
          else setError(error.message)
        })
      })
    }
    if (rejectedFiles.length < 1) {
      setSelectedImage(acceptedFiles[0])
      setImage(true)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxFiles: 1,
  })

  return (
    <div>
      <section>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Box
            bgcolor={'#fff'}
            borderRadius={1}
            p={1}
            color={'black'}
            fontWeight={'bold'}
            sx={{ cursor: 'pointer' }}
          >
            <Button sx={{ color: 'black' }}>Add Transaction Via Picture</Button>
          </Box>
        </div>
      </section>
    </div>
  )
}

export default Ocr
