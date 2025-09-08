import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs';
import { VpcConstruct } from './vpc-construct';

interface NetworkStackProps extends cdk.StackProps {
  config: {
    envName: string;
    cidr: string;
    maxAzs: number;
    natGateways: number;
  }
}

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    const vpcConstruct = new VpcConstruct(this, 'MyVpc', {
      envName: props.config.envName,
      cidr: props.config.cidr,
      maxAzs: props.config.maxAzs,
      natGateways: props.config.natGateways,
    });

    this.vpc = vpcConstruct.vpc;
  }
}
