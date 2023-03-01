import express from 'express';

const port = process.env.PORT;
const app = express();

app.use(express.static('./'));

app.listen(port, () => console.log(`Express server listening on port ${port}...`));