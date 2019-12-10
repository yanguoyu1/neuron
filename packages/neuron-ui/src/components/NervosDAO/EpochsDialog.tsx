import React, { useState, useEffect } from 'react'
import { Dialog, DialogType, Text } from 'office-ui-fabric-react'
import { useTranslation } from 'react-i18next'
import { getHeader } from 'services/chain'
import { useCalculateEpochs } from 'utils/hooks'

import * as styles from './epochsDialog.module.scss'

interface EpochsDialogProps {
  blockHash: string
  onDismiss: any
  currentEpoch: string
}

const EpochsDialog = ({ blockHash, onDismiss, currentEpoch }: EpochsDialogProps) => {
  const [t] = useTranslation()
  const [depositEpoch, setDepositEpoch] = useState('')

  useEffect(() => {
    if (blockHash) {
      getHeader(blockHash).then(header => setDepositEpoch(header.epoch))
    }
  }, [blockHash])

  const {
    targetEpochNumber,
    currentEpochInfo: { number: currentEpochNumber, length: currentEpochLength, index: currentEpochIndex },
  } = useCalculateEpochs({
    depositEpoch,
    currentEpoch,
  })

  const pastEpochs =
    Number(currentEpochNumber) -
    Number(targetEpochNumber) +
    180 +
    (currentEpochLength === BigInt(0) ? 0 : +(Number(currentEpochIndex) / Number(currentEpochLength)).toFixed(1))

  const totalHours = Math.ceil((180 - pastEpochs) * 4)
  const leftDays = Math.floor(totalHours / 24)
  const leftHours = totalHours % 24

  let indicatorPositoin = `calc(${(pastEpochs / 180) * 100}% - 6px)`
  if (pastEpochs === 0) {
    indicatorPositoin = '-4px'
  }

  return (
    <Dialog
      hidden={!blockHash}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.normal,
        title: t('nervos-dao.explanation-of-epochs-period'),
      }}
      minWidth={600}
    >
      <Text as="h2">{t('nervos-dao.current-epochs-period')}</Text>
      <Text as="p" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Text as="span">{t('nervos-dao.stage-of-current-epoch', { pastEpochs, totalEpochs: 180 })}</Text>
        <Text as="span">{t('nervos-dao.left-time', { leftDays, leftHours })}</Text>
      </Text>
      <span style={{ left: indicatorPositoin }} className={styles.indicator} />
      <progress className={styles.epochsProgress} max="180" value={pastEpochs} />
      <span style={{ left: indicatorPositoin }} className={styles.indicator} />
      <Text as="p" variant="small" style={{ lineHeight: 1.4 }}>
        {t('nervos-dao.detailed-explanation-of-epochs-period')}
      </Text>
      <ul className={styles.terms}>
        {t('nervos-dao.terms-in-explanation-of-epochs-period')
          .split('\n')
          .map(term => {
            return <li key={term}>{term}</li>
          })}
      </ul>
    </Dialog>
  )
}

EpochsDialog.displayName = 'EpochsDialog'
export default EpochsDialog
