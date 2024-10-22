import { argv } from 'node:process';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { request } from 'node:http';
import { URL, urlToHttpOptions } from 'node:url';

import { LoadBalancer } from '../src/index.js';

const getNodesCount = () => {
  const nodes = Number(argv[2] ?? null);

  if (!Number.isInteger(nodes) || nodes <= 0 || nodes >= 10) throw new Error(`Invalid nodes: ${nodes}`);

  return nodes;
};

const getPorts = (count: number, start = 5000) =>   [ ...Array(count) ].map((_, i) => start + i);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const spinNodes = async (ports: number[], timeout = 1000) => {
  const nodeFilePath = resolve(import.meta.dirname, './node.js');

  for (const port of ports) {
    spawn(`npx tsx ${nodeFilePath} ${port}`, { stdio: 'inherit', shell: true })
  }

  await sleep(timeout);
}

const getServerUrls = (ports: number[]) => ports.map((port) => new URL(`http://localhost:${port}`));

const lbUrl = new URL('http://localhost:6000');
const spinLb = async (serverUrls: URL[], timeout = 1000) => {
  const lbName = `LoadBalancer: ${lbUrl.port}`;
  const lb = new LoadBalancer({ serverUrls, algo: 'round-robin' });

  lb.listen(lbUrl.port, () => console.log(`${lbName}: listening`));

  await sleep(timeout);
};

const sendRequest = (nrRequest: number) => {
  for (let i = 0; i < nrRequest; i++) {
    console.log(`Sending request: ${i + 1}`);

    const req = request({ ...urlToHttpOptions(lbUrl), method: 'POST' }, (res) => {
      const data: Uint8Array[] = [];
      res.on('data', (d) => data.push(d));
      res.on('end', () => console.log(Buffer.concat(data).toString()))
    });

    req.end();
  }
}

const main = async () => {
  const nodesCount = getNodesCount();
  const ports = getPorts(nodesCount);
  const serverUrls = getServerUrls(ports);

  await spinNodes(ports);
  await spinLb(serverUrls);
  sendRequest(ports.length * 3);
}

main();

