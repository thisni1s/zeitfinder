import React, { useState } from 'react'
import { Card, Button, CardContent, Typography, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Chip, DialogActions, ButtonGroup, Avatar, CardMedia } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2' // Grid version 2
import { NumericFormat } from 'react-number-format'
import { type Task } from '../models/Task'

import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import EditIcon from '@mui/icons-material/Edit';
import { checkNum } from '../helpers'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import 'moment/locale/de';
import EditTask from './EditTask'
import PicDialog from './PicDialog'

interface Props {
  userid: string
  task: Task
  doneClaimNames: string[]
  fByMe?: boolean
  creatorName: string
  claim: (id: string) => void
  finish: (id: string, duration: number, date: moment.Moment) => void
  editTask: (id: string) => void
}
interface ClaimProps {
  single: boolean
}

export default function TaskCard({ userid, task, doneClaimNames, fByMe, creatorName, claim, finish, editTask }: Props) {
  const [dialog, setDialog] = useState<boolean>(false)
  const [picDia, setPicDia] = useState<boolean>(false)
  function handleFinish(duration: number, date: moment.Moment) {
    finish(task.id ?? '', duration, date)
    setDialog(false)
  }

  function handleClaim() {
    claim(task.id ?? '')
  }

  function ClaimButton({ single }: ClaimProps) {
    const sx = single ? { flexGrow: 1 } : {}
    return (
        <Button variant='outlined' size='small' sx={sx} onClick={handleClaim}>{!task.claimed.includes(userid) ? <AddIcon fontSize='small'/> : <RemoveIcon fontSize='small'/>}</Button>
    )
  }

  function AddClaim() {
    const claimedStrEnd = task.claimed.length > 1 ? ' u.a.' : ''
    const claimedStr = doneClaimNames[0] + claimedStrEnd
    return (
        <ButtonGroup variant='outlined' aria-label='claim-button-group' size='small' sx={{ flexGrow: 1 }}>
          <Button disabled sx={{ overflow: 'hidden', flexGrow: 1 }}>{claimedStr}</Button>
          <ClaimButton single={false}/>
        </ButtonGroup>
    )
  }

  function unfinishedTask() {
    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ display: 'flex', mt: 1, flexWrap: 'nowrap' }}>
          {
            task.claimed.length > 0
            ? <AddClaim/>
            : <ClaimButton single={true}/>
          }
          <Button variant='outlined' size='small' sx={{ flexGrow: 1 }} onClick={() => { setDialog(true) }}><CheckIcon fontSize='small'/></Button>
          {
            task.creator === userid
            ? <IconButton aria-label='delete' size='small' onClick={() => { editTask(task.id ?? '') }}><EditIcon fontSize='small'/></IconButton>
            : <></> 
          }
        </Stack>
    )
  }

  function finishedTask() {
    return (
        <>
        <Typography color='text.secondary' variant='caption' gutterBottom>Erledigt von: {doneClaimNames?.join(', ')}</Typography>
        <Stack direction='row' spacing={2} sx={{ display: 'flex', mt: 1 }}>
          <Button disabled={fByMe} variant='outlined' size='small' sx={{ flexGrow: 1 }} onClick={() => { setDialog(true) }}>Zeit nachtragen</Button>
        </Stack>
        </>
    )
  }

  function ImageDia() {
    return (
      <Dialog open={picDia} onClose={() => { setPicDia(false) }}>
        <DialogTitle>Bild für {task.title} </DialogTitle>
        <img src={task.image} alt='hallo'/>
        <DialogActions>
          <Button variant='contained' size='small' sx={{ flexGrow: 1 }} onClick={() => { setPicDia(false) }}>Schließen</Button>
        </DialogActions>
      </Dialog>
    )
  }

  function FinishDia() {
    const [duration, setDuration] = useState<number>(0)
    const [date, setDate] = useState<moment.Moment>(moment())

    function setChipTime(hours: number) {
      setDuration(hours * 60)
    }

    function dateChange(time: moment.Moment | null) {
      if (time !== null) {
        setDate(time)
      }
    }

    return (
      <Dialog open={dialog} onClose={() => { setDialog(false) }}>
      <DialogTitle>
        {task.title}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>
              Aufgabe als Erledigt markieren?
          </DialogContentText>
          <Stack direction={'row'} spacing={1} sx={{justifyContent: 'center'}}>
            <Chip label="2h" onClick={() => setChipTime(2)}/>
            <Chip label="3h" onClick={() => setChipTime(3)}/>
            <Chip label="4h" onClick={() => setChipTime(4)}/>
            <Chip label="5h" onClick={() => setChipTime(5)}/>
          </Stack>
          <NumericFormat
            customInput={TextField}
            onValueChange={(values) => { setDuration(Number(values.value)) }}
            value={duration}
            isAllowed={(values) => {
              const { floatValue } = values
              return checkNum(floatValue ?? 1)
            }}
            // you can define additional custom props that are all forwarded to the customInput e. g.
            variant="outlined"
            label='Arbeitszeit (Minuten)'
            sx={{ mb: 1, mt: 2 }}
          />
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'de'}>
            <DatePicker label="Datum" defaultValue={date} onChange={(e) => dateChange(e)} value={date} disableFuture/>
          </LocalizationProvider>
        </Stack>
        <DialogActions sx={{mt: 1}}>
          <Button variant='outlined' size='small' sx={{ flexGrow: 1 }} onClick={() => { setDialog(false) }}>Abbrechen</Button>
          <Button variant='outlined' size='small' sx={{ flexGrow: 1 }} onClick={() => handleFinish(duration, date)}>Speichern</Button>
        </DialogActions>
      </DialogContent>
      </Dialog>
    )
  }

  function publicPrivateText() {
    if(task.creator !== userid) {
      return <></>
    } else {
      const text = task.private ? 'Privat' : 'Öffentlich'
      return (
        <Typography color='text.secondary' variant='caption'>
          {text}
        </Typography>
      )
    }
  }

  return (
      <Grid xs={12} md={4}>
        <Card>
          {
            task.image !== undefined ?
            <>
              <CardMedia sx={{height: 140}} image={task.image} component='img' onClick={() => setPicDia(true)}/>
              <PicDialog visible={picDia} image={task.image} title={task.title} changeVisibility={setPicDia} />
            </>
            : <></>
          }
          <CardContent>
            <Typography variant='h5' component='div'>
              {task.title}
            </Typography>
            <Typography variant='body2'>
              {task.description}
            </Typography>
            <Stack direction={'row'} spacing={1} sx={{ display: 'flex', justifyContent: 'space-between'}}>
              <Typography color='text.secondary' variant='caption'>
                  Erstellt von: {task.creator === userid ? 'Dir' : creatorName}
              </Typography>
              {publicPrivateText()}            
            </Stack>
            {!task.done ? unfinishedTask() : finishedTask()}
            <FinishDia/>
          </CardContent>
        </Card>
      </Grid>
  )
}
