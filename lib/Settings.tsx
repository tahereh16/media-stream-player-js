import React, { ChangeEvent, useCallback } from 'react'
import styled from 'styled-components'

import { Format } from './Player'
import { VapixParameters } from './PlaybackArea'
import { Switch } from './components/Switch'

const SettingsMenu = styled.div`
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 32px;
  right: 0;
  background: rgb(0, 0, 0, 0.66);
  padding: 8px 16px;
  margin-bottom: 16px;
  margin-right: 8px;

  &:after {
    content: '';
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    position: absolute;
    bottom: -5px;
    right: 12px;
    background: rgb(0, 0, 0, 0.66);
  }
`

const SettingsItem = styled.div`
  display: flex;
  flex-direction: row;
  color: white;
  height: 24px;
  width: 320px;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0;
`

interface SettingsProps {
  readonly parameters: VapixParameters
  readonly format?: Format
  readonly onFormat: (format: Format) => void
  readonly onVapix: (key: string, value: string) => void
  readonly showStatsOverlay: boolean
  readonly toggleStats: (newValue?: boolean) => void
}

export const Settings: React.FC<SettingsProps> = ({
  parameters,
  format,
  onFormat,
  onVapix,
  showStatsOverlay,
  toggleStats,
}) => {
  const changeParam = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      switch (e.target.name) {
        case 'textstring':
          onVapix(e.target.name, e.target.value)
          break
        case 'text':
          onVapix(e.target.name, e.target.checked ? '1' : '0')
          break
        default:
          console.warn('internal error')
      }
    },
    [onVapix],
  )

  const changeStatsOverlay = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      toggleStats(e.target.checked)
    },
    [toggleStats],
  )

  const changeFormat = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onFormat(e.target.value as Format)
    },
    [onFormat],
  )

  const changeResolution = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === '') {
        onVapix('resolution', '')
        return
      }
      onVapix('resolution', e.target.value)
    },
    [onVapix],
  )

  const changeRotation = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onVapix('rotation', e.target.value)
    },
    [onVapix],
  )

  const changeCompression = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onVapix('compression', e.target.value)
    },
    [onVapix],
  )

  return (
    <SettingsMenu>
      <SettingsItem>
        <div>Format</div>
        <select onChange={changeFormat} defaultValue={format}>
          <option value="H264">H.264 over RTP</option>
          <option value="MJPEG">JPEG over RTP</option>
          <option value="JPEG">Still image</option>
        </select>
      </SettingsItem>
      <SettingsItem>
        <div>Resolution</div>
        <select value={parameters['resolution']} onChange={changeResolution}>
          <option value="">default</option>
          <option value="1920x1080">1920 x 1080 (FHD)</option>
          <option value="1280x720">1280 x 720 (HD)</option>
          <option value="800x600">800 x 600 (VGA)</option>
        </select>
      </SettingsItem>
      <SettingsItem>
        <div>Rotation</div>
        <select value={parameters['rotation']} onChange={changeRotation}>
          <option value="0">0</option>
          <option value="90">90</option>
          <option value="180">180</option>
          <option value="270">270</option>
        </select>
      </SettingsItem>
      <SettingsItem>
        <div>Compression</div>
        <select value={parameters['compression']} onChange={changeCompression}>
          <option value="">default</option>
          <option value="0">0</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="60">60</option>
          <option value="70">70</option>
          <option value="80">80</option>
          <option value="90">90</option>
          <option value="100">100</option>
        </select>
      </SettingsItem>
      <SettingsItem>
        <div>Text overlay</div>
        <input
          name="textstring"
          value={parameters['textstring']}
          onChange={changeParam}
        />
        <Switch
          name="text"
          checked={parameters['text'] === '1'}
          onChange={changeParam}
        />
      </SettingsItem>
      <SettingsItem>
        <div>Stats overlay</div>
        <Switch checked={showStatsOverlay} onChange={changeStatsOverlay} />
      </SettingsItem>
    </SettingsMenu>
  )
}
