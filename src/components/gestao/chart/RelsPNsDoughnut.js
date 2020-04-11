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
          text: 'Relações dos processos de negócio'
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.$request("get", "/stats/relstats")
      .then(res => {
        for (var i = 0; i < this.info.datasets[0].data.length; i++) {
          switch (i){
            case 0:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'eAntecessorDe'
              }).valor;
              break;
            case 1:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'eSucessorDe'
              }).valor;
              break;
            case 2:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'eComplementarDe'
              }).valor;
              break;
            case 3:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'eCruzadoCom'
              }).valor;
              break;
            case 4:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'eSinteseDe'
              }).valor;
              break;
            case 5:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'eSintetizadoPor'
              }).valor;
              break;
            case 6:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'eSuplementoDe'
              }).valor;
              break;
            case 7:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'eSuplementoPara'
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
