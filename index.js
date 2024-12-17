import http from 'http';
import fs from 'fs/promises';
import {
    obtenerAnimes,
    crearAnime,
    actualizarAnime,
    eliminarAnime
} from './animes.js';

const PORT = 3001;

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    let body = '';

    try {
        if (url.startsWith('/anime')) {
            const parts = url.split('/');
            const nombre = decodeURIComponent(parts[2]); // Extrae el nombre y lo decodifica
            console.log('Nombre del anime extraído de la URL:', nombre); // Verificación

            switch (method) {
                case 'POST': // Crear un nuevo anime
                    if (url === '/anime') {
                        req.on('data', chunk => (body += chunk.toString()));
                        req.on('end', async () => {
                            const nuevoAnime = JSON.parse(body);
                            if (!nuevoAnime.nombre || !nuevoAnime.genero || !nuevoAnime.año || !nuevoAnime.autor) {
                                res.writeHead(400, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
                                return;
                            }
                            const animeCreado = await crearAnime(nuevoAnime.nombre, nuevoAnime.genero, nuevoAnime.año, nuevoAnime.autor);
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(animeCreado));
                        });
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('Ruta no encontrada');
                    }
                    break;

                case 'GET': // Listar todos los animes o buscar uno por nombre
                    const animes = await obtenerAnimes();
                    if (nombre) {
                        // Busca el anime por nombre
                        const anime = Object.values(animes).find(a => a.nombre === nombre);
                        console.log('Anime encontrado:', anime); // Verificación

                        if (anime) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(anime));
                        } else {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Anime no encontrado' }));
                        }
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(animes));
                    }
                    break;

                case 'PUT': // Actualizar un anime
                    if (!nombre) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Nombre del anime requerido' }));
                        return;
                    }
                    req.on('data', chunk => (body += chunk.toString()));
                    req.on('end', async () => {
                        const datosActualizados = JSON.parse(body);
                        const animeActualizado = await actualizarAnime(nombre, datosActualizados);
                        if (animeActualizado) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(animeActualizado));
                        } else {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Anime no encontrado' }));
                        }
                    });
                    break;

                case 'DELETE': // Eliminar un anime
                    if (!nombre) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Nombre del anime requerido' }));
                        return;
                    }
                    const eliminado = await eliminarAnime(nombre);
                    if (eliminado) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Anime eliminado satisfactoriamente' }));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Anime no encontrado' }));
                    }
                    break;

                default: // Método no permitido
                    res.writeHead(405, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Método no permitido' }));
                    break;
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Ruta no encontrada');
        }
    } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
    }
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
