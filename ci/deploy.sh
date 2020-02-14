cd data-resolver/game-parser
sls deploy
cd ../league-generate
sls deploy
cd ../league-generate-trigger
sls deploy
cd ../league-parser
sls deploy
cd ../league-parser-trigger
sls deploy
cd ../../scorers
npm run build
aws s3 rm s3://$AWS_S3_BUCKET --recursive --exclude assets/*
aws s3 cp build s3://$AWS_S3_BUCKET --recursive --exclude assets/* --acl public-read
