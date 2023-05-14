import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import multer from 'multer'
import formidable from 'formidable'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import child_process from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const uploadArrytmia = multer({ dest: 'arrytmia' }).array('fieldname')

const arrytmiaTempPath = path.join(__dirname, 'arrytmia', 'temp')
const dislocationTempPath = path.join(__dirname, 'dislocation', 'temp')

app.use(cors())
app.use(bodyParser.json())

app.post('/predict', (req, res) => {
  const form = formidable({ multiples: true })
  form.parse(req, (err, fields, files) => {
    console.log('PREDICTION FILES', files)
    files.file.forEach(file => {
      fs.copyFileSync(
        file.filepath,
        path.join(arrytmiaTempPath, file.originalFilename)
      )
    })

    const arrytmiaScript = path.join(
      __dirname,
      'arrytmia',
      'processing',
      'arrytmia.py'
    )

    child_process.exec(`python ${arrytmiaScript}`, (err, data) => {
      if (!err) {
        console.log('PYTHON RES', JSON.parse(data))
        res.send({ data: data })
      } else {
        console.log('ERROR PYTHON', err)
        res.send({ error: err })
      }
      fs.rmdirSync(arrytmiaTempPath, { recursive: true, force: true })
			fs.mkdirSync(arrytmiaTempPath)
    })
  })
})

app.post('/dislocation', (req, res) => {
  const form = formidable({ multiples: true })
  form.parse(req, (err, fields, files) => {
    console.log('FILES', files)
    if (Array.isArray(files.file)) {
      files.file.forEach(file => {
        fs.copyFileSync(
          file.filepath,
          path.join(dislocationTempPath, file.originalFilename)
        )
      })
    } else {
      fs.copyFileSync(
        files.file.filepath,
        path.join(dislocationTempPath, files.file.originalFilename)
      )
    }

    const dislocationScript = path.join(
      __dirname,
      'dislocation',
      'processing',
      'dislocation.py'
    )

    child_process.exec(`python ${dislocationScript}`, (err, data) => {
      if (!err) {
        console.log('DISLOCATION RES', JSON.parse(data))
        res.send({ data: data })
      } else {
        console.log('DISLOCATION ERROR PYTHON', err)
        res.send({ error: err })
      }
      fs.rmdirSync(dislocationTempPath, { recursive: true, force: true })
			fs.mkdirSync(dislocationTempPath)
    })
  })
})

app.post('/json_to_csv', (req, res) => {
  res.sendFile(path.join(__dirname, 'arrytmia/processing/result.csv'))
})

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})
