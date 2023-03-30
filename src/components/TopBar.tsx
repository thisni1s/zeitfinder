import React, { useState, MouseEvent, useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Tooltip, Menu, MenuItem, useTheme, Dialog, Button, DialogActions, DialogContent, DialogTitle, TextField, Stack } from '@mui/material';
import { ThemeContext, ChPassContext } from '../App';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LogoutIcon from '@mui/icons-material/Logout';


interface Props {
    username: string,
    logout: () => void,
}

export default function TopBar({ username, logout }: Props ) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [dialog, setDialog] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [newPw, setNewPw] = useState<string>('');
  const [newPwConf, setNewPwConf] = useState<string>('');
  const setThemeName = useContext(ThemeContext);
  const changePassword = useContext(ChPassContext);
  const theme = useTheme();

  function handleOpenUserMenu(event: MouseEvent<HTMLElement>) {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseUserMenu() {
    setAnchorElUser(null);
  }

  function handleLogout() {
    handleCloseUserMenu();
    logout();
  }

  function currThemeName() {
    const ret: string = theme.palette.mode;
    return ret;
  }

  function changeTheme() {
    currThemeName() === 'dark' ? setThemeName('light') : setThemeName('dark');
  }

  function handleDiaClose() {
    setDialog(false);
    setPassword('');
    setNewPw('');
    setNewPwConf('');
  }

  function handlePwChange() {
    if (newPw === newPwConf) {
      changePassword(password, newPw);
      handleDiaClose();
    } else {
      alert('Neue Passwörter stimmen nicht überein!');
    } 
  }

  function changePasswordDia() {
    return (
      <Dialog open={dialog} onClose={handleDiaClose}>
        <DialogTitle>
          Passwort ändern
        </DialogTitle>
        <DialogContent>
        <Stack spacing={1}> 
        <TextField
            type="password"
            label="Aktuelles Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{mb: 2, mt: 2}}
          />
        <TextField
            type="password"
            label="Neues Passwort"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            sx={{mb: 2, mt: 2}}
          />
        <TextField
            type="password"
            label="Neues Passwort bestätigen"
            value={newPwConf}
            onChange={(e) => setNewPwConf(e.target.value)}
            sx={{mb: 2}}
          />
        </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' size='small' onClick={handleDiaClose}>Abbrechen</Button>               
          <Button variant='outlined' size='small' onClick={handlePwChange}>Ändern</Button>
        </DialogActions>
      </Dialog> 
    );  
  }

  return(
    <AppBar position='fixed' sx={{maxHeight: '10%'}}>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1, ml: 2 }}>
          Simple Time
        </Typography>
        <Tooltip title="Einstellungen">
          <IconButton onClick={handleOpenUserMenu}><Avatar>{Array.from(username)[0]}</Avatar></IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{vertical: 'top', horizontal: 'right',}}
          keepMounted
          transformOrigin={{vertical: 'top', horizontal: 'right',}}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem key={'username'} disabled>
            <Typography>{username}</Typography>
          </MenuItem>
          <MenuItem key={'changePassword'} onClick={() => setDialog(true)}>
            <Typography>Passwort ändern</Typography>
          </MenuItem>
          <MenuItem key={'logout'} onClick={handleLogout}>
            <LogoutIcon sx={{pr: 1}}/> <Typography textAlign="center">Logout</Typography>
          </MenuItem>
          <MenuItem key={'theme'} onClick={changeTheme}>
            {
              currThemeName() === 'dark' ?
              <> <DarkModeIcon/>  <ArrowForwardIcon/> <LightModeIcon/></>
              :
              <> <LightModeIcon/> <ArrowForwardIcon/> <DarkModeIcon/></>
            }
          </MenuItem>
        </Menu>
        {changePasswordDia()}
      </Toolbar>        
    </AppBar>
  );
}