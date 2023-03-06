#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkEnvStack } from "../lib/cdk-env-stack";
import { CommonStack } from "../lib/cdk-common-stack";
import { StackName } from "../@types/stack-props";

// HINT: 增加每个Stack的证书
const certMap = new Map<StackName, string>();
certMap.set("sandbox", "ASCAUBQCIOHWSEFYGQSE4");

const stackName = (process.env.STACK_NAME ?? "sandbox") as StackName;
const app = new cdk.App();

const env = {
  account: process.env.CDK_DEPLOY_ACCOUN ?? process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION ?? process.env.CDK_DEFAULT_REGION,
};

const commonStack = new CommonStack(app, "CdkCommonStack", {
  stackName: "common",
  env,
});
cdk.Tags.of(commonStack).add("stack", commonStack.stackName);

if (certMap.get(stackName)) {
  const envStack = new CdkEnvStack(app, "CdkEnvStack", {
    env,
    stackName,
    iamCertificateId: certMap.get(stackName)!,
  });
  cdk.Tags.of(envStack).add("stack", envStack.stackName);
}
