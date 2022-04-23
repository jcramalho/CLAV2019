#!/bin/bash
npm run build
docker build . -t clav2022
echo 'Tagging'
docker tag clav2022:latest zzglider/clav2022:Jan06
echo 'Pushing'
docker push zzglider/clav2022:Jan06
echo 'Terminado'
echo 'Id da imagem no DHub: zzglider/clav2022:Jan06'

