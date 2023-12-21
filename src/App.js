import React, { useState } from 'react';
import './App.css';
import Pokedex from './components/Pokedex';
import Header from './components/Header';
import GenerationFilter from './components/GenerationFilter';

import { ChakraProvider } from '@chakra-ui/react';

function App() {
  const [selectedGeneration, setSelectedGeneration] = useState(null);

  return (
    <ChakraProvider>
      <div className="content">
        <Header />
        <GenerationFilter onSelectGeneration={(generation) => setSelectedGeneration(generation)} />
        <Pokedex selectedGeneration={selectedGeneration} />
      </div>
    </ChakraProvider>
  );
}

export default App;