import { Router } from 'express';
import { TRoute } from '../../../types/route.types';
import { UserRoutes } from '../user/User.route';
import { ProductRoutes } from '../product/Product.route';

const routes: TRoute[] = [
  {
    path: '/users',
    route: UserRoutes.admin,
  },
  {
    path: '/products',
    route: ProductRoutes.admin,
  },
];

export default Router().inject(routes);
