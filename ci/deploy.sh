cd game-parser
sls deploy
cd ../league-generate
sls deploy
cd ../league-generate-trigger
sls deploy
cd ../league-parser
sls deploy
cd ../league-parser-trigger
sls deploy
aws s3 rm s3://$AWS_S3_BUCKET --recursive --exclude assets/*
aws s3 cp scorers/build s3://$AWS_S3_BUCKET --acl public-read --recursive --exclude assets/*
