#!/bin/bash
docker build . -t clav2020
echo 'Tagging'
docker tag clav2020:latest zzglider/clav2020:Fev06
echo 'Pushing'
docker push zzglider/clav2020:Fev06
echo 'Terminado'

