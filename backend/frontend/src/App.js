import React, { useState, useEffect, useRef} from 'react';
import Header from './components/header/header';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#363636',
    },
    secondary: {
      main: '#1a1a1a', // A darker shade of the primary color
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
    <Header/>
    </ThemeProvider>
  );
}

export default App;