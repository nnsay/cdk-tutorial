import * as cdk from "aws-cdk-lib";

export interface CommonStackProps extends cdk.StackProps {
  stackName: string;
}

export interface EnvStackProps extends cdk.StackProps {
  iamCertificateId: string;
  stackName: string;
}
