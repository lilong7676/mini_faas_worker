export interface Func {
  id: string;
  name: string;
  domains: Domain[];
  deployments: Deployment[];
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  id: string;
  functionId: string;
  domain: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deployment {
  id: string;
  functionId: string;
  trigger: Trigger;
  createdAt: string;
  updatedAt: string;
}

type Trigger = 'http' | 'event';
