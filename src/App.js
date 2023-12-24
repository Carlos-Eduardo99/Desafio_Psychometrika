import React, { useState } from 'react';
import { Navigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import './App.css';
import Pokedex from './components/Pokedex';
import Header from './components/Header';
import Filter from './components/Filter';
import Homepage from './components/HomePage';
import backgroundImage from './image/background.jpg';

function App() {
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAbility, setSelectedAbility] = useState(null);
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
            onSelectAbility={(ability) => setSelectedAbility(ability)}
            onSearch={handleSearch}
          />
          <Routes>
            <Route path="/" element={<Homepage width="100%" />} />
            <Route
              path="/pokedex"
              element={<Pokedex
                          selectedGeneration={selectedGeneration}
                          selectedTypes={selectedTypes}
                          selectedAbility={selectedAbility}
                          searchTrigger={searchTrigger}
                          width="100%"
                        />}
            />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;