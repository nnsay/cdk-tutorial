import * as cdk from "aws-cdk-lib";
import {
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
  aws_cloudfront as cloudfront,
  aws_route53 as route53,
  aws_route53_targets as targets,
  aws_iam as iam,
  aws_certificatemanager as acm,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { EnvStackProps } from "../@types/stack-props";

export class CdkEnvStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EnvStackProps) {
    super(scope, id, props);

    // globel varibles
    const iamCertificateId = props.iamCertificateId;

    // bucket
    const corsRule: s3.CorsRule = {
      allowedMethods: [
        s3.HttpMethods.DELETE,
        s3.HttpMethods.GET,
        s3.HttpMethods.HEAD,
        s3.HttpMethods.POST,
        s3.HttpMethods.PUT,
      ],
      allowedOrigins: ["*"],
    };
    const websiteBucket = new s3.Bucket(this, `${props.stackName}WebSite`, {
      cors: [corsRule],
      publicReadAccess: true,
      bucketName: `${props.stackName}-wb`,
      websiteIndexDocument: "index.html",
    });

    // deployment
    new s3deploy.BucketDeployment(this, `${props.stackName}Deployment`, {
      sources: [s3deploy.Source.asset("./tmp")],
      destinationBucket: websiteBucket,
    });

    // cloudfront
    const websiteDomain = `${props.stackName}.visualdynamics.cn`;
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      `${props.stackName}WebSiteCloudFront`,
      {
        originConfigs: [
          {
            customOriginSource: {
              domainName: websiteBucket.bucketWebsiteDomainName,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
            behaviors: [
              {
                pathPattern: "",
                compress: true,
                isDefaultBehavior: true,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
                allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
              },
            ],
          },
        ],
        defaultRootObject: "",
        viewerCertificate: cloudfront.ViewerCertificate.fromIamCertificate(
          iamCertificateId,
          {
            aliases: [websiteDomain],
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
          }
        ),
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        enableIpV6: false,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
      }
    );

    // route53
    // const hostedZone = new route53.HostedZone(
    //   this,
    //   `${props.stackName}Hostzone`,
    //   {
    //     zoneName: websiteDomain,
    //   }
    // );
    // new route53.ARecord(scope, "websiteDomain", {
    //   recordName: websiteDomain,
    //   target: route53.RecordTarget.fromAlias(
    //     new targets.CloudFrontTarget(distribution)
    //   ),
    //   zone: hostedZone,
    // });
  }
}
