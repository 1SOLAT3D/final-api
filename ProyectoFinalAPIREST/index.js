const fs = require('fs');
const path = require('path');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const morgan = require('morgan');
const redoc = require('redoc-express');
const rte = require('./routes/lec2023');
const OpenApiSnippet = require('openapi-snippet');

const app = express();

app.use(express.json());
app.use(cors());

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

const openApiUrl = 'http://localhost:8080/api-docs-json';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API LEC 2023',
      version: '1.0.0',
      description: 'API para el League Of Legends EMEA Championship 2023',
    },
    servers: [
      {
        url: 'http://localhost:8080/api-docs-json',
        description: 'Servidor Local para API REST',
      },
    ],
  },
  apis: [path.join(__dirname, 'routes', 'lec2023.js')],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use('/redoc', redoc({
  title: 'API LEC 2023',
  specUrl: openApiUrl,
}));

app.get(
  '/api-docs-redoc',
  redoc({
    title: 'API Docs',
    specUrl: '/api-docs-json',
    nonce: '',
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: '#6EC5AB'
          }
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: '15px',
          lineHeight: '1.5',
          code: {
            code: '#87E8C7',
            backgroundColor: '#4D4D4E'
          }
        },
        menu: {
          backgroundColor: '#ffffff'
        }
      }
    }
  })
);

app.get('/', function (req, res) {
  res.send('hello, world!');
});

app.use("/api-docs-json", (req, res) => {
  res.json(swaggerSpec);
});

app.use('/lec2023', rte.router);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, { explorer: true }));

app.listen(8080, () => {
  console.log('Servidor Express escuchando en el puerto 8080');
});
