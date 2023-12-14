#!/bin/bash

rm -rf collections/stl-tsl

docker pull webrecorder/browsertrix-crawler:latest

docker run -p 9038:9037 --rm -v $PWD:/crawls/ webrecorder/browsertrix-crawler:latest crawl --config /crawls/config.yaml --customBehaviors /crawls/custom-behaviors/
