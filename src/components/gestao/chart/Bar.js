import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  data() {
    return {
      info: {
        labels: [],
        datasets: [
          {
            label: "GET",
            backgroundColor: "#61affe",
            data: []
          },
          {
            label: "POST",
            backgroundColor: "#8edeba",
            data: []
          },
          {
            label: "PUT",
            backgroundColor: "#faa53b",
            data: []
          },
          {
            label: "DELETE",
            backgroundColor: "#f98787",
            data: []
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.$request("get", "/logsAgregados/rotas")
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          // alert(JSON.stringify(res.data[i]))
          this.info.labels.push(res.data[i].route);
          var index = this.info.labels.indexOf(res.data[i].route);
          this.info.datasets[0].data[index] = res.data[i].nGETs;
          this.info.datasets[1].data[index] = res.data[i].nPOSTs;
          this.info.datasets[2].data[index] = res.data[i].nPUTs;
          this.info.datasets[3].data[index] = res.data[i].nDELETEs;
        }
        this.renderChart(this.info, this.options);
      })
      .catch(error => alert(error));
  }
};
