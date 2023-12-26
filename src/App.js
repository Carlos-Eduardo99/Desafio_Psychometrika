import React, { useState } from 'react';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Pokedex from './components/Pokedex';
import Header from './components/Header';
import Filter from './components/Filter';
import Homepage from './components/HomePage';
import backgroundImage from './image/background.jpg';

function App() {
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedMove, setSelectedMove] = useState(null);
  const [searchTrigger, setSearchTrigger] = useState(false);

  const handleSearch = () => {
    setSearchTrigger((prev) => !prev);
  };

  return (
    <ChakraProvider>
      <Router>
        <Box
          backgroundImage={`url(${backgroundImage})`}
          backgroundSize="cover"
          backgroundPosition="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          padding="2rem" 
        >
          <Header width="100%" />
          <Box
            maxWidth="1200px"
            width="100%"
            bgColor="rgba(255, 255, 255, 0.8)"
            borderRadius="md"
            padding="2rem"
            marginTop="2rem"
          >
            <Filter
              onSelectGeneration={(generation) => setSelectedGeneration(generation)}
              onSelectType={(types) => setSelectedTypes(types)}
              onSelectMove={(move) => setSelectedMove(move)}
              onSearch={handleSearch}
            />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route
                path="/pokedex"
                element={<Pokedex
                            selectedGeneration={selectedGeneration}
                            selectedTypes={selectedTypes}
                            selectedMove={selectedMove}
                            searchTrigger={searchTrigger}
                          />}
              />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;