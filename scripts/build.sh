#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

function print() {
  echo -e "\033[0;32m$1\033[0m"
}

cd $DIR
print "[main] Installing dependencies"
npm install

cd $DIR/stream
print "[stream] Installing dependencies"
npm install

cd $DIR/api
print "[api] Installing dependencies"
npm install

cd $DIR/web
print "[web] Installing dependencies"
npm install
