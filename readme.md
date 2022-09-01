## Introduction 
[GitHub](https://github.com/entest-hai/s3-cloudtrail-cloudwatch) 
this shows how to monitor s3 data events with cloudtrail and cloudwatch. 

- cloudtrail monitors s3 data events 
- save the log events to a cloudwatch log group 
- use cloudwatch insight to query 
- create a cloudwatch metric and an alarm 

## Enable CT for a S3 Bucket

## Configure a CW LogGroup 

## Query Log Event with CW Insight 
```
filter eventName="PutObject"
```

## Metric Filter, and Alarm 
this filter pattern count 1 each time a PutObject occur.  
```
{$.eventName="PutObject"}
```
Here is the graph metric with sum of PutObject within each 5 minutes 



Then an alarm can be created for example if sum of PutObject within 5 minutes greater than 1000

