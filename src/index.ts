import { Server, request } from 'node:http';
import { URL, urlToHttpOptions } from 'node:url';

import { RoundRobinAlgo } from './algos/round-robin.algo.js';

export type LoadBalancerConfig = {
  serverUrls: URL[],
  algo: 'round-robin'
}

export class LoadBalancer extends Server {
  constructor (config: LoadBalancerConfig) {
    const algoClass = [ RoundRobinAlgo ].find((al) => al.name === config.algo);
    if (!algoClass) {
      throw new Error(`LoadBalancer: algo: not found: ${config.algo}`);
    }

    const algo = new algoClass(config.serverUrls);

    super((req, res) => {
      const serverUrl: URL = algo.next();
      const nReq = request(urlToHttpOptions(serverUrl), (nRes) => nRes.pipe(res));
      req.pipe(nReq);
    });
  }
}