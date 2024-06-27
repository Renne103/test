const http = require("http"); 
 const mainServer =  { host: "http://api.anst-dev.ru"}
 const proxy = http.createServer();

proxy.on("request", (clientRequest, proxyResponse) => {

const proxyRequest = http.request({ host: mainServer.host, path: clientRequest.url, method: clientRequest.method, headers: clientRequest.headers, });

proxyRequest.on("response", (mainServerResponse) => { 
 proxyResponse.writeHead( mainServerResponse.statusCode, mainServerResponse.headers );
mainServerResponse.pipe(proxyResponse); });

proxyRequest.on("error", (e) => { console.log(e); });
 clientRequest.pipe(proxyRequest); });


proxy.listen(4000, () => { console.log(`Proxy server is now listening on port ${4000}`); });
;
