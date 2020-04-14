import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  data() {
    return {
      info: {
        labels: [
          "Apreciador",
          "Comunicador",
          "Decisor",
          "Assessor",
          "Iniciador",
          "Executor",
          "Dono"
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
              "#FDD835"
            ],
            data: [0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Tipo de participantes'
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
                return elem.indicador.split('#')[1] === 'temParticipanteApreciador'
              }).valor;
              break;
            case 1:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'temParticipanteComunicador'
              }).valor;
              break;
            case 2:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'temParticipanteDecisor'
              }).valor;
              break;
            case 3:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'temParticipanteAssessor'
              }).valor;
              break;
            case 4:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'temParticipanteIniciador'
              }).valor;
              break;
            case 5:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'temParticipanteExecutor'
              }).valor;
              break;
            case 6:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador.split('#')[1] === 'temDono'
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
