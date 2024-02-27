import { createServer } from 'https';
import { parse } from 'url';
import next from 'next';
import fs from 'fs';

const httpsEnabled = !!(process.env.HTTPS_PORT && process.env.HTTPS_KEY && process.env.HTTPS_CERT);

if (!httpsEnabled) {
    throw new Error('Could not start HTTPS server because of missing HTTPS environment variables. HTTPS_PORT, HTTPS_KEY and HTTPS_CERT required.');
}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsPort = process.env.HTTPS_PORT;
const listeningIpAddress = '0.0.0.0';

const httpsCredentials = {
    key: fs.readFileSync(`./https_certificates/${process.env.HTTPS_KEY}`),
    cert: fs.readFileSync(`./https_certificates/${process.env.HTTPS_CERT}`),
};

app.prepare().then(() => {
    createServer(httpsCredentials, async (req, res) => {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
    }).listen(httpsPort, listeningIpAddress, (err) => {
        if (err) throw err;
        console.log(`HTTPS server started on https://${listeningIpAddress}:${httpsPort}`);
    });
});
