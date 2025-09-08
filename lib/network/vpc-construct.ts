import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';

export interface VpcConstructProps {
  envName: string;
  cidr: string;
  maxAzs?: number;
  natGateways?: number;
}

export class VpcConstruct extends Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VpcConstructProps) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, `${props.envName}-vpc`, {
      cidr: props.cidr,
      maxAzs: props.maxAzs ?? 2,
      natGateways: props.natGateways ?? 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private-app',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'private-db',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Adding "Name" tag automatically
    cdk.Tags.of(this.vpc).add('Name', `${props.envName}-vpc`);

    // Opsional: kasih tag ke semua subnet
    this.vpc.publicSubnets.forEach((subnet, idx) => {
      cdk.Tags.of(subnet).add('Name', `${props.envName}-public-${idx+1}`);
    });

    this.vpc.privateSubnets.forEach((subnet, idx) => {
      cdk.Tags.of(subnet).add('Name', `${props.envName}-private-app-${idx+1}`);
    });

    this.vpc.isolatedSubnets.forEach((subnet, idx) => {
      cdk.Tags.of(subnet).add('Name', `${props.envName}-private-db-${idx+1}`);
    });
  }
}
