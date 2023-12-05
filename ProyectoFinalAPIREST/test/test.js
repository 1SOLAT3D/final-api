const request = require('supertest');
const app = 'http://localhost:8080';

describe('Pruebas de la API', () => {
  it('debería obtener todos los equipos', async () => {
    const res = await request(app).get('/lec2023');
    expect(res.status).toBe(200);
    console.log('GET /lec2023 debería devolver la lista de equipos');
    console.log(res.body);
  });

  it('debería obtener un equipo por su ID', async () => {
    const res = await request(app).get('/lec2023/2');
    expect(res.status).toBe(200);
    console.log('GET /lec2023/:idEquipo debería devolver un equipo por su ID');
    console.log(res.body);
  });

  it('debería agregar un nuevo equipo', async () => {
    const nuevoEquipo = {
      nombre: 'Nuevo Equipo',
      acronimo: 'NE',
      pais: 'Nuevo País',
    };

    const res = await request(app).post('/lec2023').send(nuevoEquipo);
    expect(res.status).toBe(200);
    console.log('POST /lec2023 debería agregar un nuevo equipo');
    console.log(res.body);
  });

  it('debería eliminar un equipo por su ID', async () => {
    const res = await request(app).delete('/lec2023/18');
    expect(res.status).toBe(200);
    console.log('DELETE /lec2023/:idEquipo debería eliminar un equipo por su ID');
    console.log(res.body);
  });

  it('debería actualizar un equipo por su ID', async () => {
    const equipoActualizado = {
      nombre: 'Equipo Actualizado',
      acronimo: 'EA',
      pais: 'País Actualizado',
    };

    const res = await request(app).put('/lec2023/17').send(equipoActualizado);
    expect(res.status).toBe(200);
    console.log('PUT /lec2023/:idEquipo debería actualizar un equipo por su ID');
    console.log(res.body);
  });

  it('debería actualizar parcialmente un equipo por su ID', async () => {
    const equipoParcialmenteActualizado = {
      nombre: 'Equipo Parcialmente Actualizado',
    };

    const res = await request(app).patch('/lec2023/16').send(equipoParcialmenteActualizado);
    expect(res.status).toBe(200);
    console.log('PATCH /lec2023/:idEquipo debería actualizar parcialmente un equipo por su ID');
    console.log(res.body);
  });
});
