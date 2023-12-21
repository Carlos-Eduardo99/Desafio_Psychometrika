import React from 'react';
import './App.css';
import Pokedex from './components/Pokedex';

import { ChakraProvider } from '@chakra-ui/react'


function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
       <Pokedex />
    </ChakraProvider>
  )
}

export default App;