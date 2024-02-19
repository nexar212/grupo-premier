const express = require('express');
const { MongoClient, ObjectId  } = require('mongodb');
const multer = require('multer');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(cors());

//Configuración de Multer para guardar archivos en el servidor
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'archivos/'); // Directorio donde se guardarán los archivos subidos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


const upload = multer({ storage: storage });

// Conexión a la base de datos MongoDB
const url = 'mongodb+srv://grupopremier:closterpremier@cluster0.hxnevxj.mongodb.net/grupopremier';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

async function connectDB() {
  try {
    await client.connect();
    console.log('Conexión a MongoDB establecida');
    db = client.db('grupopremier');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
}

connectDB();

app.use(express.json());

// Obtener todos los usuarios
app.get('/api/grupopremier/users', async (req, res) => {
  try {
    const usuarios = await db.collection('users').find().toArray();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Guardar usuario nuevo
app.post('/api/grupopremier/users', multer().none(), (request, response) => {
  db.collection("users").countDocuments({}, function (error, numOfDocs) {
      try {
          const newUser = {
              nombre: request.body.nombre,
              primerApellido: request.body.primerApellido,
              segundoApellido: request.body.segundoApellido,
              calle: request.body.calle,
              numero: request.body.numero,
              colonia: request.body.colonia,
              codigoPostal: request.body.codigoPostal,
              telefono: request.body.telefono,
              rfc: request.body.rfc,
              estatus: 'Enviado',
              observaciones: '',
          };

          db.collection("users").insertOne(newUser, function(err, result) {
              if (err) {
                  console.error('Error al insertar usuario:', err);
                  response.status(500).send('Error del servidor');
              } else {
                  response.status(200).json({ _id: result.insertedId });
              }
          });
      } catch (error) {
          console.error('Error al insertar usuario:', error);
          response.status(500).send('Error del servidor');
      }
  });
});

// Subir archivo
app.post('/api/grupopremier/upload', upload.array('archivos', 10), (req, res) => {
  const userId = req.body.userId;

  client.connect(async (err) => {
    if (err) {
      console.error('Error de conexión a MongoDB:', err);
      return res.status(500).json({ error: 'Error de conexión a MongoDB' });
    }

    const archivos = req.files;
    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ error: 'Por favor, sube al menos un archivo' });
    }

    const archivosGuardados = archivos.map(archivo => ({
      nombre: archivo.originalname,
      contenido: archivo.buffer,
      userId: ObjectId(userId),
      path: archivo.path
    }));

    try {
      const result = await db.collection('archivos').insertMany(archivosGuardados);
      res.status(200).json({ message: 'Archivos subidos correctamente', fileIds: result.insertedIds });
    } catch (error) {
      console.error('Error al insertar los archivos en MongoDB:', error);
      res.status(500).json({ error: 'Error al guardar los archivos en la base de datos' });
    }
  });
});

// Obtener documentos subidos por usuario
app.get('/api/grupopremier/download/:userId/:docName', (req, res) => {
  const {
      userId,
      docName,
    } = req.params;

  client.connect(async (err) => {
    if (err) {
      console.error('Error de conexión a MongoDB:', err);
      return res.status(500).json({ error: 'Error de conexión a MongoDB' });
    }

    try {
      const filePath = path.join(__dirname, 'archivos', docName)
      res.setHeader('Content-Disposition', `attachment; filename="${docName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      
      const readStream = fs.createReadStream(filePath)
      readStream.pipe(res)

    } catch (error) {
      console.log('error al consultar documentos')
    }
  });
});

// Descarga de archivo por _id
app.post('/api/grupopremier/download/docNames', async (req, res) => {
  try {
    const userId = req.body.userId;
    const archivos = await db.collection('archivos').find({ userId: ObjectId(userId) }).toArray()
    
    if (!archivos || archivos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron archivos para este usuario' });
    }

    const archivosParaEnviar = archivos.map(archivo => ({
      _id: archivo._id,
      nombre: archivo.nombre
    }));

    res.status(200).json(archivosParaEnviar);
  } catch (error) {
    console.error('Error al obtener los archivos desde MongoDB:', error);
    res.status(500).json({ error: 'Error al obtener los archivos desde la base de datos' });
  }
})

// Cambiar estatus del usuario
app.post('/api/grupopremier/estatus', async (req, res) => {
  try {
    const {
      userId,
      status,
      observaciones
    } = req.body;

    const result = await db.collection('users').updateOne({ _id: ObjectId(userId)}, {$set: {estatus: status, observaciones}})
    if(result.modifiedCount === 1){
      res.status(200).json({mensaje: 'Se realizo actualización correctamente'});
    }else{
      res.status(400).json({mensaje: 'No se realizó la actualización'});
    }
  } catch (error) {
    console.error('Error al cambiar estatus: ', error);
    res.status(500).json({ error: 'Error al cambiar estatus' });
  }
})

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error del servidor');
});

// Inicia el servidor en el puerto 5038
const PORT = process.env.PORT || 5038;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});