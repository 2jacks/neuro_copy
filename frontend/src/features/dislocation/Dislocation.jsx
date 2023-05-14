import React, { useEffect, useState, useMemo } from 'react'
import styles from './Dislocation.module.css'

import { classDescriptions } from './classDescriptions'

import { downloadCsv } from '../../utils/download'

import { config } from '../../network-config'

import { Input, Button, Table } from 'antd'

function Dislocation() {
  const [fileList, setFileList] = useState([])

  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const onFileListChanged = e => {
    setFileList([...e.target.files])
  }

  const onSendButtonClicked = async () => {
    setError(null)
    setIsLoading(true)

    const formData = new FormData()

    fileList.forEach(file => {
      formData.append('file', file)
    })

    fetch(`${config.addr}/dislocation`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log('DISLOCATION DATA', JSON.parse(data.data))
        setPrediction(JSON.parse(data.data))
      })
      .catch(error => {
        setError(error)
        console.log('DISLOCATION ERROR', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onExportCsvButtonClicked = async () => {
    fetch(`${config.addr}/json_to_csv`, {
      method: 'POST',
      body: JSON.stringify(prediction)
    })
      .then(res => {
        return res.text()
      })
      .then(fileData => {
        downloadCsv('dislocation.csv', fileData)
      })
  }

  const predictionTable = useMemo(() => {
    if (prediction) {
      const columns = [
        {
          title: 'Описание',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: 'Класс',
          dataIndex: 'class',
          key: 'class'
        },
        {
          title: 'Вероятность',
          dataIndex: 'value',
          key: 'value'
        }
      ]

      const tables = prediction?.data.map(file => {
        let classes = Object.entries(prediction?.data[0]).filter(key =>
          key[0].startsWith('Class')
        )
        const rows = classes.map(_class => {
          return {
            description: classDescriptions[_class[0]],
            value: _class[1],
            class: _class[0]
          }
        })
        let filename = file['File list']
        return { filename: filename, rows: rows }
      })

      return tables.map((file, index) => {
        return (
          <div key={'dislocation' + index} style={{ borderBottom: 20 }}>
            <h3>{file.filename}</h3>
            <Table
              bordered
              loading={isLoading}
              pagination={false}
              dataSource={file.rows}
              columns={columns}
              scroll={{ x: '100%' }}
            />
          </div>
        )
      })
    } else return null
  }, [isLoading, prediction])

  return (
    <div className={styles.root}>
      <h2 style={{ textAlign: 'center' }}>Dislocation</h2>
      <p>
        The proposed service is intended to identify the facts of erroneous
        electrode placement.
      </p>
      <p>The following situations can be identified:</p>
      <p>
        Disposition 1. Thoracic electrodes C1 — C6 are 2 intercostal spaces
        above the standard scheme 2. Thoracic electrodes C1 — C6 are 2
        intercostal spaces below the standard scheme
      </p>
      <p>
        Chest leads 3. Swapped C1 — C2 4. Swapped C5 — C6 5.Electrodes C4+C5+C6
        are very close to each other (touching) 6. Electrodes C4+C5+C6 are
        located on the intercostal space (not horizontal line, but curve
        upwards) 7. All electrodes are in a straight line from C1 to C6 (V1 —
        V6)
      </p>
      <p>Electrode transposition:</p>
      <p>
        Standard leads <br></br> 8. Swapped — Right hand (Red) with Left hand
        (Yellow) 9. Swapped — Left arm (Yellow) with Left leg (Green)
      </p>

      <div className={styles.form}>
        <Input type='file' multiple onChange={onFileListChanged} />
        <div data-v-063f1ad4='' style={{ color: 'rgba(0,0,0,0.5)' }}>
          The value 0.86 - 1 means belonging to the class
          <br data-v-063f1ad4='' /> A value of 0 - 0.86 means no class
          membership
          <br data-v-063f1ad4='' /> If in all rows the values are less than
          0.86, this means “NORMAL. ALL ELECTRODES ARE CORRECTLY POSITIONED"{' '}
        </div>

        <Button
          onClick={onSendButtonClicked}
          type='primary'
          disabled={fileList.length === 0}
          loading={isLoading}
        >
          Анализ
        </Button>
      </div>

      <div data-v-b3114c99='' style={{ color: 'rgba(0,0,0,0.5)' }}>
        <p data-v-b3114c99=''>
          {' '}
          Files to download (requirement for input files)
          <br data-v-b3114c99='' /> Files must be «.edf» format. Digitized data
          are used as initial data. electrocardiograms in the European data File
          (EDF) format with a frequency sampling 500 Hz.
          <br data-v-b3114c99='' /> «.edf» file containing 12-lead ECG
          recordings: I, II, III, AvR, AvL, AvF, V1-V6 (C1-C6){' '}
        </p>
      </div>

      {error && <div style={{ marginBottom: 20 }}>{error}</div>}
      <div style={{ marginTop: 20, width: '100%', overflow: 'auto' }}>
        {predictionTable}
      </div>
      {/* {prediction && (
        <Button onClick={onExportCsvButtonClicked}>Export CSV</Button>
      )} */}
    </div>
  )
}

export default Dislocation
