#!/bin/bash
docker build . -t clav2019
docker tag clav2019:latest zzglider/clav2019:Set18
docker push zzglider/clav2019:Set18
echo 'Terminado'

