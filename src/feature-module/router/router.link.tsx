import { all_routes } from "./all_routes";
import Login from "../auth/login/login";
import ExamInstance from "../academic/examinations/exam-instance";
import BranchAcademicYear from "../academic/examinations/branch-academic-year";
import BranchClassName from "../academic/examinations/branch-class-name";
import BranchSection from "../academic/examinations/branch-section";
import BranchOrientation from "../academic/examinations/branch-orientation";
import BranchState from "../academic/examinations/branch-state";
import BranchZone from "../academic/examinations/branch-zone";
import Branches from "../academic/examinations/branches";
import AdminDashboard from "../academic/examinations/dashboard";
import NetworkConnectionDetails from "../academic/examinations/Newtork-connection-details";
import PaymentDues from "../academic/examinations/payment-due";
import Tickets from "../academic/examinations/tickets";
import ProviderDetailsTable from "../academic/examinations/isb-provider-details";
import ApproavlStatusTable from "../academic/examinations/approval-status-table";
import PaymentStatusTable from "../academic/examinations/payment-status-table";
import DeviceTypeTable from "../academic/examinations/device-type-table";
import SectionDetailTable from "../academic/examinations/section-details-table";
import BillingCompanyTable from "../academic/examinations/billing-company-detail";
import AdminDetailsTable from "../academic/examinations/admin-details-table";
import EnginnerDetailTable from "../academic/examinations/enginner-detail-table";
import Groups from "../academic/examinations/groups";
import Users from "../academic/examinations/users";
import SolvedTickets from "../academic/examinations/solved-tickets";
import CategoryDetailTable from "../academic/examinations/categories-table";
import ChannelDetailTable from "../academic/examinations/channel-details";
import ServiceTypeDetailsTable from "../academic/examinations/service-type";
import SubCategoryDetailTable from "../academic/examinations/sub-category";
import IspCategoryTable from "../academic/examinations/isp-category";
import PaymentEntry from "../academic/examinations/payment-entry";
import PaymentMethodTable from "../academic/examinations/payment-method-table";
import PaymentHistory from "../academic/examinations/payment-history";

const routes = all_routes;

export const publicRoutes = [
  {
    path: routes.examInstance,
    element: <ExamInstance />
  },
  {
    path: routes.branchAcademicYear,
    element: <BranchAcademicYear />
  },
  {
    path: routes.branchClassName,
    element: <BranchClassName />
  },
  {
    path: routes.branchSection,
    element: <BranchSection />
  },
  {
    path: routes.branchOrientation,
    element: <BranchOrientation />
  },
  {
    path: routes.branchState,
    element: <BranchState />
  },
  {
    path: routes.branchZone,
    element: <BranchZone />
  },
  {
    path: routes.branches,
    element: <Branches />
  },
  {
    path: routes.adminDashboard,
    element: <AdminDashboard connections={[]} />
  },
  {
    path:routes.networkConnectionDetails,
    element: <NetworkConnectionDetails />
  },
  {
    path: routes.paymentDues,
    element: <PaymentDues />
  },
  {
    path: routes.tickets,
    element: <Tickets />
  },
  {
    path: routes.providerDetails,
    element: <ProviderDetailsTable />
  },
  {
    path: routes.approvalStatusDetails,
    element: <ApproavlStatusTable />
  },
  {
    path: routes.paymentStatusDetails,
    element: <PaymentStatusTable />
  },
  {
    path: routes.deviceTypeDetails,
    element: <DeviceTypeTable />
  },
  {
    path: routes.sectionDetail,
    element: <SectionDetailTable />
  },
  {
    path: routes.billingCompanyDetails,
    element: <BillingCompanyTable />
  },
  {
    path: routes.adminDetail,
    element: <AdminDetailsTable />
  }, 
  {
    path: routes.enginnerDetail,
    element: <EnginnerDetailTable />
  },
  {
    path: routes.groups,
    element: <Groups />
  },
  {
    path: routes.users,
    element: <Users />
  },
  {
    path: routes.solvedTickets,
    element: <SolvedTickets />
  },
  {
    path:routes.categoriesDetals,
    element: <CategoryDetailTable />
  },
  {
    path:routes.channelDetails,
    element: <ChannelDetailTable />
  },
  {
    path:routes.serviceTypeDetails,
    element: <ServiceTypeDetailsTable />
  },
  {
    path:routes.subCategoryDetailTable,
    element: <SubCategoryDetailTable />
  },
  {
    path:routes.ispCategory,
    element: <IspCategoryTable />,
  },
  {
    path:routes.paymentEntry,
    element: <PaymentEntry />,
  },
  {
    path:routes.paymentMethodDetails,
    element: <PaymentMethodTable/>,
  },
  {
    path:routes.paymentHistory,
    element: <PaymentHistory />
  },
];

export const authRoutes = [
  {
    path: routes.login,
    element: <Login />,
    
  },
];
