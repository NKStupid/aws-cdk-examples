import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');
import cdk = require('@aws-cdk/core');
import path = require('path');

const app = new cdk.App();
const env = {
     region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,	 
    account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};
const stack = new cdk.Stack(app, 'FargateServiceWithLocalImage', {env});

// Create VPC and Fargate Cluster
// NOTE: Limit AZs to avoid reaching resource quotas
// const vpc = new ec2.Vpc(stack, 'MyVpc', { maxAzs: 2 });

const vpc = ec2.Vpc.fromLookup(stack, 'ImportVPC',{isDefault: false,vpcId: 'vpc-097fedf3787889d3a' });
const cluster = new ecs.Cluster(stack, 'Wise-Cluster', { vpc });

// Instantiate Fargate Service with a cluster and a local image that gets
// uploaded to an S3 staging bucket prior to being uploaded to ECR.
// A new repository is created in ECR and the Fargate service is created
// with the image from ECR.
new ecs_patterns.ApplicationLoadBalancedFargateService(stack, "FargateService", {
  cluster,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('nginx'),
  },
  environment: {
     PLATFORM: 'Amazon ECS---Move Move Move'
   },
});

app.synth();
