import fs from 'fs/promises';

const archivoAnimes = 'animes.json';

// Función para obtener todos los animes
export const obtenerAnimes = async () => {
    try {
        const data = await fs.readFile(archivoAnimes, 'utf8');
        return JSON.parse(data); // Convertir el JSON a un objeto
    } catch (error) {
        console.error('Error al leer el archivo de animes:', error);
        return {}; // Devuelve un objeto vacío si no se puede leer
    }
};

// Función para guardar los datos en el archivo JSON
const guardarAnimes = async (animesGuardar) => {
    try {
        await fs.writeFile(archivoAnimes, JSON.stringify(animesGuardar, null, 2)); // Guardar con formato legible
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
    const anime = Object.values(animes).find(a => a.nombre === nombre);

    if (anime) {
        // Valida que solo se actualicen campos válidos
        const camposPermitidos = ['nombre', 'genero', 'año', 'autor'];
        for (const campo in camposActualizados) {
            if (!camposPermitidos.includes(campo)) {
                throw new Error(`El campo ${campo} no es válido para actualizar`);
            }
        }

        // Actualiza solo los campos permitidos
        Object.assign(anime, camposActualizados);
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
    const clave = Object.keys(animes).find(key => animes[key].nombre === nombre);

    if (!clave) {
        console.log(`El anime ${nombre} no existe.`);
        return { eliminado: false, mensaje: `El anime ${nombre} no se encontró` };
    }

    delete animes[clave]; // Elimina el anime del objeto
    await guardarAnimes(animes);
    console.log(`El anime ${nombre} se eliminó de manera satisfactoria!!!`);
    return { eliminado: true, mensaje: `El anime ${nombre} fue eliminado satisfactoriamente` };
};
