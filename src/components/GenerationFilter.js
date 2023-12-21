import React, { useEffect, useState } from 'react';
import { Box, Select } from '@chakra-ui/react';
import axios from 'axios';

const GenerationFilter = ({ onSelectGeneration }) => {
  const [generations, setGenerations] = useState([]);

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/generation/');
        const genData = response.data.results.map((gen) => ({
          value: gen.url.split('/').reverse()[1],
          label: gen.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()), // Capitaliza as palavras
        }));
        setGenerations(genData);
      } catch (error) {
        console.error('Error fetching generations:', error);
      }
    };

    fetchGenerations();
  }, []);

  const handleSelectChange = (e) => {
    const selectedGeneration = e.target.value;
    onSelectGeneration(selectedGeneration);
  };

  return (
    <Box mb="4">
      <Select placeholder="Selecione uma geração" onChange={handleSelectChange}>
        {generations.map((generation) => (
          <option key={generation.value} value={generation.value}>
            {generation.label}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default GenerationFilter;