import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  data() {
    return {
      info: {
        labels: [
          "É Antecessor de",
          "É Sucessor de",
          "É Complementar de",
          "É Cruzado com",
          "É Sintese de",
          "É Sintetizado por",
          "É Suplemento de",
          "É Suplemento para"
        ],
        datasets: [
          {
            backgroundColor: [
              "#E57373",
              "#D32F2F",
              "#7986CB",
              "#5C6BC0",
              "#26A69A",
              "#00897B",
              "#FFC400",
              "#FFAB00"
            ],
            data: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Relações dos processos de negócio"
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.$request("get", "/indicadores/relstats")
      .then(res => {
        for (var i = 0; i < this.info.datasets[0].data.length; i++) {
          switch (i) {
            case 0:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "eAntecessorDe";
=======
                return elem.indicador === 'eAntecessorDe'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 1:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "eSucessorDe";
=======
                return elem.indicador === 'eSucessorDe'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 2:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "eComplementarDe";
=======
                return elem.indicador === 'eComplementarDe'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 3:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "eCruzadoCom";
=======
                return elem.indicador === 'eCruzadoCom'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 4:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "eSinteseDe";
=======
                return elem.indicador === 'eSinteseDe'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 5:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "eSintetizadoPor";
=======
                return elem.indicador === 'eSintetizadoPor'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 6:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "eSuplementoDe";
=======
                return elem.indicador === 'eSuplementoDe'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 7:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "eSuplementoPara";
=======
                return elem.indicador === 'eSuplementoPara'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            default:
              break;
          }
        }
        this.renderChart(this.info, this.options);
      })
      .catch(error => alert(error));
  }
};
