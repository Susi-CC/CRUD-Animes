// Importando método nativo de Node.JS
import fs from 'fs/promises';

const archivoAnimes = 'anime.json';

// Función para obtener todos los animes
export const obtenerAnimes = async () => {
    try {
        const data = await fs.readFile(archivoAnimes, 'utf8');
        return JSON.parse(data); // Convertir JSON a objeto
    } catch (error) {
        console.error('Error al leer el archivo de animes:', error);
        return {}; // Devuelve un objeto vacío si no se puede leer
    }
};

// Función para guardar los datos en el archivo JSON
const guardarAnimes = async (animesGuardar) => {
    await fs.writeFile(archivoAnimes, JSON.stringify(animesGuardar, null, 2)); // Escribir con formato legible
};

// Función para agregar un nuevo anime
export const crearAnime = async (nombre, genero, año, autor) => {
    const animes = await obtenerAnimes();

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !genero || !año || !autor) {
        throw new Error('Todos los campos (nombre, género, año, autor) son obligatorios');
    }

    const nuevoId = (Math.max(...Object.keys(animes).map(Number)) + 1).toString(); // Generar el próximo ID como string
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

// Función para obtener un anime por ID
export const obtenerAnimePorId = async (id) => {
    const animes = await obtenerAnimes();

    if (!animes[id]) {
        console.log(`El anime con ID "${id}" no existe.`);
        return null;
    }

    return { [id]: animes[id] };
};

// Función para obtener un anime por nombre
export const obtenerAnimePorNombre = async (nombre) => {
    const animes = await obtenerAnimes();

    // Buscar el anime por nombre
    const clave = Object.keys(animes).find(key => animes[key].nombre.toLowerCase() === nombre.toLowerCase());
    if (!clave) {
        console.log(`El anime con nombre "${nombre}" no existe.`);
        return null;
    }

    return { [clave]: animes[clave] };
};

// Función para actualizar un anime por ID
export const actualizarAnimePorId = async (id, camposActualizados) => {
    const animes = await obtenerAnimes();

    if (!animes[id]) {
        console.log(`El anime con ID "${id}" no existe.`);
        return null;
    }

    // Actualizar solo los campos proporcionados
    Object.assign(animes[id], camposActualizados);
    await guardarAnimes(animes);
    console.log(`El anime con ID "${id}" se actualizó de manera satisfactoria!!!`);
    return { [id]: animes[id] };
};

// Función para actualizar un anime por nombre
export const actualizarAnimePorNombre = async (nombre, camposActualizados) => {
    const animes = await obtenerAnimes();

    // Buscar el anime por nombre
    const clave = Object.keys(animes).find(key => animes[key].nombre.toLowerCase() === nombre.toLowerCase());
    if (!clave) {
        console.log(`El anime con nombre "${nombre}" no existe.`);
        return null;
    }

    // Actualizar solo los campos proporcionados
    Object.assign(animes[clave], camposActualizados);
    await guardarAnimes(animes);
    console.log(`El anime "${nombre}" se actualizó de manera satisfactoria!!!`);
    return { [clave]: animes[clave] };
};

// Función para eliminar un anime por ID
export const eliminarAnimePorId = async (id) => {
    const animes = await obtenerAnimes();

    if (!animes[id]) {
        console.log(`El anime con ID "${id}" no existe.`);
        return false;
    }

    // Eliminar el anime
    delete animes[id];
    await guardarAnimes(animes);
    console.log(`El anime con ID "${id}" se eliminó de manera satisfactoria!!!`);
    return true;
};

// Función para eliminar un anime por nombre
export const eliminarAnimePorNombre = async (nombre) => {
    const animes = await obtenerAnimes();

    // Buscar el anime por nombre
    const clave = Object.keys(animes).find(key => animes[key].nombre.toLowerCase() === nombre.toLowerCase());
    if (!clave) {
        console.log(`El anime con nombre "${nombre}" no existe.`);
        return false;
    }

    // Eliminar el anime
    delete animes[clave];
    await guardarAnimes(animes);
    console.log(`El anime "${nombre}" se eliminó de manera satisfactoria!!!`);
    return true;
};
