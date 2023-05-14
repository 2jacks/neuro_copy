import React, { useState, useEffect } from 'react'
import styles from './Main.module.css'

import Dislocation from '../dislocation/Dislocation'
import Arrytmia from '../arrytmia/Arrytmia'

function Main() {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Arrytmia />
        <Dislocation />
      </div>
    </div>
  )
}

export default Main
