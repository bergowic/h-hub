#/bin/bash

rm -rf dist/
nx affected:build --prod --all || exit 1

(export STAGE=local && cd cdk && cdk deploy)
