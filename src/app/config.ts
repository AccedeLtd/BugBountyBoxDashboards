import { env } from './build-config';

let includeAdmin = false;
let includeHacker = false;
let includeCustomer = false;

// All modules will be enabled in dev mode
switch (env as any) {
  case 'admin':
    includeAdmin = true;
    break;

  case 'hacker':
    includeHacker = true;
    break;

  case 'customer':
    includeCustomer = true;
    break;

  default:
    includeAdmin = includeHacker = includeCustomer = true;
    break;
}

export { includeAdmin, includeHacker, includeCustomer };
