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
          text: "Tipo de participantes"
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
                return elem.indicador === "temParticipanteApreciador";
=======
                return elem.indicador === 'temParticipanteApreciador'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 1:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "temParticipanteComunicador";
=======
                return elem.indicador === 'temParticipanteComunicador'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 2:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "temParticipanteDecisor";
=======
                return elem.indicador === 'temParticipanteDecisor'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 3:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "temParticipanteAssessor";
=======
                return elem.indicador === 'temParticipanteAssessor'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 4:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "temParticipanteIniciador";
=======
                return elem.indicador === 'temParticipanteIniciador'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 5:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "temParticipanteExecutor";
=======
                return elem.indicador === 'temParticipanteExecutor'
>>>>>>> 3a31fceda94ebddb7a91aa9e370e38b093b76346
              }).valor;
              break;
            case 6:
              this.info.datasets[0].data[i] = res.data.find(elem => {
<<<<<<< HEAD
                return elem.indicador === "temDono";
=======
                return elem.indicador === 'temDono'
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
