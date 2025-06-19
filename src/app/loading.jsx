import React from 'react'
import styles from './loading.module.css'

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Đang tải trang...</p>
      </div>
    </div>
  )
}

export default Loading