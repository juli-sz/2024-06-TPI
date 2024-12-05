import { Esculturas, Eventos, Artistas, Imagenes } from './clases.js';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
// Esto de abajo es para usar el .env para guardar la contraseña de la database
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Crear un pool de conexiones reutilizable
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export function crearConexion(){
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
}
export async function ArtistasConsulta() {
  const con = crearConexion();

  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        reject(err);
        return;
      }

      console.log("Connected!");
      // Seleccionar datos de la tabla "artistas"

      con.query('CALL cons_artistas()', function (err, results) {
        if (err) {
          console.error('Error selecting data: ' + err.message);
          reject(err);
          return;
        }
        const resultados = results[0];
        const listArtistas = resultados.map((row) => {
          return new Artistas(row.DNI, row.NyA, row.res_biografia, row.contacto, row.URL_foto, row.promedio);
        });

        // Cerrar la conexión
        con.end();
        resolve(listArtistas);
      });
    });
  });
}

export async function EsculturasConsulta() {
  return new Promise((resolve, reject) => { // Aquí creamos una nueva promesa
    let con = crearConexion();

    con.connect(function (err) {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        reject(err); // Rechazamos la promesa en caso de error
        return;
      }
      console.log("Connected!");

      con.query('CALL cons_esculturas()', function (err, results) {
        if (err) {
          console.error('Error selecting data: ' + err.message);
          reject(err); // Rechazamos la promesa en caso de error
          return;
        }

        const esculturasMap = new Map();

        results[0].forEach((row) => {
          const esculturaNombre = row.nombre;

          // Verificar si la escultura ya está en el map
          if (!esculturasMap.has(esculturaNombre)) {
            // Si no existe, crear una nueva instancia de Esculturas
            const nuevaEscultura = new Esculturas(row.nombre, row.f_creacion, row.antecedentes, row.tecnica, row.promedio);
            esculturasMap.set(esculturaNombre, nuevaEscultura);
          }

          // Obtener la escultura actual del map
          const escultura = esculturasMap.get(esculturaNombre);

          // Verificar y agregar artista
          if (!escultura.getArtistas().some(artista => artista.DNI === row.DNI)) {
            const nuevoArtista = new Artistas(
              row.DNI,
              row.NyA,
              row.res_biografia,
              row.contacto,
              row.URL_foto,
              0
            );
            escultura.addArtista(nuevoArtista);
          }

          // Verificar y agregar imagen
          if (!escultura.getImagenes().some(imagen => imagen.url === row.URL)) {
            const nuevaImagen = new Imagenes(
              row.URL,
              row.etapa
          );
            escultura.addImagen(nuevaImagen);
          }
          
        });

        // Convertir el Map a un array de esculturas
        const listEsculturas = Array.from(esculturasMap.values());

        con.end(); // Cierra la conexión
        resolve(listEsculturas); // Resolvemos la promesa con el resultado
      });
    });
  });
};

export async function login(correo, password) {
  let con = crearConexion();

  return new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        reject(err); // Rechazar la promesa en caso de error de conexión
        return;
      }
      console.log("Connected!");

      // Consulta para obtener el hash de la contraseña
      const query = 'CALL getUserByEmail(?)'; // Procedimiento que obtiene datos del usuario por correo
      con.query(query, [correo], (err, results) => {
        if (err) {
          console.error('Error querying the database:', err);
          reject(err); // Rechazar la promesa en caso de error en la consulta
        } else if (results.length === 0) {
          // Si no se encuentra el usuario
          reject(new Error('Usuario no encontrado'));
        } else {
          // Comparamos la contraseña ingresada con la hasheada
          const hashedPassword = results[0][0].contraseña;
          bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
              console.error('Error comparing passwords:', err);
              reject(err); // Rechazar en caso de error en la comparación
            } else if (!isMatch) {
              // Contraseña incorrecta
              reject(new Error('Contraseña incorrecta'));
            } else {
              // Contraseña correcta
              resolve(results[0]); // Resolver con los datos del usuario
            }
          });
        }
        con.end(); // Cerramos la conexión después de terminar
      });
    });
  });
}


