import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import { EcsServiceConstruct } from "../ecs-service-construct";
import { serviceConfigs } from "../config";

interface FirstServiceStackProps extends cdk.StackProps {
  cluster: ecs.Cluster;
  envName: "dev" | "prod";
}

export class FirstServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FirstServiceStackProps) {
    super(scope, id, props);

    const cfg = serviceConfigs.first[props.envName];

    new EcsServiceConstruct(this, `${props.envName}-first-service`, {
      cluster: props.cluster,
      serviceName: "first",
      image: ecs.ContainerImage.fromRegistry("nginx"),
      publicLoadBalancer: false,
      ...cfg,
    });
  }
}
