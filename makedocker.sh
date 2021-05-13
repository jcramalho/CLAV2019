#!/bin/bash
npm run build
docker build . -t clav2020
echo 'Tagging'
docker tag clav2020:latest zzglider/clav2021:Mai14
echo 'Pushing'
docker push zzglider/clav2021:Mai14
echo 'Terminado'
echo 'Id da imagem no DHub: zzglider/clav2021:Mai14'

