import { argv } from 'node:process';
import { createServer } from 'node:http';

const getPort = () => {
  const port = Number(argv[2] ?? null);

  if (!Number.isInteger(port) || port <= 0) throw new Error(`Invalid port: ${port}`);

  return port;
};

const spinServer = (port: number) => {
  const serverName = `Node:${port}`;
  const server = createServer((req, res) => {
    res.write(`${serverName}: Hello world`);
    res.end();
  });
  server.listen(port, () => console.log(`${serverName}: listening`));
};

const main = () => {
  const port = getPort();
  spinServer(port);
};

main();