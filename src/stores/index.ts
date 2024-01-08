import { store } from 'quasar/wrappers';
import {
  Pinia,
  createPinia,
  Store as PiniaStore,
  StoreDefinition as PiniaStoreDefinition,
  StoreGeneric,
  StoreState,
  PiniaCustomStateProperties,
  StoreGetters,
  _ExtractStateFromSetupStore,
  _ExtractGettersFromSetupStore,
  _ExtractActionsFromSetupStore,
} from 'pinia';
import {
  Ref, ToRef, ToRefs, ComputedRef,
} from 'vue';
import { Router } from 'vue-router';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }

  // Export built-in ToComputedRefs and StoreToRefs types.
  export type ToComputedRefs<T> = { [K in keyof T]: ToRef<T[K]> extends Ref<infer U> ? ComputedRef<U> : ToRef<T[K]> };
  export type StoreToRefs<SS extends StoreGeneric> = ToRefs<StoreState<SS> & PiniaCustomStateProperties<StoreState<SS>>> & ToComputedRefs<StoreGetters<SS>>;
}

// Shorthand for Store and StoreDefinition types.
export type Store<Id extends string, SS> = PiniaStore<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>
export type StoreDefinition<Id extends string, SS> = PiniaStoreDefinition<Id, _ExtractStateFromSetupStore<SS>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */): Pinia => {
  const pinia: Pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia;
});