export async function EventosConsulta() {
  const con = crearConexion();

  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        reject(err);
        return;
      }

      console.log("Connected!");

      // Seleccionar datos de la tabla "eventos"
      con.query('CALL cons_eventos()', function (err, results) {
        if (err) {
          console.error('Error selecting data: ' + err.message);
          reject(err);
          return;
        }
        const resultados = results[0];
        const listEventos = resultados.map((row) => {
          return new Eventos(row.nombre, row.lugar, row.fecha_inicio, row.fecha_fin, row.tematica, row.hora_inicio, row.hora_fin, row.promedio);
        });

        // Cerrar la conexión
        con.end();
        resolve(listEventos);
      });
    });
  });
}


export async function ObrasdeUnEvento(evento) {
  const con = crearConexion();
  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        reject(err);
        return;
      }

      console.log("Connected!");

      // Seleccionar datos de la tabla "eventos"
      con.query('CALL obrasDeUnEvento(?)', [evento], function (err, results) {
        if (err) {
          console.error('Error selecting data: ' + err.message);
          reject(err);
          return;
        }
        const esculturasMap = new Map();

        results[0].forEach((row) => {
          const esculturaNombre = row.nombre;

          // Verificar si la escultura ya está en el map
          if (!esculturasMap.has(esculturaNombre)) {
            // Si no existe, crear una nueva instancia de Esculturas
            const nuevaEscultura = new Esculturas(row.nombre, row.f_creacion, row.antecedentes, row.tecnica, row.promedio);
            esculturasMap.set(esculturaNombre, nuevaEscultura);
          }

          // Obtener la escultura actual del map
          const escultura = esculturasMap.get(esculturaNombre);

          // Verificar y agregar artista
          if (!escultura.getArtistas().some(artista => artista.DNI === row.DNI)) {
            const nuevoArtista = new Artistas(
              row.DNI,
              row.NyA,
              row.res_biografia,
              row.contacto,
              row.URL_foto,
              0
            );
            escultura.addArtista(nuevoArtista);
          }

          // Verificar y agregar imagen
          if (!escultura.getImagenes().some(imagen => imagen.url === row.URL)) {
            const nuevaImagen = new Imagenes(
              row.URL,
              row.etapa
          );
            escultura.addImagen(nuevaImagen);
          }
          
        });

        // Convertir el Map a un array de esculturas
        const listEsculturas = Array.from(esculturasMap.values());

        con.end(); // Cierra la conexión
        resolve(listEsculturas); // Resolvemos la promesa con el resultado
      });
    });
  });
}

export async function ObrasdeUnArtista(artista) {
  const con = crearConexion();
  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        reject(err);
        return;
      }
      console.log("Connected!");

      con.query('CALL obrasDeUnArtista(?)', [artista], function (err, results) {
        if (err) {
          console.error('Error selecting data: ' + err.message);
          reject(err);
          return;
        }
        const esculturasMap = new Map();

        results[0].forEach((row) => {
          const esculturaNombre = row.nombre;

          // Verificar si la escultura ya está en el map
          if (!esculturasMap.has(esculturaNombre)) {
            // Si no existe, crear una nueva instancia de Esculturas
            const nuevaEscultura = new Esculturas(row.nombre, row.f_creacion, row.antecedentes, row.tecnica, row.promedio);
            esculturasMap.set(esculturaNombre, nuevaEscultura);
          }

          // Obtener la escultura actual del map
          const escultura = esculturasMap.get(esculturaNombre);

          // Verificar y agregar artista
          if (!escultura.getArtistas().some(artista => artista.DNI === row.DNI)) {
            const nuevoArtista = new Artistas(
              row.DNI,
              row.NyA,
              row.res_biografia,
              row.contacto,
              row.URL_foto,
              0
            );
            escultura.addArtista(nuevoArtista);
          }

          // Verificar y agregar imagen
          if (!escultura.getImagenes().some(imagen => imagen.URL === row.URL)) {
            const nuevaImagen = new Imagenes(
              row.URL,
              row.etapa
            );
            escultura.addImagen(nuevaImagen);
          }

        });

        // Convertir el Map a un array de esculturas
        const listEsculturas = Array.from(esculturasMap.values());

        con.end(); // Cierra la conexión
        resolve(listEsculturas); // Resolvemos la promesa con el resultado
      });
    });
  });
}

