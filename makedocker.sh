#!/bin/bash
docker build . -t clav2020
echo 'Tagging'
docker tag clav2020:latest zzglider/clav2020:Jun22
echo 'Pushing'
docker push zzglider/clav2020:Jun22
echo 'Terminado'
echo 'Id da imagem no DHub: zzglider/clav2020:Jun22'

