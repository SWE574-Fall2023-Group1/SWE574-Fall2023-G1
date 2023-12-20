import React, { useState } from 'react';
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

const customTheme = createTheme({
});

function App() {
  const [currentTheme, setCurrentTheme] = useState('default'); // add a state variable for the current theme

  const toggleTheme = () => { // add a function to toggle the theme
    setCurrentTheme(currentTheme === 'default' ? 'custom' : 'default');
  };

  return (
    <ThemeProvider theme={currentTheme === 'default' ? theme : customTheme}>
    <Header toggleTheme={toggleTheme}/>
    </ThemeProvider>
  );
}

export default App;
