import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  Router,
  RouterHistory,
  RouteLocationNormalizedLoaded,
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

declare module 'vue-router' {
  // Shorthand for vue-router route type.
  export type Route = RouteLocationNormalizedLoaded;
}

export default route((/* { store, ssrContext } */): Router => {
  const createHistory: (base?: string) => RouterHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const router: Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0, behavior: 'smooth' }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  return router;
});
