import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

Vue.config.productionTip = false;

window.vueInstance = new Vue({
  created() {
    // add these on created otherwise cv:mounted is too late.
    this.$on("service-worker-updated", ok => {
      if (typeof this.$children[0].whenServiceWorkderUpdated === "function") {
        this.$children[0].whenServiceWorkderUpdated(ok);
      }
    });
  },
  render: h => {
    return h(App); // , { attrs: { serviceWorkerUpdate: this.serviceWorkerUpdate } }
  }
}).$mount("#app");
