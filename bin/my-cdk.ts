#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network/network-stack';
import { EcsClusterStack } from '../lib/ecs/ecs-cluster-stack';
import { devConfig } from '../environments/dev';
import { prodConfig } from '../environments/prod';
import { FirstServiceStack } from '../lib/ecs/services/first-stack';
import cluster from 'cluster';

const app = new cdk.App();

// Switchable ENV variable
type EnvName = "dev" | "prod";

const targetEnv: EnvName = (process.env.ENV as EnvName) ?? "dev";
const config = targetEnv === "prod" ? prodConfig : devConfig;

const networkStack = new NetworkStack(app, `${targetEnv}-network`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  tags: { Environment: targetEnv },
  config,
});

// Create single cluster for all services
const clusterStack = new EcsClusterStack(app, `${targetEnv}-ecs-cluster-stack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  vpc: networkStack.vpc,
  envName: `${targetEnv}`,
});

// First Service
new FirstServiceStack(app, `${targetEnv}-first-service-stack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  cluster: clusterStack.cluster,
  envName: targetEnv,
}).addDependency(clusterStack);