import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route.js";
import { BuyerRoutes } from "../modules/buyer/buyer.route.js";
import { AgentsRoutes } from "../modules/agent/agent.route.js";
import { AdminRoutes } from "../modules/admin/admin.route.js";
import { PropertyRoutes } from "../modules/property/property.rout.js";
import { AuthRoutes } from "../modules/Auth/auth.route.js";
import { AgenciesRoutes } from "../modules/agency/agency.route.js";
import { ReviewsRoutes } from "../modules/reviews/reviews.rout.js";
import { MessageRoutes } from "../modules/message/message.route.js";
import { AppointmentRoutes } from "../modules/appointment/appointment.route.js";
import { PlanRoutes } from "../modules/plan/plan.route.js";
import { PaymentRoutes } from "../modules/payment/payment.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/buyers",
    route: BuyerRoutes,
  },
  {
    path: "/agents",
    route: AgentsRoutes,
  },
  {
    path: "/agencies",
    route: AgenciesRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/properties",
    route: PropertyRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/reviews",
    route: ReviewsRoutes,
  },
  {
    path: "/messages",
    route: MessageRoutes,
  },
  {
    path: "/appointments",
    route: AppointmentRoutes,
  },
  {
    path: "/plans",
    route: PlanRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
