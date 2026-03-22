const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});