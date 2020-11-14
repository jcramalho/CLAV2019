#!/bin/bash
docker build . -t clav2020
echo 'Tagging'
docker tag clav2020:latest zzglider/clav2020:Nov14
echo 'Pushing'
docker push zzglider/clav2020:Nov14
echo 'Terminado'
echo 'Id da imagem no DHub: zzglider/clav2020:Nov14'

