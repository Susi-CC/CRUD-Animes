
import fs from 'fs/promises';

const archivoAnimes = 'anime.json';

export const obtenerAnimes = async () => {
    try {
        const data = await fs.readFile(archivoAnimes, 'utf8');
        return JSON.parse(data); 
    } catch (error) {
        console.error('Error al leer el archivo de animes:', error);
        return {}; 
    }
};

const guardarAnimes = async (animesGuardar) => {
    await fs.writeFile(archivoAnimes, JSON.stringify(animesGuardar, null, 2)); 
};

export const crearAnime = async (nombre, genero, año, autor) => {
    const animes = await obtenerAnimes();

    if (!nombre || !genero || !año || !autor) {
        throw new Error('Todos los campos (nombre, género, año, autor) son obligatorios');
    }

    const nuevoId = (Math.max(...Object.keys(animes).map(Number)) + 1).toString(); 
    const nuevoAnime = {
        nombre,
        genero,
        año,
        autor,
    };

    animes[nuevoId] = nuevoAnime;

    await guardarAnimes(animes);
    console.log('Anime registrado de manera satisfactoria!!!');
    return { [nuevoId]: nuevoAnime };
};

export const obtenerAnimePorId = async (id) => {
    const animes = await obtenerAnimes();

    if (!animes[id]) {
        console.log(`El anime con ID "${id}" no existe.`);
        return null;
    }

    return { [id]: animes[id] };
};

export const obtenerAnimePorNombre = async (nombre) => {
    const animes = await obtenerAnimes();

    const clave = Object.keys(animes).find(key => animes[key].nombre.toLowerCase() === nombre.toLowerCase());
    if (!clave) {
        console.log(`El anime con nombre "${nombre}" no existe.`);
        return null;
    }

    return { [clave]: animes[clave] };
};

export const actualizarAnimePorId = async (id, camposActualizados) => {
    const animes = await obtenerAnimes();

    if (!animes[id]) {
        console.log(`El anime con ID "${id}" no existe.`);
        return null;
    }

    Object.assign(animes[id], camposActualizados);
    await guardarAnimes(animes);
    console.log(`El anime con ID "${id}" se actualizó de manera satisfactoria!!!`);
    return { [id]: animes[id] };
};

export const actualizarAnimePorNombre = async (nombre, camposActualizados) => {
    const animes = await obtenerAnimes();

    const clave = Object.keys(animes).find(key => animes[key].nombre.toLowerCase() === nombre.toLowerCase());
    if (!clave) {
        console.log(`El anime con nombre "${nombre}" no existe.`);
        return null;
    }

    Object.assign(animes[clave], camposActualizados);
    await guardarAnimes(animes);
    console.log(`El anime "${nombre}" se actualizó de manera satisfactoria!!!`);
    return { [clave]: animes[clave] };
};

export const eliminarAnimePorId = async (id) => {
    const animes = await obtenerAnimes();

    if (!animes[id]) {
        console.log(`El anime con ID "${id}" no existe.`);
        return false;
    }

    delete animes[id];
    await guardarAnimes(animes);
    console.log(`El anime con ID "${id}" se eliminó de manera satisfactoria!!!`);
    return true;
};

export const eliminarAnimePorNombre = async (nombre) => {
    const animes = await obtenerAnimes();

    const clave = Object.keys(animes).find(key => animes[key].nombre.toLowerCase() === nombre.toLowerCase());
    if (!clave) {
        console.log(`El anime con nombre "${nombre}" no existe.`);
        return false;
    }

    delete animes[clave];
    await guardarAnimes(animes);
    console.log(`El anime "${nombre}" se eliminó de manera satisfactoria!!!`);
    return true;
};