export async function EventosYEsculturasDeObra(obra) {
  const con = crearConexion();
  return new Promise((resolve, reject) => {
    con.connect(function (err) {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        reject(err);
        return;
      }
      console.log("Connected!");

      con.query('CALL EventosYEsculturasDeObra(?)', [obra], function (err, results) {
        if (err) {
          console.error('Error selecting data: ' + err.message);
          reject(err);
          return;
        }
        const artistasMap = new Map(); // Para asegurar artistas únicos
        const eventosMap = new Map(); // Para asegurar eventos únicos
        results[0].forEach((row) => {
            // Procesar artistas
            if (!artistasMap.has(row.DNI)) { // Verifica si el artista ya está en el mapa
              const nuevoArtista = new Artistas(
                row.DNI,
                row.NyA,
                row.res_biografia,
                row.contacto,
                row.URL_foto,
                0
              );
              artistasMap.set(row.DNI, nuevoArtista); // Agrega al mapa
            }

            // Procesar eventos
            if (!eventosMap.has(row.nombre)) { // Verifica si el evento ya está en el mapa
              const nuevoEvento = new Eventos(
                row.nombre,
                row.lugar,
                row.fecha_inicio,
                row.fecha_fin,
                row.tematica,
                row.hora_inicio,
                row.hora_fin,
                0
              );
              eventosMap.set(row.nombre, nuevoEvento); // Agrega al mapa
            }
          });
        // Convertir los mapas a listas
        const listas = {
          listaArtistas: Array.from(artistasMap.values()), // Artistas únicos
          listaEventos: Array.from(eventosMap.values()),  // Eventos únicos
        };
        con.end(); // Cierra la conexión
        resolve(listas); // Resolvemos la promesa con el resultado
        });
      });
    });
};



//InsertarEventos
export function insertarEvento(evento) {
  console.log("Insertando evento...");

  const query = `
    INSERT INTO eventos 
    SET nombre = '${evento.nombre}', 
        lugar = '${evento.lugar}', 
        tematica = '${evento.tematica}', 
        fecha_inicio = '${evento.fecha_inicio}', 
        fecha_fin = '${evento.fecha_fin}', 
        hora_inicio = '${evento.hora_inicio}', 
        hora_fin = '${evento.hora_fin}';
  `;

  // Retornar una promesa manualmente, envolviendo la llamada a pool.execute
  return new Promise((resolve, reject) => {
    pool.execute(query, (error, result) => {
      if (error) {
        reject(error); // Rechazamos la promesa en caso de error
      } else {
        console.log('Evento insertado:', result);
        // Ahora, accedemos directamente a insertId desde el objeto result
        resolve(result.insertId);
      }
    });
  }).catch(error => {
    console.error('Error al insertar evento:', error);
    throw error; // Propaga el error para manejo externo
  });
}

/*
const EventoNuevo = {
  nombre: "AAAnuevotest2",
  lugar: "Lugar del evento",
  tematica: "Temática del evento",
  fecha_inicio: "2024-12-05",
  fecha_fin: "2024-12-06",
  hora_inicio: "10:00:00",
  hora_fin: "18:00:00"
};*/


// Llamar a la función
//insertarEvento(EventoNuevo).catch(console.error);
//console.log("Listo?")




