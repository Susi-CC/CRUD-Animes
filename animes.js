import fs from 'fs/promises';

const archivoAnimes = 'animes.json';

// Función para obtener todos los animes
export const obtenerAnimes = async () => {
    try {
        const data = await fs.readFile(archivoAnimes, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de animes:', error);
        return {}; // Devuelve un objeto vacío si no se puede leer
    }
};

// Función para guardar los datos en el archivo JSON
const guardarAnimes = async (animesGuardar) => {
    try {
        await fs.writeFile(archivoAnimes, JSON.stringify(animesGuardar, null, 2));
    } catch (error) {
        console.error('Error al guardar los animes:', error);
    }
};

// Función para agregar un nuevo anime
export const crearAnime = async (nombre, genero, año, autor) => {
    const animes = await obtenerAnimes();

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !genero || !año || !autor) {
        throw new Error('Todos los campos (nombre, género, año, autor) son obligatorios');
    }

    const nuevoAnime = {
        nombre: nombre,
        genero: genero,
        año: año,
        autor: autor,
    };

    // Agregar el nuevo anime al objeto de animes
    const nuevoId = Object.keys(animes).length + 1; // Determina el próximo ID incremental
    animes[nuevoId] = nuevoAnime;

    await guardarAnimes(animes);
    console.log('Anime registrado de manera satisfactoria!!!');
    return nuevoAnime;
};

// Función para actualizar un anime existente
export const actualizarAnime = async (nombre, camposActualizados) => {
    const animes = await obtenerAnimes();
    const anime = Object.values(animes).find(a => a.nombre === nombre); // Buscar el anime por nombre

    if (anime) {
        // Si el campo completada está en camposActualizados, actualízalo
        if (camposActualizados.completada !== undefined) {
            anime.completada = Boolean(camposActualizados.completada);
        }
        await guardarAnimes(animes);
        console.log(`El anime ${nombre} se actualizó de manera satisfactoria!!!`);
        return anime;
    } else {
        console.log(`El anime: ${nombre} no existe!!!`);
        return null;
    }
};

// Función para eliminar un anime por su nombre
export const eliminarAnime = async (nombre) => {
    const animes = await obtenerAnimes();
    const nuevosAnimes = Object.fromEntries(
        Object.entries(animes).filter(([key, anime]) => anime.nombre !== nombre)
    ); // Filtra los animes por nombre

    await guardarAnimes(nuevosAnimes);
    console.log(`El anime ${nombre} se eliminó de manera satisfactoria!!!`);
    return true;
};
