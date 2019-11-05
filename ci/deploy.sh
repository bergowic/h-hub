cd game-parser
sls deploy --aws-profile lukas
cd ../league-generate
sls deploy --aws-profile lukas
cd ../league-generate-trigger
sls deploy --aws-profile lukas
cd ../league-parser
sls deploy --aws-profile lukas
cd ../league-parser-trigger
sls deploy --aws-profile lukas
