# @alb-xh/load-balancer

## Development

1. `nvm use`
2. `npm i`
3. `npm run simulate`

## Usage

1. `npm i @alb-xh/load-balancer` (node >= 20)
2. Example
```ts
import { LoadBalancer } from '@alb-xh/load-balancer';

const lb = new LoadBalancer({
  serverUrls: [
    new URL('http://localhost:4000'),
    new URL('http://localhost:4001'),
    new URL('http://localhost:4002'),
  ],
  algo: 'round-robin',
});

lb.listen(5000, () => {
  console.log('Listening');
});
```
