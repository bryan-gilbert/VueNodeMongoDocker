#!/usr/bin/env bash


: "${new_project:=$1}"

if [[ -z "${new_project}" ]]; then
    echo ******** Required parameter new_project not set ********
    exit
fi

if [[ -d "../${new_project}" ]]; then
    echo "******** Project directory "../${new_project}" already exists"
    exit
fi

node node_modules/@vue/cli/bin/vue create ${new_project}

mv ${new_project} ..
exit


