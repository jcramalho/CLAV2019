#!/bin/bash
docker build . -t clav2019
echo 'Tagging'
docker tag clav2019:latest zzglider/clav2019:Set19
echo 'Pushing'
docker push zzglider/clav2019:Set19
echo 'Terminado'

