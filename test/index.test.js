import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../index.js';
//Esto lo debo importar también para que de reconozca el request
import { request } from 'chai-http';

// Aquí debo configurar Chai con Chai HTTP y definir `expect`
const { expect } = chai;
chai.use(chaiHttp);

describe('Pruebas del servidor de Anime', () => {
    // Prueba: Obtener todos los animes
    it('Debería obtener todos los animes', async () => {
        const response = await request.execute(server).get('/anime');
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(Object.keys(response.body)).to.have.length.greaterThan(0);
    });

    // Prueba: Obtener un anime por ID
    it('Debería obtener un anime por ID', async () => {
        const response = await request.execute(server).get('/anime/1');
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('1');
    });

    // Prueba: Crear un nuevo anime
    it('Debería crear un nuevo anime', async () => {
        const response = await request.execute(server)
            .post('/anime')
            .send({
                nombre: 'Sakura Card Captor',
                genero: 'Shojo',
                año: '1998',
                autor: 'CLAMP',
            });
        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        const [id] = Object.keys(response.body);
        expect(response.body[id]).to.have.property('nombre', 'Sakura Card Captor');
    });

    // Prueba: Actualizar un anime por ID
    it('Debería actualizar un anime por ID', async () => {
        const response = await request.execute(server)
            .put('/anime/1')
            .send({ genero: 'Cyberpunk' });
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body['1']).to.have.property('genero', 'Cyberpunk');
    });

    // Prueba: Eliminar un anime por ID
    it('Debería eliminar un anime por ID', async () => {
        const response = await request.execute(server).delete('/anime/1');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message', 'Anime eliminado satisfactoriamente');
    });

    // Prueba: Buscar anime inexistente
    it('Debería devolver error para anime inexistente', async () => {
        const response = await request.execute(server).get('/anime/9999');
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('error', 'Anime no encontrado por ID');
    });
    // Prueba: Obtener un anime por Nombre
    it('Debería obtener un anime por Nombre', async () => {
        const response = await request.execute(server).get('/anime/Naruto');
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        const [id] = Object.keys(response.body);
        expect(response.body[id]).to.have.property('nombre', 'Naruto');
    });

    // Prueba: Actualizar un anime por nombre
    it('Debería actualizar un anime por Nombre', async () => {
        const response = await request.execute(server)
            .put('/anime/Naruto')
            .send({ genero: 'Cyberpunk' });
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body['4']).to.have.property('genero', 'Cyberpunk');
    });

    // Prueba: Eliminar un anime por Nombre
    it('Debería eliminar un anime por ID', async () => {
        const response = await request.execute(server).delete('/anime/Naruto');
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message', 'Anime eliminado satisfactoriamente');
    });

    // Prueba: Buscar anime inexistente
    it('Debería devolver error para anime inexistente', async () => {
        const response = await request.execute(server).get('/anime/Bleach');
        expect(response).to.have.status(404);
        expect(response.body).to.have.property('error', 'Anime no encontrado por nombre');
    });

});


