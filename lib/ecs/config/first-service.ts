// lib/config/first-service.ts
export const firstServiceConfig = {
  dev: {
    desiredCount: 1,
    cpu: 256,
    memoryLimitMiB: 512,
  },
  prod: {
    desiredCount: 1,
    cpu: 256,
    memoryLimitMiB: 512,
  },
};
