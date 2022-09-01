## Introduction 
[GitHub](https://github.com/entest-hai/s3-cloudtrail-cloudwatch) 
this shows how to monitor s3 data events with cloudtrail and cloudwatch. 

- cloudtrail monitors s3 data events 
- save the log events to a cloudwatch log group 
- use cloudwatch insight to query 
- create a cloudwatch metric and an alarm 

## Enable CT for a S3 Bucket

## Create a CW LogGroup 

## Query LogEvent  
```
filter eventName="PutObject"
```

## Metric Filter
this filter pattern count 1 each time a PutObject occur.  
```
{$.eventName="PutObject"}
```
Here is the graph metric with sum of PutObject within each 5 minutes 

![Screen Shot 2022-09-01 at 14 39 35](https://user-images.githubusercontent.com/20411077/187861321-daf0a35b-9a43-4920-8483-f340303d3620.png)

Then an alarm can be created for example if sum of PutObject within 5 minutes greater than 1000

