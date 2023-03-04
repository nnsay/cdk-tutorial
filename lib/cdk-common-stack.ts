import * as cdk from "aws-cdk-lib";
import {
  aws_iam as iam,
  aws_cloudfront as cloudfront,
  aws_certificatemanager as acm,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as fs from "fs";
import * as path from "path";

export class CommonStack extends cdk.Stack {
  // 泛域名证书
  public readonly certArn: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainCert = new iam.CfnServerCertificate(this, "domainCert", {
      serverCertificateName: "vd20231214",
      privateKey: fs.readFileSync(
        path.join(
          __dirname,
          "..",
          "assets/domainCerts/8994950__visualdynamics.cn.key"
        ),
        { encoding: "utf-8" }
      ),
      certificateBody: fs.readFileSync(
        path.join(
          __dirname,
          "..",
          "assets/domainCerts/8994950__visualdynamics.cn.pem"
        ),
        { encoding: "utf-8" }
      ),
      certificateChain: fs.readFileSync(
        path.join(
          __dirname,
          "..",
          "assets/domainCerts/8994950__visualdynamics.cn.chain.pem"
        ),
        { encoding: "utf-8" }
      ),
      path: "/cloudfront/",
    });

    this.certArn = domainCert.attrArn;

    new cdk.CfnOutput(this, "iamCertificateId", {
      value: domainCert.attrArn,
      exportName: "iamCertificateId",
    });
  }
}
