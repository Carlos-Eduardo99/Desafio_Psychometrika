import React, { useState, useEffect } from 'react';
import { Box, Select, Text } from '@chakra-ui/react';
import axios from 'axios';

const MoveFilter = ({ onSelectMove }) => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        let allMoves = [];
        let nextUrl = 'https://pokeapi.co/api/v2/move/';

        // Continua fazendo solicitações até que não haja mais resultados
        while (nextUrl) {
          const response = await axios.get(nextUrl);
          const movesData = response.data.results.map((move) => ({
            value: move.url.split('/').reverse()[1],
            label: move.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          }));
          allMoves = [...allMoves, ...movesData];
          nextUrl = response.data.next; // Próxima página de resultados
        }

        // Ordena os ataques em ordem alfabética
        const sortedMoves = allMoves.slice().sort((a, b) => a.label.localeCompare(b.label));
        
        setMoves(sortedMoves);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching moves:', error);
        setLoading(false);
      }
    };

    fetchMoves();
  }, []);

  const handleSelectChange = (e) => {
    const selectedMove = e.target.value;
    onSelectMove(selectedMove);
  };

  return (
    <Box mb="4" p="4" bgColor="#f7fafc" rounded="md" boxShadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={2} color="#2d3748">
        Ataque
      </Text>
      {loading ? (
        <p>Carregando ataques...</p>
      ) : (
        <Select placeholder="Selecione um ataque" onChange={handleSelectChange} color="#4a5568">
          {moves.map((move) => (
            <option key={move.value} value={move.value}>
              {move.label}
            </option>
          ))}
        </Select>
      )}
    </Box>
  );
};

export default MoveFilter; 