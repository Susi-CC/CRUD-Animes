import http from 'http';
import {
    obtenerAnimes,
    crearAnime,
    obtenerAnimePorId,
    obtenerAnimePorNombre,
    actualizarAnimePorId,
    actualizarAnimePorNombre,
    eliminarAnimePorId,
    eliminarAnimePorNombre,
} from './animes.js';

const PORT = 3001;

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    let body = '';

    try {
        if (url.startsWith('/anime')) {
            const parts = url.split('/'); // Dividir la URL en partes
            const param = parts[2] ? decodeURIComponent(parts[2]) : null; // Decodificar si hay parámetro

            switch (method) {
                case 'GET': // Obtener anime(s)
                    if (!param) {
                        // Si no hay parámetro, listar todos los animes
                        const animes = await obtenerAnimes();
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(animes));
                    } else if (!isNaN(param)) {
                        // Si el parámetro es un número, buscar por ID
                        const anime = await obtenerAnimePorId(param);
                        if (anime) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(anime));
                        } else {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Anime no encontrado por ID' }));
                        }
                    } else {
                        // Si no es un número, buscar por nombre
                        const anime = await obtenerAnimePorNombre(param);
                        if (anime) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(anime));
                        } else {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Anime no encontrado por nombre' }));
                        }
                    }
                    break;

                case 'POST': // Crear un nuevo anime
                    req.on('data', chunk => (body += chunk.toString()));
                    req.on('end', async () => {
                        try {
                            const { nombre, genero, año, autor } = JSON.parse(body);
                            if (!nombre || !genero || !año || !autor) {
                                res.writeHead(400, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Todos los campos son obligatorios' }));
                                return;
                            }
                            const nuevoAnime = await crearAnime(nombre, genero, año, autor);
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(nuevoAnime));
                        } catch (error) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'JSON mal formateado' }));
                        }
                    });
                    break;

                case 'PUT': // Actualizar un anime
                    req.on('data', chunk => (body += chunk.toString()));
                    req.on('end', async () => {
                        try {
                            const camposActualizados = JSON.parse(body);
                            let actualizado;
                            if (!param) {
                                res.writeHead(400, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Se requiere un ID o nombre' }));
                                return;
                            }
                            if (!isNaN(param)) {
                                // Si el parámetro es un número, actualizar por ID
                                actualizado = await actualizarAnimePorId(param, camposActualizados);
                            } else {
                                // Si no es un número, actualizar por nombre
                                actualizado = await actualizarAnimePorNombre(param, camposActualizados);
                            }

                            if (actualizado) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(actualizado));
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
                    if (!param) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Se requiere un ID o nombre' }));
                        return;
                    }

                    let eliminado;
                    if (!isNaN(param)) {
                        // Si el parámetro es un número, eliminar por ID
                        eliminado = await eliminarAnimePorId(param);
                    } else {
                        // Si no es un número, eliminar por nombre
                        eliminado = await eliminarAnimePorNombre(param);
                    }

                    if (eliminado) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Anime eliminado satisfactoriamente' }));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Anime no encontrado' }));
                    }
                    break;
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error interno del servidor' }));
    }
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
