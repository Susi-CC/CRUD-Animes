# Práctica de consolidación del módulo 6 "Desarrollo de aplicaciones web NODE express".
## Curso FullStack JavaScript
El trabajo consistía en crear una aplicación web que permita realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre un conjunto de animes almacenados en un archivo JSON. Esto se logra utilizando un servidor HTTP creado con Node.js.

El objetivo de la evaluación es demostrar que se poseen los conocimientos de JavaScript necesarios para manejar rutas HTTP, leer y escribir en archivos JSON, y estructurar un servidor básico utilizando módulos nativos de Node.js.
### Contenido del Proyecto

  index.js: Archivo principal que contiene el servidor HTTP. Maneja las rutas para las operaciones CRUD.
  animes.js: Archivo que contiene las funciones auxiliares para interactuar con el archivo JSON, incluyendo: Obtener todos los animes; Buscar un anime por ID o nombre;  Crear, actualizar y eliminar animes.
  anime.json: Archivo que almacena los datos de los animes en formato JSON.
  test/anime.test.js: Archivo de pruebas que utiliza Mocha y Chai para verificar la funcionalidad del servidor.

### Estructura del Proyecto

├── index.js           # Servidor principal

├── animes.js          # Funciones para la manipulación de los datos

├── anime.json         # Archivo JSON con los datos de los animes

├── test
│   └── anime.test.js  # Pruebas automatizadas con Mocha y Chai

└── package.json       # Configuración del proyecto y dependencias

### Dependencias
Este proyecto utiliza las siguientes dependencias:

  Nodemon: Para reiniciar el servidor automáticamente durante el desarrollo.
  Chai: Librería de aserciones para pruebas.
  Chai-http: Extensión de Chai para realizar pruebas HTTP.
  Mocha: Framework de pruebas.

### Instrucciones de Uso

Instalación de Dependencias: Asegúrate de instalar las dependencias ejecutando:

##### npm install

Iniciar el Servidor: Ejecuta el servidor en modo desarrollo con:

##### npm start

El servidor estará disponible en http://localhost:3001.

Realizar Pruebas: Para ejecutar las pruebas automatizadas, usa:

##### npm test

#### Estructura de las Rutas:

    GET /anime: Devuelve todos los animes.
    GET /anime/:id: Busca un anime por su ID.
    GET /anime/:nombre: Busca un anime por su nombre.
    POST /anime: Crea un nuevo anime. Requiere los campos nombre, genero, año y autor en el cuerpo de la solicitud.
    PUT /anime/:id: Actualiza un anime por su ID. Requiere los campos a actualizar en el cuerpo.
    DELETE /anime/:id: Elimina un anime por su ID.
