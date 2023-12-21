import React, { useState } from 'react';
import './App.css';
import Pokedex from './components/Pokedex';
import Header from './components/Header';
import Filter from './components/Filter';
import { ChakraProvider, Box } from '@chakra-ui/react';
import backgroundImage from './image/background.jpg';

function App() {
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);

  return (
    <ChakraProvider>
      <Box
        backgroundImage={`url(${backgroundImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Header width="100%" />
        <Filter
          onSelectGeneration={(generation) => setSelectedGeneration(generation)}
          onSelectType={(types) => setSelectedTypes(types)}
        />
        <Pokedex selectedGeneration={selectedGeneration} selectedTypes={selectedTypes} width="100%" />
      </Box>
    </ChakraProvider>
  );
}

export default App;