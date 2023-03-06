import * as cdk from "aws-cdk-lib";

export type StackName = "sandbox" | "development" | "staging" | "production";

export interface CommonStackProps extends cdk.StackProps {
  stackName: string;
}

export interface EnvStackProps extends cdk.StackProps {
  iamCertificateId: string;
  stackName: string;
}
