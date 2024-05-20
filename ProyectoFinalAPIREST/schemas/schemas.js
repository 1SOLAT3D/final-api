// schemas.js

const EquipoSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID del equipo',
        example: 1
      },
      nombre: {
        type: 'string',
        description: 'Nombre del equipo',
        example: 'G2 Esports'
      },
      acronimo: {
        type: 'string',
        description: 'Acrónimo del equipo',
        example: 'G2'
      },
      pais: {
        type: 'string',
        description: 'País del equipo',
        example: 'Alemania'
      }
    }
  };
  
  module.exports = {
    EquipoSchema
  };
  