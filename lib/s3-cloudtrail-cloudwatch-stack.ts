import {
  Stack,
  StackProps,
  aws_logs,
  RemovalPolicy,
  aws_cloudwatch,
  aws_cloudtrail,
  aws_s3,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

interface CloudWatchLogProps extends StackProps {
  bucketName: string;
}

export class CloudWatchLogStack extends Stack {
  constructor(scope: Construct, id: string, props: CloudWatchLogProps) {
    super(scope, id, props);

    // lookup exited bucket
    const bucket = aws_s3.Bucket.fromBucketName(
      this,
      "ExistedBucket",
      props.bucketName
    );

    // logroup
    const logGroup = new aws_logs.LogGroup(this, "LogGroupDemo", {
      logGroupName: "LogGroupDemo",
      retention: RetentionDays.ONE_DAY,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // metric filter
    const filter = new aws_logs.MetricFilter(this, "MetricFilterDemo", {
      logGroup,
      metricNamespace: "S3DataEnvent",
      metricName: "PutObjectEvent",
      filterPattern: aws_logs.FilterPattern.all(
        aws_logs.FilterPattern.stringValue("$.eventName", "=", "PutObject")
      ),
      metricValue: "1",
      defaultValue: 0,
    });

    // alarm
    const metric = filter.metric();
    new aws_cloudwatch.Alarm(this, "S3PutObjectAlarm", {
      metric,
      threshold: 100,
      evaluationPeriods: 2,
    });

    // cloudtrail L2 construct
    const trail = new aws_cloudtrail.Trail(this, "S3DataEventTrail", {
      trailName: "S3DataEventTrail",
      cloudWatchLogGroup: logGroup,
      sendToCloudWatchLogs: true,
    });

    // select a specific bucket s3
    trail.addS3EventSelector(
      [
        {
          bucket: bucket,
          objectPrefix: "images/",
        },
      ],
      {
        includeManagementEvents: false,
      }
    );
  }
}
