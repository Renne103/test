const http = require("http");
const mainServer = { host: "api.anst-dev.ru", port: 80 }; // Обновлено на отдельные host и port

const proxy = http.createServer((clientRequest, proxyResponse) => {
    // Обработка CORS предзапросов (OPTIONS)
    if (clientRequest.method === 'OPTIONS') {
        proxyResponse.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true'
        });
        proxyResponse.end();
        return;
    }

    const options = {
        host: mainServer.host,
        port: mainServer.port,
        path: clientRequest.url,
        method: clientRequest.method,
        headers: clientRequest.headers,
    };

    const proxyRequest = http.request(options, (mainServerResponse) => {
        proxyResponse.writeHead(mainServerResponse.statusCode, {
            ...mainServerResponse.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true'
        });
        mainServerResponse.pipe(proxyResponse, { end: true });
    });

    proxyRequest.on("error", (e) => {
        console.error(e);
        proxyResponse.writeHead(500);
        proxyResponse.end("Internal Server Error");
    });

    clientRequest.pipe(proxyRequest, { end: true });
});

proxy.listen(4000, () => {
    console.log(`Proxy server is now listening on port 4000`);
});
