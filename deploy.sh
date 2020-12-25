#/bin/bash

nx affected:build --prod || exit 1

(export STAGE=local && cd cdk && cdk deploy)
