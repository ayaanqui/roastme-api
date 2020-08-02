const express = require('express');

const app = express();
const port = 3000;

app.get('/', (_, res) => res.send({ message: 'Lhintaro my boi wassup!!' }));

app.listen(port, () => console.log(`\nApp running at http://localhost:${port}\n\n`));