import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  data() {
    return {
      info: {
        labels: [
          "Antecessores",
          "Sucessores",
          "Complementares",
          "Cruzados",
          "Sintetizadores",
          "Sintetizados",
          "Suplementos",
          "Suplementados"
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
    this.$request("get", "/classes/relstats")
      .then(res => {
        for (var i = 0; i < this.info.datasets[0].data.length; i++) {
          switch (i){
            case 0:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'eAntecessorDe'
              }).relCount;
              break;
            case 1:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'eSucessorDe'
              }).relCount;
              break;
            case 2:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'eComplementarDe'
              }).relCount;
              break;
            case 3:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'eCruzadoCom'
              }).relCount;
              break;
            case 4:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'eSinteseDe'
              }).relCount;
              break;
            case 5:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'eSintetizadoPor'
              }).relCount;
              break;
            case 6:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'eSuplementoDe'
              }).relCount;
              break;
            case 7:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'eSuplementoPara'
              }).relCount;
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