//Convertir Foto y Subir artista
//import cloudinary from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream'; // Para convertir el buffer en un flujo legible
import { promisify } from 'util'; // Para utilizar promesas con la función de Cloudinary
const uploadStreamPromise = promisify(cloudinary.uploader.upload_stream);

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

// Función para insertar un artista
export async function insertarArtista(artista, imagenPerfil) {
  console.log("Insertando artista...");
  console.log(imagenPerfil); // Para verificar que el archivo se recibe correctamente
  console.log("Datos del artista:", artista); // Para revisar el contenido del objeto artista

  // Validación básica de entrada
  if (!artista || !artista.DNI || !imagenPerfil || !imagenPerfil.buffer) {
    throw new Error("Faltan datos obligatorios: DNI o imagen.");
  }

  try {
    // Convertir el buffer de la imagen en un stream legible
    const bufferStream = new Readable();
    bufferStream.push(imagenPerfil.buffer);
    bufferStream.push(null); // Indica el final del stream

    // Subir la imagen de perfil a Cloudinary usando upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'profile-picture',
          public_id: `artista_${artista.DNI}`, // Usamos el DNI como ID único
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      bufferStream.pipe(stream); // Pasar el stream al uploader de Cloudinary
    });

    const urlFoto = result.secure_url;
    console.log("URL DE LA FOTO:", urlFoto);

    // Crear el query de inserción en la base de datos
    const query = `
      INSERT INTO artistas 
      (DNI, NyA, res_biografia, contacto, URL_foto, contrasena)
      VALUES ('${artista.DNI}', '${artista.NyA}', '${artista.res_biografia}', '${artista.contacto}', '${urlFoto}', '${artista.contrasena}');
    `;

    // Ejecutar el query para insertar el artista
    return new Promise((resolve, reject) => {
      pool.execute(query, (error, result) => {
        if (error) {
          console.error("Error al insertar el artista:", error);
          reject(error);
        } else {
          console.log("Artista insertado:", result);
          resolve(result.insertId);
        }
      });
    });
  } catch (error) {
    console.error("Error al subir la imagen o insertar el artista:", error);
    throw error;
  }
}

export async function register(nombreapellido, correo, contraseña) {
  let con = crearConexion();

  return new Promise((resolve, reject) => {
    bcrypt.hash(contraseña, 10, (err, hashedPassword) => { // 10 es el número de rondas de salt
      if (err) {
        console.error('Error hashing password:', err);
        reject(err); // Rechazar si hay un error al hashear la contraseña
        return;
      }

      con.connect((err) => {
        if (err) {
          console.error('Error connecting: ' + err.stack);
          reject(err); // Rechazar la promesa en caso de error de conexión
          return;
        }
        console.log("Connected!");

        // Realizamos la consulta a la base de datos pasando los parámetros
        const query = 'CALL register(?, ?, ?)'; // Definimos los placeholders
        con.query(query, [nombreapellido, correo, hashedPassword], (err, results) => { // Usamos la contraseña hasheada
          if (err) {
            console.error('Error querying the database:', err);
            reject(err); // Rechazar la promesa en caso de error en la consulta
          } else {
            resolve('hecho'); // Resolver la promesa con los resultados
          }
          con.end(); // Cerramos la conexión
        });
      });
    });
  });
}

export async function registrar_voto(rating, nombre, email) {
  let con = crearConexion();

  return new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        reject(err); // Rechazar la promesa en caso de error de conexión
        return;
      }
      console.log("Connected!");

      // Realizamos la consulta a la base de datos pasando los parámetros
      const query = 'CALL registrar_voto(?, ?, ?)'; // Definimos los placeholders
      con.query(query, [email, nombre, rating], (err, results) => { // Pasamos los valores
        if (err) {
          console.error('Error querying the database:', err);
          reject(err); // Rechazar la promesa en caso de error en la consulta
        } else {
          resolve('hecho'); // Resolver la promesa con los resultados
        }
        con.end(); // Cerramos la conexión
      });
    });
  });
}
