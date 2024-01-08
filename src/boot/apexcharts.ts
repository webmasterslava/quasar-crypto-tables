import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

// Add using ApexCharts library on app bootstrap.
export default boot(({ app }): void => {
  app.use(VueApexCharts);
});
