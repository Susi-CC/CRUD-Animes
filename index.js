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

export const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    let body = '';

    try {
        if (url.startsWith('/anime')) {
            const parts = url.split('/'); 
            const param = parts[2] ? decodeURIComponent(parts[2]) : null; 

            switch (method) {
                case 'GET': 
                    if (!param) {
                        const animes = await obtenerAnimes();
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(animes));
                    } else if (!isNaN(param)) {
                        const anime = await obtenerAnimePorId(param);
                        if (anime) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(anime));
                        } else {
                            res.writeHead(404, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Anime no encontrado por ID' }));
                        }
                    } else {
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

                case 'POST': 
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

                case 'PUT': 
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
                                
                                actualizado = await actualizarAnimePorId(param, camposActualizados);
                            } else {
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

                case 'DELETE': 
                    if (!param) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Se requiere un ID o nombre' }));
                        return;
                    }

                    let eliminado;
                    if (!isNaN(param)) {
                        eliminado = await eliminarAnimePorId(param);
                    } else {
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

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
