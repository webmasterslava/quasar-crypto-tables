import { QTableProps } from 'quasar';
import { watch, Ref } from 'vue';
import { Route, Router } from 'vue-router';

// Convert URL query params to data table pagination object.
function convertRouteToPagination(route: Route, defaults: QTableProps['pagination']): QTableProps['pagination'] {
  return {
    page: route.query.page ? +route.query.page : (defaults?.page || 1),
    sortBy: route.query.sort as string || defaults?.sortBy || 'id',
    descending: route.query.dir ? route.query.dir === 'desc' : (defaults?.descending || false),
    rowsPerPage: defaults?.rowsPerPage || 20,
  };
}

// Check if URL query params equal to data table pagination.
function routeEqualsToPagination(route: Route, defaults: QTableProps['pagination'], pagination: Ref<QTableProps['pagination']>): boolean {
  const routePagination: QTableProps['pagination'] = convertRouteToPagination(route, defaults);

  return routePagination?.page === pagination.value?.page
    && (routePagination?.sortBy === (pagination.value?.sortBy ? pagination.value.sortBy : defaults?.sortBy))
    && (routePagination?.descending === (pagination.value?.sortBy ? pagination.value.descending : defaults?.descending));
}

// Synchronize URL query params with data table pagination and vice versa.
export function syncRouteAndPagination(route: Route, router: Router, pagination: Ref<QTableProps['pagination']>): void {
  const defaults: QTableProps['pagination'] = pagination.value;

  // Synchronize URL query params with data table pagination changes.
  watch(pagination, (): void => {
    if (pagination.value && !routeEqualsToPagination(route, defaults, pagination)) {
      router.push({
        query: {
          page: pagination.value.page !== defaults?.page
            ? pagination.value.page
            : undefined,
          sort: pagination.value.sortBy && (pagination.value.sortBy !== defaults?.sortBy || pagination.value.descending !== defaults.descending)
            ? pagination.value.sortBy
            : undefined,
          dir: pagination.value.sortBy && (pagination.value.sortBy !== defaults?.sortBy || pagination.value.descending !== defaults.descending)
            ? pagination.value.descending
              ? 'desc'
              : 'asc'
            : undefined,
        },
      });
    }
  });

  // Synchronize data table pagination with URL query params changes.
  watch(route, (): void => {
    if (pagination.value && !routeEqualsToPagination(route, defaults, pagination)) {
      pagination.value = convertRouteToPagination(route, defaults);
    }
  });

  // Initialization of data table pagination.
  pagination.value = convertRouteToPagination(route, defaults);
}
