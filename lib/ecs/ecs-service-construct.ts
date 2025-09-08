import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface EcsServiceConstructProps {
  cluster: ecs.Cluster;
  serviceName: string;
  image: ecs.ContainerImage;
  cpu?: number;
  memoryLimitMiB?: number;
  desiredCount?: number;
  publicLoadBalancer?: boolean;
  subnetType?: ec2.SubnetType;
  containerPort?: number;
}

export class EcsServiceConstruct extends Construct {
  public readonly service: ecs.FargateService;
  public readonly taskDefinition: ecs.FargateTaskDefinition;

  constructor(scope: Construct, id: string, props: EcsServiceConstructProps) {
    super(scope, id);

    this.taskDefinition = new ecs.FargateTaskDefinition(this, `${props.serviceName}TaskDef`, {
      cpu: props.cpu ?? 256,
      memoryLimitMiB: props.memoryLimitMiB ?? 512,
    });

    this.taskDefinition.addContainer(`${props.serviceName}Container`, {
      image: props.image,
      portMappings: [{ containerPort: props.containerPort ?? 80 }],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: props.serviceName }),
    });

    this.service = new ecs.FargateService(this, `${props.serviceName}Service`, {
      cluster: props.cluster,
      taskDefinition: this.taskDefinition,
      desiredCount: props.desiredCount ?? 1,
      vpcSubnets: {
        subnetType: props.subnetType ?? ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      assignPublicIp: false,
    });

  }
}
