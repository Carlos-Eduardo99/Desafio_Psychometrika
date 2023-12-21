// src/components/PokemonCard.js
import React from 'react';
import { Card, CardBody, Flex, Text, Image, Stack, Heading } from '@chakra-ui/react';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const PokemonCard = ({ number, name, pokeDetails, image }) => {
  const getTypeClass = (type) => {
    return type ? type.type.name : 'unknown';
  };

  const typeColors = {
    normal: '#a6a877',
    grass: '#56d0b0',
    fire: '#f36a6c',
    water: '#77befc',
    electric: '#ffd76f',
    ice: '#98d5d7',
    ground: '#dfbf69',
    flying: '#a98ff0',
    poison: '#a040a0',
    fighting: '#bf3029',
    psychic: '#f65687',
    dark: '#725847',
    rock: '#b8a137',
    bug: '#a8b720',
    ghost: '#6e5896',
    steel: '#b9b7cf',
    dragon: '#6f38f6',
    fairy: '#f9aec7',
  };

  return (
    // Chakra UI
    <Card maxW='sm'>
      <CardBody>
        <Flex
          flexDir='column'
          bg={typeColors[getTypeClass(pokeDetails && pokeDetails.types && pokeDetails.types[0])]}
          color='#FFF'
          minW='100%'
        >
          <Text>N°{number}</Text>
          <Image src={image} alt='Pokemon' borderRadius='lg' />
        </Flex>
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{capitalizeFirstLetter(name)}</Heading>
        </Stack>
        <Flex minW='100%' color='#FFF'>
          {pokeDetails &&
            pokeDetails.types &&
            pokeDetails.types.map((type, index) => (
              <Flex
                key={index}
                className='type'
                bg={typeColors[type.type.name]}
                color='#FFF'
                padding='.25rem .5rem'
                margin='.25rem 0'
                borderRadius='1rem'
                textAlign='center'
              >
                {type.type.name}
              </Flex>
            ))}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default PokemonCard;