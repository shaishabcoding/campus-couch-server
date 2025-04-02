import { Router } from 'express';
import { AuthRoutes } from '../app/modules/auth/Auth.route';
import { UserRoutes } from '../app/modules/user/User.route';
import auth from '../app/middlewares/auth';
import { EUserRole } from '../app/modules/user/User.enum';
import { TRoute } from '../types/route.types';
import AdminRoutes from '../app/modules/admin/Admin.routes';
import { OrderRoutes } from '../app/modules/order/Order.route';
import { PaymentRoutes } from '../app/modules/payment/Payment.route';
import { ProductRoutes } from '../app/modules/product/Product.route';
import ReviewRoutes from '../app/modules/review/Review.route';
import { CartRoutes } from '../app/modules/cart/Cart.route';
import { WishlistRoutes } from '../app/modules/wishlist/Wishlist.route';
import { BundleRoutes } from '../app/modules/bundle/Bundle.route';

const routes: TRoute[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/profile',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: UserRoutes.user,
  },
  {
    path: '/admin',
    middlewares: [auth(EUserRole.ADMIN)],
    route: AdminRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes.user,
  },
  {
    path: '/bundles',
    route: BundleRoutes.user,
  },
  {
    path: '/reviews',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: ReviewRoutes,
  },
  {
    path: '/orders',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: OrderRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/cart',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: CartRoutes,
  },
  {
    path: '/wishlist',
    middlewares: [auth(EUserRole.USER, EUserRole.ADMIN)],
    route: WishlistRoutes,
  },
];

export default Router().inject(routes);
