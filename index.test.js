import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index.js'; // Ruta al servidor

const { expect } = chai;
chai.use(chaiHttp);

describe('Pruebas del servidor de Anime', () => {
    // Prueba: Obtener todos los animes
    it('Debería obtener todos los animes', (done) => {
        chai.request(server)
            .get('/anime')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(Object.keys(res.body)).to.have.length.greaterThan(0);
                done();
            });
    });

    // Prueba: Buscar anime por ID
    it('Debería obtener un anime por ID', (done) => {
        chai.request(server)
            .get('/anime/1') // ID de ejemplo
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('1'); // Verifica que contiene el ID
                done();
            });
    });

    // Prueba: Crear un nuevo anime
    it('Debería crear un nuevo anime', (done) => {
        chai.request(server)
            .post('/anime')
            .send({
                nombre: 'Bleach',
                genero: 'Shonen',
                año: '2004',
                autor: 'Tite Kubo',
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                const [id] = Object.keys(res.body); // Obtiene el ID generado
                expect(res.body[id]).to.have.property('nombre', 'Bleach');
                done();
            });
    });

    // Prueba: Actualizar un anime por ID
    it('Debería actualizar un anime por ID', (done) => {
        chai.request(server)
            .put('/anime/1') // ID de ejemplo
            .send({ genero: 'Cyberpunk' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body['1']).to.have.property('genero', 'Cyberpunk');
                done();
            });
    });

    // Prueba: Eliminar un anime por ID
    it('Debería eliminar un anime por ID', (done) => {
        chai.request(server)
            .delete('/anime/1') // ID de ejemplo
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Anime eliminado satisfactoriamente');
                done();
            });
    });

    // Prueba: Buscar anime inexistente
    it('Debería devolver error para anime inexistente', (done) => {
        chai.request(server)
            .get('/anime/9999') // ID inexistente
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error', 'Anime no encontrado por ID');
                done();
            });
    });
});