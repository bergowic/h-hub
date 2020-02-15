cd data-resolver
sls deploy
cd ../scorers
npm run build
aws s3 rm s3://$AWS_S3_BUCKET --recursive --exclude assets/*
aws s3 cp build s3://$AWS_S3_BUCKET --recursive --exclude assets/* --acl public-read
