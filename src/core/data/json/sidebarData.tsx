import { all_routes } from "../../../feature-module/router/all_routes";
import { useUserPermissions } from "../../../feature-module/UserPermissionsContext";

const routes = all_routes;

const checkPermission = (userPermissions: any[], action: string, subject: string) => {
  return userPermissions.some(ability => ability.action === action && ability.subject === subject);
};

export const SidebarData = () => {
  const { userPermissions } = useUserPermissions();

  const networkSubmenuItems = [
    checkPermission(userPermissions, "view", "Can view BranchConnectionDetails") && { label: "BranchConnectionDetails", link: routes.networkConnectionDetails, icon: "ti ti-link" },
    checkPermission(userPermissions, "view", "Can view BranchConnectionDetails") && { label: "Payment Entry", link: routes.paymentEntry, icon: "ti ti-link" },
    checkPermission(userPermissions, "view", "Can view BranchConnectionDetails") && { label: "Payment Dues", link: routes.paymentDues, icon: "ti ti-credit-card" },
    checkPermission(userPermissions, "view", "Can view BranchConnectionDetails") && { label: "Payment History", link: routes.paymentHistory, icon: "ti ti-credit-card" },
    checkPermission(userPermissions, "view", "Can view ticket") && { label: "Tickets", link: routes.tickets, icon: "ti ti-ticket" },
    checkPermission(userPermissions, "view", "Can view ticket") && {  label: "SolvedTicktes", link: routes.solvedTickets, icon: "ti ti-dashboard" }
  ].filter(Boolean); // Filter out any false values

  
  const usermanagementSubmenuItems = [
    checkPermission(userPermissions, "view", "Can view group") && {
      label: "Groups",
      icon: "ti ti-user", // Updated icon for groups
      link: routes.groups,
      submenu: false,
      showSubRoute: false,
    },    
    checkPermission(userPermissions, "view", "Can view user") && {
      label: "Users",
      icon: "ti ti-id-badge", // Try using this icon
      link: routes.users,
      submenu: false,
      showSubRoute: false,
    },              
  ].filter(Boolean);


  const masterSubmenuItems = [
    checkPermission(userPermissions, "view", "Can view provider") && {
      label: "ISP Name",
      icon: "ti ti-building",
      link: routes.providerDetails,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view isp category") && {
      label: "ISP Service Type",
      icon: "ti ti-tools",
      link: routes.ispCategory,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view device type") && {
      label: "Gateway Device Type",
      icon: "ti ti-book",
      link: routes.deviceTypeDetails,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view section connection") && {
      label: "Device Location",
      icon: "ti ti-clipboard",
      link: routes.sectionDetail,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view billing company") && {
      label: "Billing Company",
      icon: "ti ti-receipt",
      link: routes.billingCompanyDetails,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view ApprovalStatus") && {
      label: "Approval Status",
      icon: "ti ti-check",
      link: routes.approvalStatusDetails,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view provider") && {
      label: "Payment Status",
      icon: "ti ti-wallet",
      link: routes.paymentStatusDetails,
      submenu: false,
      showSubRoute: false,
    },
    // checkPermission(userPermissions, "view", "Can view admin") && {
    //   label: "Network Administrator",
    //   icon: "ti ti-user",
    //   link: routes.adminDetail,
    //   submenu: false,
    //   showSubRoute: false,
    // },

    checkPermission(userPermissions, "view", "Can view engineer") && {
      label: "Enginner",
      icon: "ti ti-tools",
      link: routes.enginnerDetail,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view category") && {
      label: "Category",
      icon: "ti ti-category",
      link: routes.categoriesDetals,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view channel") && {
      label: "Channels",
      icon: "ti ti-broadcast",
      link: routes.channelDetails,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view service type") && {
      label: "Service Type",
      icon: "ti ti-settings",
      link: routes.serviceTypeDetails,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view sub category") && {
      label: "Sub Category",
      icon: "ti ti-layers",
      link: routes.subCategoryDetailTable,
      submenu: false,
      showSubRoute: false,
    },
    checkPermission(userPermissions, "view", "Can view sub category") && {
      label: "Payment Method",
      icon: "ti ti-layers",
      link: routes.paymentMethodDetails,
      submenu: false,
      showSubRoute: false,
    },
  ].filter(Boolean); // Filter out any false values

  return [
    {
      label: "Main",
      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "Main",
      submenuItems: [
        { label: "Dashboard", link: routes.adminDashboard, icon: "ti ti-dashboard" },
      ],
    },
    usermanagementSubmenuItems.length > 0 && {
      label: "User Management",
      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "User Management",
      submenuItems: usermanagementSubmenuItems
    },
    networkSubmenuItems.length > 0 && {
      label: "Network",
      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "Network",
      submenuItems: networkSubmenuItems,
    },
    masterSubmenuItems.length > 0 && {
      label: "Master",
      submenuOpen: false,
      showSubRoute: false,
      submenuHdr: "Network",
      submenuItems: masterSubmenuItems,
    },
  ].filter(Boolean); // Filter out any false values
};
