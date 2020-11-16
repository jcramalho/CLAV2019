import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  data() {
    return {
      info: {
        labels: ["Concervação", "Conservação Parcial", "Eliminação", "NE"],
        datasets: [
          {
            backgroundColor: ["#E57373", "#7986CB", "#26A69A", "#FFC400"],
            data: [0, 0, 0, 0]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Destinos Finais"
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.$request("get", "/indicadores/dfstats")
      .then(res => {
        for (var i = 0; i < this.info.datasets[0].data.length; i++) {
          switch (i) {
            case 0:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador === "C";
              }).valor;
              break;
            case 1:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador === "CP";
              }).valor;
              break;
            case 2:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador === "E";
              }).valor;
              break;
            case 3:
              this.info.datasets[0].data[i] = res.data.find(elem => {
                return elem.indicador === "NE";
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
