const express = require("express");
const mysql = require("mysql2/promise");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const router = express.Router();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'lec2023',
  port: process.env.DB_PORT || 3306
};

async function getDatabaseConnection() {
  return await mysql.createConnection(dbConfig);
}

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API LEC 2023',
      version: '1.0.0',
      description: 'API para el League Of Legends EMEA Championship 2023',
    },
    servers: [
      {
        url: 'https://final-api-production.up.railway.app',
        description: 'Servidor en Railway para API LEC 2023'
      }
    ],
    components: {
      schemas: {
        Equipo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID del equipo',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre del equipo',
              example: 'G2 Esports'
            },
            acronimo: {
              type: 'string',
              description: 'Acrónimo del equipo',
              example: 'G2'
            },
            pais: {
              type: 'string',
              description: 'País del equipo',
              example: 'España'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Equipos',
        description: 'Operaciones relacionadas con equipos'
      }
    ]
  },
  apis: ['./index.js'], // or the appropriate file where your routes are defined
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

function validarIdEquipo(req, res, next) {
  const idEquipo = req.params.idEquipo;
  if (!idEquipo || isNaN(idEquipo)) {
    return res.status(400).json({ mensaje: "El parámetro idEquipo es inválido" });
  }
  next();
}

/**
 * @swagger
 * tags:
 *   - name: Equipos
 *     description: Operaciones relacionadas con equipos.
 */

/**
 * @swagger
 * /lec2023:
 *   get:
 *     summary: Obtiene todos los equipos.
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: Retorna la lista de equipos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipo'
 *       500:
 *         description: Error en el servidor.
 */
router.get('/lec2023', async (req, res) => {
  try {
    const connection = await getDatabaseConnection();
    const [results, fields] = await connection.execute('SELECT * FROM equipo');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /lec2023/{idEquipo}:
 *   get:
 *     summary: Obtiene un equipo por su ID.
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: idEquipo
 *         required: true
 *         description: ID del equipo a obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retorna el equipo solicitado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipo'
 *       404:
 *         description: El equipo no fue encontrado.
 */
router.get('/lec2023/:idEquipo', validarIdEquipo, async (req, res) => {
  try {
    const connection = await getDatabaseConnection();
    const [results, fields] = await connection.execute('SELECT * FROM equipo WHERE id = ?', [req.params.idEquipo]);

    if (results.length === 0) {
      return res.status(404).json({
        resultado: "El equipo no fue encontrado"
      });
    }

    res.json(results);
  } catch (error) {
    res.json(error);
  }
});

/**
 * @swagger
 * /lec2023:
 *   post:
 *     summary: Crea un nuevo equipo.
 *     tags: [Equipos]
 *     requestBody:
 *       description: Datos del equipo a crear.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       200:
 *         description: Equipo creado exitosamente.
 *       400:
 *         description: Faltan campos obligatorios en la solicitud.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/lec2023', async (req, res) => {
  try {
    const { nombre, acronimo, pais } = req.body;
    if (!nombre || !acronimo || !pais) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios en la solicitud" });
    }

    const connection = await getDatabaseConnection();
    const sentenciaSQL = `INSERT INTO equipo (nombre, acronimo, pais) VALUES (?, ?, ?)`;
    const [results, fields] = await connection.execute(sentenciaSQL, [nombre, acronimo, pais]);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /lec2023/{idEquipo}:
 *   delete:
 *     summary: Elimina un equipo por su ID.
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: idEquipo
 *         required: true
 *         description: ID del equipo a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipo eliminado exitosamente.
 *       404:
 *         description: El equipo no fue encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.delete('/lec2023/:idEquipo', validarIdEquipo, async (req, res) => {
  try {
    const connection = await getDatabaseConnection();
    const [results, fields] = await connection.execute(`DELETE FROM equipo WHERE id = ?`, [req.params.idEquipo]);

    if (results.affectedRows === 1) {
      res.json({
        resultado: 'Equipo eliminado'
      });
    } else {
      res.status(404).json({
        resultado: "El equipo no fue encontrado"
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /lec2023/{idEquipo}:
 *   put:
 *     summary: Actualiza un equipo por su ID.
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: idEquipo
 *         required: true
 *         description: ID del equipo a actualizar.
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos del equipo a actualizar.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       200:
 *         description: Equipo actualizado exitosamente.
 *       400:
 *         description: Faltan campos obligatorios en la solicitud.
 *       404:
 *         description: El equipo no fue encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.put('/lec2023/:idEquipo', validarIdEquipo, async (req, res) => {
  try {
    const { nombre, acronimo, pais } = req.body;
    if (!nombre || !acronimo || !pais) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios en la solicitud" });
    }

    const connection = await getDatabaseConnection();
    const sentenciaSQL = `UPDATE equipo SET nombre = ?, acronimo = ?, pais = ? WHERE id = ?`;
    const [results, fields] = await connection.execute(sentenciaSQL, [nombre, acronimo, pais, req.params.idEquipo]);

    if (results.affectedRows === 1) {
      res.json({
        resultado: 'Equipo actualizado'
      });
    } else {
      res.status(404).json({
        resultado: "El equipo no fue encontrado"
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

/**
 * @swagger
 * /lec2023/{idEquipo}:
 *   patch:
 *     summary: Actualiza parcialmente un equipo por su ID.
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: idEquipo
 *         required: true
 *         description: ID del equipo a actualizar parcialmente.
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos parciales del equipo a actualizar.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       200:
 *         description: Equipo actualizado parcialmente exitosamente.
 *       400:
 *         description: Faltan campos obligatorios en la solicitud.
 *       404:
 *         description: El equipo no fue encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.patch('/lec2023/:idEquipo', validarIdEquipo, async (req, res) => {
  try {
    const { nombre, acronimo, pais } = req.body;

    if (!nombre && !acronimo && !pais) {
      return res.status(400).json({ mensaje: "Se requiere al menos un campo para actualizar" });
    }

    const connection = await getDatabaseConnection();
    const updates = [];
    const params = [];

    if (nombre) {
      updates.push('nombre = ?');
      params.push(nombre);
    }

    if (acronimo) {
      updates.push('acronimo = ?');
      params.push(acronimo);
    }

    if (pais) {
      updates.push('pais = ?');
      params.push(pais);
    }

    params.push(req.params.idEquipo);

    const sentenciaSQL = `UPDATE equipo SET ${updates.join(', ')} WHERE id = ?`;
    const [results, fields] = await connection.execute(sentenciaSQL, params);

    if (results.affectedRows === 1) {
      res.json({
        resultado: 'Equipo actualizado parcialmente'
      });
    } else {
      res.status(404).json({
        resultado: "El equipo no fue encontrado"
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { router, validarIdEquipo };
