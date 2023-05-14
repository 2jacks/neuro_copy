import React, { useEffect, useState, useMemo } from 'react'
import styles from './Arrytmia.module.css'

import { downloadCsv } from '../../utils/download'

import { config } from '../../network-config'

import { Input, Button, Table } from 'antd'

function Arrytmia() {
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

    fetch(`${config.addr}/predict`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setPrediction(JSON.parse(data.data))
      })
      .catch(error => {
        setError(error)
        console.log('PREDICTION ERROR', error)
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
        downloadCsv('prediction.csv', fileData)
      })
  }

  const predictionTable = useMemo(() => {
    const columns =
      prediction?.schema.fields.map(field => {
        return {
          title: field.name,
          dataIndex: field.name,
          key: field.name
        }
      }) || []

    const data =
      prediction?.data.map(row => {
        return { ...row, 'file name': row['file name'].split('\\').at(-1) }
      }) || []

    return (
      <Table
        loading={isLoading}
        pagination={false}
        dataSource={data}
        columns={columns}
        scroll={{ x: '100%' }}
      />
    )
  }, [isLoading, prediction])

  return (
    <div className={styles.root}>
      <h2 style={{ textAlign: 'center' }}>Arrytmia</h2>
      <p>
        The proposed telemedical service is designed to classify severe
        disorders of the cardiovascular which may lead to a sudden cardiac
        death. Among detectable diagnoses are atrial fibrillation,
        supraventricular arrhythmia, malignant ventricular ectopias as well as
        normal sinus rhythm.
      </p>
      <p>
        The service also allows to work with digitized electrocardiograms
        recorded in various formats. The metric accuracy is 99.8%. The timing is
        no longer than 3 seconds. A clinical judgement is given at the output.
      </p>

      <div className={styles.form}>
        <Input type='file' multiple onChange={onFileListChanged} />
        <Button
          onClick={onSendButtonClicked}
          type='primary'
          disabled={fileList.length === 0}
          loading={isLoading}
        >
          Анализ
        </Button>
      </div>

      <div style={{ color: 'rgba(0,0,0,0.5)' }}>
        <p>Only WFDB (Wave Form Data Base) ECG recordings can be loaded.</p>
        <p>
          One ECG record contains at least two ".dat" and ".hea" files. One ECG
          record can consist of up to eight files
        </p>
        <p>
          Values in the range 0.9 - 1 indicate that the file belongs to the
          corresponding diagnosis.
        </p>
        <p>
          Values ranging from zero to 0.89 indicate that the file does not match
          the corresponding diagnosis.
        </p>
      </div>
      {error && <div style={{ marginBottom: 20 }}>{error}</div>}
      <div style={{ marginTop: 20, width: '100%', overflow: 'auto' }}>
        {predictionTable}
      </div>
      {prediction && (
        <Button onClick={onExportCsvButtonClicked}>Export CSV</Button>
      )}
    </div>
  )
}

export default Arrytmia
