// ecs-cluster-stack.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

interface EcsClusterStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  envName: "dev" | "prod";
}

export class EcsClusterStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;

  constructor(scope: Construct, id: string, props: EcsClusterStackProps) {
    super(scope, id, props);

    this.cluster = new ecs.Cluster(this, `${props.envName}-EcsCluster`, {
      vpc: props.vpc,
      clusterName: `${props.envName}-ecs-cluster`,
    });
  }
}
