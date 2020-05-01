#!/bin/bash
# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -e

usage() {
  local name
  name=$(basename "$0")
  echo "Usage: ${name} PROJECT_ID"
  exit 1
}

if [[ "$#" -ne 1 ]]; then
  usage
fi

readonly PROJECT_ID="$1"

echo "NOTE: This script assumes you've enabled Identity Platform:"
echo "https://console.cloud.google.com/marketplace/details/google-cloud-platform/customer-identity?project=${PROJECT_ID}"

# Get the Firebase Browser API Key
API_KEY_NAME=$(gcloud alpha --project="${PROJECT_ID}" services api-keys list \
               --filter="displayName:Browser key (auto created by Firebase)" \
               --format="csv[no-heading](name)")
API_KEY=$(gcloud alpha --project="${PROJECT_ID}" \
          services api-keys get-key-string "${API_KEY_NAME}" \
          --format="csv[no-heading](keyString)")

cat > webui/firebaseConfig.js << FIREBASECONFIG
export const firebaseConfig = {
  "projectId": "${PROJECT_ID}",
  "apiKey": "${API_KEY}",
  "authDomain": "${PROJECT_ID}.firebaseapp.com"
};
FIREBASECONFIG

echo
echo "Wrote to webui/firebaseConfig.js:"
echo
cat webui/firebaseConfig.js