import http from 'http';
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
            const nombre = parts[2] ? decodeURIComponent(parts[2]) : null; // Decodificar solo si existe

            switch (method) {
                case 'POST': // Crear un nuevo anime
                    req.on('data', chunk => (body += chunk.toString()));
                    req.on('end', async () => {
                        try {
                            const nuevoAnime = JSON.parse(body);
                            if (!nuevoAnime.nombre || !nuevoAnime.genero || !nuevoAnime.año || !nuevoAnime.autor) {
                                res.writeHead(400, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
                                return;
                            }
                            const animeCreado = await crearAnime(
                                nuevoAnime.nombre,
                                nuevoAnime.genero,
                                nuevoAnime.año,
                                nuevoAnime.autor
                            );
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(animeCreado));
                        } catch (error) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'JSON mal formateado' }));
                        }
                    });
                    break;

                case 'GET': // Listar todos los animes o buscar uno por nombre
                    const animes = await obtenerAnimes();
                    if (nombre) {
                        const anime = Object.values(animes).find(
                            a => a.nombre.toLowerCase() === nombre.toLowerCase()
                        );
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
                        try {
                            const datosActualizados = JSON.parse(body);
                            if (!datosActualizados.nombre && !datosActualizados.genero && !datosActualizados.año && !datosActualizados.autor) {
                                res.writeHead(400, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'No se enviaron campos para actualizar' }));
                                return;
                            }
                            const animeActualizado = await actualizarAnime(nombre, datosActualizados);
                            if (animeActualizado) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(animeActualizado));
                            } else {
                                res.writeHead(404, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Anime no encontrado' }));
                            }
                        } catch (error) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'JSON mal formateado' }));
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
