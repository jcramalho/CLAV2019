#!/bin/bash
docker build . -t clav2020
echo 'Tagging'
docker tag clav2020:latest zzglider/clav2020:Mar25
echo 'Pushing'
docker push zzglider/clav2020:Mar25
echo 'Terminado'
echo 'Id da imagem no DHub: zzglider/clav2020:Mar25'

