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
        ],
        datasets: [
          {
            backgroundColor: [
              "#E57373",
              "#D32F2F",
              "#7986CB",
              "#5C6BC0",
              "#26A69A",
              "#00897B"
            ],
            data: [0, 0, 0, 0, 0, 0]
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
    this.$request("get", "/classes/relstats")
      .then(res => {
        for (var i = 0; i < this.info.datasets[0].data.length; i++) {
          switch (i){
            case 0:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'temParticipanteApreciador'
              }).relCount;
              break;
            case 1:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'temParticipanteComunicador'
              }).relCount;
              break;
            case 2:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'temParticipanteDecisor'
              }).relCount;
              break;
            case 3:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'temParticipanteAssessor'
              }).relCount;
              break;
            case 4:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'temParticipanteIniciador'
              }).relCount;
              break;
            case 5:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.rel.split('#')[1] === 'temParticipanteExecutor'
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
