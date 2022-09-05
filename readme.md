## Introduction 
[GitHub](https://github.com/entest-hai/s3-cloudtrail-cloudwatch) 
this shows how to monitor s3 data events with cloudtrail and cloudwatch. 

- cloudtrail monitors s3 data events of a bucket 
- save the log events to a cloudwatch log group 
- use cloudwatch insight to query 
- create a cloudwatch metric and an alarm 


## CloudWatch LogGroup 
create a log group 
```tsx
const logGroup = new aws_logs.LogGroup(this, "LogGroupDemo", {
  logGroupName: "LogGroupDemo",
  retention: RetentionDays.ONE_DAY,
  removalPolicy: RemovalPolicy.DESTROY,
});
```

create metric filter 
```tsx
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

```

create an alarm 
```tsx
const metric = filter.metric();
new aws_cloudwatch.Alarm(this, "S3PutObjectAlarm", {
  metric,
  threshold: 100,
  evaluationPeriods: 2,
});
```

## CloudTrail
create a trail, this L2 construct will automatically create a role for trail to write to a log group. 
```tsx
const trail = new aws_cloudtrail.Trail(
  this,
  "S3DataEventTrail",
  {
    trailName: "S3DataEventTrail",
    cloudWatchLogGroup: logGroup,
    sendToCloudWatchLogs: true
  }
)
```

use selector to enable trail for a specific bucket with a prefix. trail event selector in cloudformation and cdk 
```tsx
trail.addS3EventSelector(
  [
    {
      bucket: bucket,
      objectPrefix: "images/"
    }
  ],
  {
    includeManagementEvents: false
  }
)
```

advanced selector is not supported in cloudformation yet, only avaiable in aws console 
```json 
[
  {
    "name": null,
    "fieldSelectors": [
      {
        "field": "eventCategory",
        "equals": [
          "Data"
        ]
      },
      {
        "field": "resources.type",
        "equals": [
          "AWS::S3::Object"
        ]
      },
      {
        "field": "resources.ARN",
        "equals": [
          "arn:aws:s3:::sagemaker-us-east-1-$ACCOUNT_ID/"
        ]
      }
    ]
  }
]
```


## Query from Log Insight 
basic query example 

```
fields @timestamp, eventSource |
  filter eventName="PutObject" | 
  stats count(*) by eventSource |
  limit 10
```

## Metric Filter
this filter pattern count 1 each time a PutObject occur.  
```
{$.eventName="PutObject"}
```
Here is the graph metric with sum of PutObject within each 5 minutes 

![Screen Shot 2022-09-01 at 14 39 35](https://user-images.githubusercontent.com/20411077/187861321-daf0a35b-9a43-4920-8483-f340303d3620.png)

Then an alarm can be created for example if sum of PutObject within 5 minutes greater than 1000

