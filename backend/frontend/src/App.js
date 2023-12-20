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
      {currentTheme === 'custom' && <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1}}></div>}
      <div style={{ position: 'relative', zIndex: 2 }}> {/* this will ensure the content stays in front of the div */}
        <Header toggleTheme={toggleTheme} currentTheme={currentTheme}/>
      </div>
    </ThemeProvider>
  );
}

export default App;
