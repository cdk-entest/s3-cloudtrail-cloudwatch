for x in (seq 1 100); 
  echo $x
  aws s3 cp . s3://$BUCKET/images/ --recursive
  sleep 1
end
