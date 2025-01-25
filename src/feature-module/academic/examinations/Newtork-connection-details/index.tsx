import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../core/common/dataTable/index";
import CommonSelect, { Option } from "../../../../core/common/commonSelect";
import { DatePicker, Tooltip } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import Cookies from "js-cookie";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { useUserPermissions } from "../../../UserPermissionsContext";
import { Toast } from "react-bootstrap";

interface ErrorMessages {
  WAN_IP?: string[];
  LAN_IP?: string[];
  message?: string[];
  ISP_user_name?: string[];
  ISP_password?: string[];
  Device_Type?: string[];
  Device_serial_no?: string[];
  BW_capasity?: string[];
  which_section_connection_is_provided?: string[];
  price_PM_ex_GST?: string[];
  GST_per?: string[];
  price_PM_in_GST?: string[];
  total_price?: string[];
  billing_frequency_in_months?: string[];
  billing_company?: string[];
  last_payment_amount?: string[];
  last_payment_date?: string[];
  recharge_from?: string[];
  recharge_to?: string[];
  last_payment_duration?: string[];
  next_payment_due_date?: string[];
  approval_status?: number | null;
  approval_status_name?: string[];
  invoice_submitted_date?: string[];
  payment_status?: string[];
  IT_remarks?: string[];
  has_class_room_wifi?: string[];
  count_class_room_wifi?: string[];
  branch?: string[];
  ISP_provider_contact?: string[];
  Band_width?: string[];
  ISP_provider?: string[];
  category_name?: string[];
  subnet_mask?: string[];
  gateway_IP?: string[];
  DNS1?: string[];
  DNS2?: string[];
  SSL_user_name?: string[];
  SSL_password?: string[];
  reason_for_edit?: string[];
}

type Exam = {
  state: number;
  zone: number;
  branch_connection_id: number;
  state_name: string | null;
  zone_name: string | null;
  branch_name: any;
  ISP_provider: any;
  ISP_provider_name: any;
  connection_status: number | null;
  ISP_user_name: any;
  ISP_password: any;
  WAN_IP: string | null;
  LAN_IP: string | null;
  device_type: number | null;
  device_serial_no: number | null;
  Band_width: string | null;
  section_connection: number | null;
  price_PM_ex_GST: string | null;
  GST_per: number | null;
  price_PM_in_GST: number | null;
  total_price: number | null;
  billing_frequency_in_months: number | null;
  billing_company: number | null;
  last_payment_amount: number | null;
  last_payment_date: string | null;
  recharge_from: string | null;
  recharge_to: string | null;
  last_payment_duration: any;
  next_payment_due_date: string | null;
  approval_status: number | null;
  approval_status_name: string | null;
  invoice_submitted_date: string | null;
  payment_status: number | null;
  IT_remarks: any;
  has_class_room_wifi: boolean;
  count_class_room_wifi: number | null;
  branch: number;
  ISP_provider_contact: number | null;
  payment_status_name: string | null;
  connection_status_name: string | null;
  admin: number | null;
  admin_name: string | null;
  GST_per_value: string | null;
  billing_company_name: string | null;
  device_type_name: string | null;
  section_connection_name: string | null;
  ISP_category: number | null;
  category_name: string | null;
  WANmode: number | null;
  WANmode_name: string | null;
  service_name: string | null;
  subnet_mask: string | null;
  gateway_IP: string | null;
  DNS1: string | null;
  DNS2: string | null;
  VPN_type: number | null;
  VPNtype_name: string | null;
  SSL_user_name: string | null;
  SSL_password: string | null;
  reason_for_edit: string | null;
};

declare global {
  interface Window {
    toggleReadMore: (element: {
      parentElement: { querySelector: (arg0: string) => any };
    }) => void;
  }
}

const NetworkConnectionDetails = () => {
  const routes = all_routes;
  const [networkRecords, setNetworkRecords] = useState<Exam[]>([]);
  const jwtToken = Cookies.get("authToken");
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const defaultValue = dayjs(formattedDate);
  const [newExam, setNewExam] = useState<Exam>({
    state: 0,
    zone: 0,
    branch_connection_id: 9,
    state_name: null,
    zone_name: null,
    branch_name: "",
    ISP_provider: "",
    ISP_provider_name: "",
    connection_status: null,
    ISP_user_name: "",
    ISP_password: "",
    WAN_IP: null,
    LAN_IP: null,
    device_type: null,
    device_serial_no: null,
    Band_width: "",
    section_connection: null,
    price_PM_ex_GST: null,
    GST_per: null,
    price_PM_in_GST: null,
    total_price: null,
    billing_frequency_in_months: null,
    billing_company: null,
    last_payment_amount: null,
    last_payment_date: null,
    recharge_from: null,
    recharge_to: null,
    last_payment_duration: null,
    next_payment_due_date: null,
    approval_status: null,
    approval_status_name: null,
    invoice_submitted_date: null,
    payment_status: null,
    IT_remarks: "",
    has_class_room_wifi: false,
    count_class_room_wifi: null,
    branch: 0,
    ISP_provider_contact: null,
    payment_status_name: null,
    connection_status_name: null,
    admin: null,
    admin_name: null,
    GST_per_value: null,
    billing_company_name: null,
    device_type_name: null,
    section_connection_name: null,
    ISP_category: null,
    category_name: null,
    WANmode: null,
    WANmode_name: null,
    service_name: null,
    subnet_mask: null,
    gateway_IP: null,
    DNS1: null,
    DNS2: null,
    VPN_type: null,
    VPNtype_name: null,
    SSL_user_name: null,
    SSL_password: null,
    reason_for_edit: null,
  });
  const resetForm = () => {
    setNewExam({
      state: 0,
      zone: 0,
      branch_connection_id: 9,
      state_name: null,
      zone_name: null,
      branch_name: "",
      ISP_provider: "",
      ISP_provider_name: "",
      connection_status: null,
      ISP_user_name: "",
      ISP_password: "",
      WAN_IP: null,
      LAN_IP: null,
      device_type: null,
      device_serial_no: null,
      Band_width: "",
      section_connection: null,
      price_PM_ex_GST: null,
      GST_per: null,
      price_PM_in_GST: null,
      total_price: null,
      billing_frequency_in_months: null,
      billing_company: null,
      last_payment_amount: null,
      last_payment_date: null,
      recharge_from: null,
      recharge_to: null,
      last_payment_duration: null,
      next_payment_due_date: null,
      approval_status: null,
      approval_status_name: null,
      invoice_submitted_date: null,
      payment_status: null,
      IT_remarks: "",
      has_class_room_wifi: false,
      count_class_room_wifi: null,
      branch: 0,
      ISP_provider_contact: null,
      payment_status_name: null,
      connection_status_name: null,
      admin: null,
      admin_name: null,
      GST_per_value: "",
      billing_company_name: null,
      device_type_name: null,
      section_connection_name: null,
      ISP_category: null,
      category_name: null,
      WANmode: null,
      WANmode_name: null,
      service_name: null,
      subnet_mask: null,
      gateway_IP: null,
      DNS1: null,
      DNS2: null,
      VPN_type: null,
      VPNtype_name: null,
      SSL_user_name: null,
      SSL_password: null,
      reason_for_edit: null,
    });
    setEditingIndex(null);
    setResetSelect((prev) => !prev);
    setErrorMessage({});
    setSelectedState(null);
    setSelectedZone(null);
  };
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [resetSelect, setResetSelect] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [provider, setProvider] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentRecord, setCurrentRecord] = useState<Exam | null>(null);
  const [approvalStatus, setApprovalStatus] = useState([]);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const { userPermissions, webApi, userProfile } = useUserPermissions();
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>({});
  const [selectedRecord, setSelectedRecord] = useState<Exam>();
  const [connection_status, setConnectionStatus] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [gstData, setGstData] = useState([]);
  const [billingCompanies, setBillingCompanies] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [sectionConnection, setSectionConnection] = useState([]);
  const navigate = useNavigate();
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [from, setFrom] = useState();
  const [to, setTo] = useState<number>();
  const [totalCount, setTotalCount] = useState();
  const [ispCategory, setIspCategory] = useState([]);
  const [wanMode, setWanMode] = useState([]);
  const [vpnType, setVpnType] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number | undefined>(10);
  console.log("Category", ispCategory);
  const checkPermission = (action: any, subject: any) => {
    return userPermissions.some(
      (ability) => ability.action === action && ability.subject === subject
    );
  };
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  const fetchExamsData = async (
    page: number,
    searchQuery: string,
    pageSize: number
  ) => {
    if (!checkPermission("view", "Can view BranchConnectionDetails")) {
      Cookies.remove("authToken");
      navigate("/login");
      return;
    }
    const response = await fetch(
      `${webApi}/provider/branch_connection_details/?page=${page}&page_size=${pageSize}&search=${searchQuery}`,
      options
    );
    return await response.json();
  };

  const fetchProviderData = async () => {
    const response = await fetch(
      `${webApi}/provider/provider_details_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchApprovalData = async () => {
    const response = await fetch(
      `${webApi}/provider/approval_status_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchPaymentStatusData = async () => {
    const response = await fetch(
      `${webApi}/provider/payment_status_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchConnectionStatusData = async () => {
    const response = await fetch(
      `${webApi}/provider/connection_status_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchAdminData = async () => {
    const response = await fetch(
      `${webApi}/provider/admins_dropdown/`,
      options
    );
    return await response.json();
  };
  const fetchISPCategory = async () => {
    const response = await fetch(
      `${webApi}/provider/ISP_catergory_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchGstData = async () => {
    const response = await fetch(
      `${webApi}/provider/gst_percentages_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchBillingCompanies = async () => {
    const response = await fetch(
      `${webApi}/provider/billing_companies_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchDeviceTypes = async () => {
    const response = await fetch(
      `${webApi}/provider/device_types_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchSectionConnections = async () => {
    const response = await fetch(
      `${webApi}/provider/section_connections_dropdown/`,
      options
    );
    return await response.json();
  };
  const fetchWanModeDetails = async () => {
    const response = await fetch(
      `${webApi}/provider/WANmode_dropdown/`,
      options
    );
    return await response.json();
  };
  const fetchVpnType = async () => {
    const response = await fetch(
      `${webApi}/provider/VPNtype_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchData = async (
    _page: number,
    fetchOptions: {
      exams?: boolean;
      provider?: boolean;
      approval?: boolean;
      paymentStatus?: boolean;
      connectionStatus?: boolean;
      admin?: boolean;
      gst?: boolean;
      billingCompanies?: boolean;
      deviceTypes?: boolean;
      sectionConnection?: boolean;
      ispCategory?: boolean;
      wanMode?: boolean;
      vpnType?: boolean;
    }
  ) => {
    setIsLoading(true); // Start loading
    try {
      const promises = [];

      if (fetchOptions.exams) {
        if (pageSize !== undefined)
          promises.push(fetchExamsData(_page, searchQuery, pageSize));
      }
      if (fetchOptions.provider) {
        promises.push(fetchProviderData());
      }
      if (fetchOptions.approval) {
        promises.push(fetchApprovalData());
      }
      if (fetchOptions.paymentStatus) {
        promises.push(fetchPaymentStatusData());
      }
      if (fetchOptions.connectionStatus) {
        promises.push(fetchConnectionStatusData());
      }
      if (fetchOptions.admin) {
        promises.push(fetchAdminData());
      }
      if (fetchOptions.gst) {
        promises.push(fetchGstData());
      }
      if (fetchOptions.billingCompanies) {
        promises.push(fetchBillingCompanies());
      }
      if (fetchOptions.deviceTypes) {
        promises.push(fetchDeviceTypes());
      }
      if (fetchOptions.sectionConnection) {
        promises.push(fetchSectionConnections());
      }
      if (fetchOptions.ispCategory) {
        promises.push(fetchISPCategory());
      }
      if (fetchOptions.wanMode) {
        promises.push(fetchWanModeDetails());
      }
      if (fetchOptions.vpnType) {
        promises.push(fetchVpnType());
      }

      const results = await Promise.all(promises);

      const [
        examsData,
        providerData,
        approvalData,
        paymentStatusData,
        connectionStatusData,
        adminData,
        gstData,
        billingCompaniesData,
        deviceTypes,
        sectionConnectionData,
        ispCategoryData,
        wanModeData,
        vpnTypeData,
      ] = results;

      if (fetchOptions.exams) {
        setTotalPages(examsData.total_pages);
        setNetworkRecords(examsData.results.data);
        setFrom(examsData.from);
        setTo(examsData.to);
        setToastMessage(examsData.message || "submitted successfully!");
        setShowSuccessToast(true);
        setTotalCount(examsData.total_count);
      }
      if (fetchOptions.provider) {
        setProvider(
          providerData.map(
            (item: { name: any; label: any; provider_id: any }) => ({
              value: item.name,
              label: item.label,
              id: item.provider_id,
              idName: "ISP_provider",
              name: "ISP_provider_name",
            })
          )
        );
      }
      if (fetchOptions.approval) {
        setApprovalStatus(
          approvalData.map((item: { name: any; label: any; id: any }) => ({
            value: item.name,
            label: item.label,
            id: item.id,
            idName: "approval_status",
            name: "approval_status_name",
          }))
        );
      }
      if (fetchOptions.paymentStatus) {
        setPaymentStatus(
          paymentStatusData.map((item: { name: any; label: any; id: any }) => ({
            value: item.name,
            label: item.label,
            id: item.id,
            idName: "payment_status",
            name: "payment_status_name",
          }))
        );
      }
      if (fetchOptions.connectionStatus) {
        setConnectionStatus(
          connectionStatusData.map(
            (item: { id: number; status: string; label: string }) => ({
              value: item.status,
              label: item.label,
              id: item.id,
              idName: "connection_status",
              name: "connection_status_name",
            })
          )
        );
      }
      if (fetchOptions.admin) {
        setAdmin(
          adminData.map(
            (item: { id: number; name: string; label: string }) => ({
              value: item.name,
              label: item.label,
              id: item.id,
              idName: "admin",
              name: "admin_name",
            })
          )
        );
      }
      if (fetchOptions.ispCategory) {
        setIspCategory(
          ispCategoryData.map(
            (item: { id: number; Category_name: string }) => ({
              value: item.Category_name,
              label: item.Category_name,
              id: item.id,
              idName: "ISP_category",
              name: "category_name",
            })
          )
        );
      }
      if (fetchOptions.gst) {
        setGstData(
          gstData.map(
            (item: { id: number; GST_value: number; label: number }) => ({
              value: item.GST_value,
              label: item.GST_value,
              id: item.id,
              idName: "GST_per",
              name: "GST_per_name",
            })
          )
        );
      }
      if (fetchOptions.billingCompanies) {
        setBillingCompanies(
          billingCompaniesData.map(
            (item: { id: number; company: string; label: string }) => ({
              value: item.company,
              label: item.label,
              id: item.id,
              idName: "billing_company",
              name: "billing_company_name",
            })
          )
        );
      }
      if (fetchOptions.deviceTypes) {
        setDeviceTypes(
          deviceTypes.map(
            (item: { id: number; type: string; label: string }) => ({
              value: item.type,
              label: item.label,
              id: item.id,
              idName: "device_type",
              name: "device_type_name",
            })
          )
        );
      }
      if (fetchOptions.sectionConnection) {
        setSectionConnection(
          sectionConnectionData.map(
            (item: { id: number; section: string; label: string }) => ({
              value: item.section,
              label: item.label,
              id: item.id,
              idName: "section_connection",
              name: "section_connection_name",
            })
          )
        );
      }
      if (fetchOptions.wanMode) {
        setWanMode(
          wanModeData.map(
            (item: { WANmode_id: number; WANmode_name: string }) => ({
              value: item.WANmode_name,
              label: item.WANmode_name,
              id: item.WANmode_id,
              idName: "WANmode",
              name: "WANmode_name",
            })
          )
        );
      }
      if (fetchOptions.vpnType) {
        setVpnType(
          vpnTypeData.map(
            (item: { VPNtype_id: number; VPNtype_name: string }) => ({
              value: item.VPNtype_name,
              label: item.VPNtype_name,
              id: item.VPNtype_id,
              idName: "VPN_type",
              name: "VPNtype_name",
            })
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  const Loader = () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  useEffect(() => {
    fetchData(currentPage, {
      exams: true,
      provider: true,
      approval: true,
      paymentStatus: true,
      connectionStatus: true,
      admin: true,
      gst: true,
      billingCompanies: true,
      deviceTypes: true,
      sectionConnection: true,
      ispCategory: true,
      wanMode: true,
      vpnType: true,
    });
  }, [currentPage]);

  // useEffect(() => {
  //   fetchData(currentPage,{exams:true});
  // },[currentPage,searchQuery])

  // const fetchStates = async () => {
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${jwtToken}`,
  //     },
  //   };
  //   const response = await fetch(`${webApi}/branches/branches_state_dropdown/`, options);
  //   const stateData = await response.json();
  //   setState(stateData.results.map((item: { name: any; label: any; state_id: any; }) => ({ value: item.name, label: item.label, id: item.state_id, idName: 'state', name: 'state_name', })));
  // };

  // const fetchZones = async (stateId: number) => {
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${jwtToken}`,
  //     },
  //   };
  //   const response = await fetch(`${webApi}/branches/branches_zone_dropdown/${stateId}/`, options);
  //   const zonesData = await response.json();
  //   setZone(zonesData.results.map((item: { name: any; label: any; zone_id: any; }) => ({ value: item.name, label: item.label, id: item.zone_id, idName: 'zone', name: 'zone_name', })));
  // };

  // const fetchBranches = async (stateId: number, zoneId: number) => {
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${jwtToken}`,
  //     },
  //   };
  //   const response = await fetch(`${webApi}/branches/branches_branches_dropdown/${stateId}/${zoneId}/`, options);
  //   const branchesData = await response.json();
  //   setBranches(branchesData.results.map((item: { name: any; branch_id: any; }) => ({ value: item.name, label: item.name, id: item.branch_id, idName: 'branch', name: 'branch_name', })));
  // };

  // useEffect(() => {
  //   fetchStates();
  // }, []);

  // useEffect(() => {
  //   if (selectedState !== null) {
  //     fetchZones(selectedState);
  //     setSelectedZone(null);
  //     setBranches([]);
  //   }
  // }, [selectedState]);

  // useEffect(() => {
  //   if (selectedState !== null && selectedZone !== null) {
  //     fetchBranches(selectedState, selectedZone);
  //   } else {
  //     setBranches([]);
  //   }
  // }, [selectedZone]);

  const fetchBranches = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      // Fetch all branches
      const response = await fetch(
        `${webApi}/branches/branch_dropdown/`,
        options
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const branchesData = await response.json();

      // Filter branches based on userProfile branch IDs if they exist
      const filteredBranches =
        userProfile.branches && userProfile.branches.length > 0
          ? branchesData.results.filter((item: { branch_id: number }) =>
              userProfile.branches.includes(item.branch_id)
            )
          : branchesData.results;

      setBranches(
        filteredBranches.map((item: { name: any; branch_id: any }) => ({
          value: item.name,
          label: item.name,
          id: item.branch_id,
          idName: "branch",
          name: "branch_name",
        }))
      );
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const viewPreviousTickets = (record: Exam) => {
    const { branch, section_connection, ISP_provider } = record;
    let apiUrl = `${webApi}/tickets/tickets_in_branch_connections/${branch}/${ISP_provider}/${section_connection}/`;

    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const modalContent = data.results
          .map(
            (ticket: {
              ticket_number: any;
              category_name: any;
              subcategory_name: any;
              Short_description: any;
              description: any;
              resolution_notes: any;
              updated_at: any;
            }) => {
              return `<tr> 
                    <td>${ticket.ticket_number}</td> 
                    <td>${ticket.category_name}</td> 
                    <td>${ticket.subcategory_name}</td> 
                    <td>${truncateText(ticket.Short_description, 20)}</td> 
                    <td>${truncateText(ticket.description, 30)}</td> 
                    <td>${truncateText(ticket.resolution_notes, 30)}</td>
                    <td>${ticket.updated_at}</td>
                </tr>`;
            }
          )
          .join("");

        const tableBody = document.getElementById("previousTicketsTableBody");
        if (tableBody) {
          tableBody.innerHTML = modalContent;
          $("#view_PreviousTickets").modal("show");
        }
      })
      .catch((error) => {
        console.error("Error fetching previous tickets:", error);
      });
  };
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    const truncated = text.substring(0, maxLength);
    const remainingText = text
      .substring(maxLength)
      .replace(/(.{30})/g, "$1<br>");
    return `${truncated}<span class="read-more" style="color: blue;" onclick="window.toggleReadMore(this)">... Read More</span><span class="read-less" style="display:none; color: blue;" onclick="window.toggleReadMore(this)">${remainingText} Read Less</span>`;
  };

  window.toggleReadMore = (element: {
    parentElement: { querySelector: (arg0: string) => any };
  }) => {
    const readMore = element.parentElement.querySelector(".read-more");
    const readLess = element.parentElement.querySelector(".read-less");
    if (readMore.style.display === "none") {
      readMore.style.display = "inline";
      readLess.style.display = "none";
    } else {
      readMore.style.display = "none";
      readLess.style.display = "inline";
    }
  };

  const updateData = async () => {
    const updatedExams =
      editingIndex !== null
        ? networkRecords.map((exam, index) =>
            index === editingIndex ? { ...newExam } : exam
          )
        : [...networkRecords, { ...newExam }];
    const requestOptions = {
      method: editingIndex !== null ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newExam),
    };
    const url =
      editingIndex !== null
        ? `${webApi}/provider/branch_connection_details/${newExam.branch_connection_id}/`
        : `${webApi}/provider/branch_connection_details/`;
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const errData = await response.json();
      setErrorMessage(errData);
      if (errData.state) {
        setToastMessage("State field may not be null.");
        setShowErrorToast(true);
      } else if (errData.zone) {
        setToastMessage("Zone field may not be null.");
        setShowErrorToast(true);
      } else if (errData.branch) {
        setToastMessage("Branch field may not be null.");
        setShowErrorToast(true);
      } else if (errData.ISP_provider) {
        setToastMessage("ISP provider field may not be null.");
        setShowErrorToast(true);
      }
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setNetworkRecords(updatedExams);
    await fetchData(currentPage, { exams: true });
  };

  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  const exportBranchConnectionDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${webApi}/provider/export_branch_connection_details/`,
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "branch_connection_details.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateData();
      resetForm();
      const submitBtn = document.getElementById("submit-btn");
      if (submitBtn) {
        submitBtn.setAttribute("data-bs-dismiss", "modal");
        submitBtn.click();
      }
      const submitBtn1 = document.getElementById("submit-btn1");
      if (submitBtn1) {
        submitBtn1.setAttribute("data-bs-dismiss", "modal");
        submitBtn1.click();
      }
    } catch (error: unknown) {}
  };

  const checkConnectionStatus = async () => {
    setLoading(true);
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch(
        `${webApi}/provider/check_conncetion_status/`,
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      await fetchData(currentPage, { exams: true });
    } catch (error) {
      console.error("Error checking connection status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentRecord) {
      setNewExam({
        state_name: currentRecord.state_name,
        zone_name: currentRecord.zone_name,
        branch_name: currentRecord.branch_name,
        ISP_provider: currentRecord.ISP_provider,
        ISP_provider_name: currentRecord.ISP_provider_name,
        connection_status: currentRecord.connection_status,
        ISP_user_name: currentRecord.ISP_user_name,
        ISP_password: currentRecord.ISP_password,
        WAN_IP: currentRecord.WAN_IP,
        LAN_IP: currentRecord.LAN_IP,
        device_type: currentRecord.device_type,
        device_serial_no: currentRecord.device_serial_no,
        Band_width: currentRecord.Band_width,
        section_connection: currentRecord.section_connection,
        price_PM_ex_GST: currentRecord.price_PM_ex_GST,
        GST_per: currentRecord.GST_per,
        price_PM_in_GST: currentRecord.price_PM_in_GST,
        total_price: currentRecord.total_price,
        billing_frequency_in_months: currentRecord.billing_frequency_in_months,
        billing_company: currentRecord.billing_company,
        last_payment_amount: currentRecord.last_payment_amount,
        last_payment_date: currentRecord.last_payment_date,
        recharge_from: currentRecord.recharge_from,
        recharge_to: currentRecord.recharge_to,
        last_payment_duration: currentRecord.last_payment_duration,
        next_payment_due_date: currentRecord.next_payment_due_date,
        approval_status: currentRecord.approval_status,
        invoice_submitted_date: currentRecord.invoice_submitted_date,
        payment_status: currentRecord.payment_status,
        IT_remarks: currentRecord.IT_remarks,
        has_class_room_wifi: currentRecord.has_class_room_wifi,
        count_class_room_wifi: currentRecord.count_class_room_wifi,
        branch_connection_id: currentRecord.branch_connection_id,
        branch: currentRecord.branch,
        ISP_provider_contact: currentRecord.ISP_provider_contact,
        approval_status_name: currentRecord.approval_status_name,
        state: currentRecord.state,
        zone: currentRecord.zone,
        payment_status_name: currentRecord.payment_status_name,
        connection_status_name: currentRecord.connection_status_name,
        admin: currentRecord.admin,
        admin_name: currentRecord.admin_name,
        GST_per_value: currentRecord.GST_per_value,
        billing_company_name: currentRecord.billing_company_name,
        device_type_name: currentRecord.device_type_name,
        section_connection_name: currentRecord.section_connection_name,
        ISP_category: currentRecord.ISP_category,
        category_name: currentRecord.category_name,
        WANmode: currentRecord.WANmode,
        WANmode_name: currentRecord.WANmode_name,
        service_name: currentRecord.service_name,
        subnet_mask: currentRecord.subnet_mask,
        gateway_IP: currentRecord.gateway_IP,
        DNS1: currentRecord.DNS1,
        DNS2: currentRecord.DNS2,
        VPN_type: currentRecord.VPN_type,
        VPNtype_name: currentRecord.VPNtype_name,
        SSL_user_name: currentRecord.SSL_user_name,
        SSL_password: currentRecord.SSL_password,
        reason_for_edit: currentRecord.reason_for_edit,
      });
      setEditingIndex(currentRecord.branch_connection_id);
      setSelectedState(currentRecord.state);
      setSelectedZone(currentRecord.zone);
    }
  }, [currentRecord]);

  const editExam = async (record: Exam) => {
    try {
      const response = await fetch(
        `${webApi}/provider/branch_connection_details/${record.branch_connection_id}/`,
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCurrentRecord(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const viewExam = (record: Exam) => {
    setSelectedRecord(record);
  };

  const checkPing = async (record: Exam) => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      const url = `${webApi}/provider/check_conncetion_status/${record.branch_connection_id}/`;
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to check connection status"
        );
      }

      const data = await response.json();
      await fetchData(currentPage, { exams: true });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { price_PM_in_GST, billing_frequency_in_months } = newExam;

    if (price_PM_in_GST && billing_frequency_in_months) {
      const price = parseFloat(price_PM_in_GST.toString());
      const frequency = parseInt(billing_frequency_in_months.toString(), 10);
      const total = price * frequency;
      setNewExam((prev) => ({ ...prev, total_price: total }));
    }
  }, [newExam.price_PM_in_GST, newExam.billing_frequency_in_months]);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setNewExam({ ...newExam, [name]: value || null });

  //   if (name === "GST_per_name") {
  //     const priceExGST = parseFloat(newExam.price_PM_ex_GST || "0");
  //     const gstRate = parseFloat(newExam.GST_per_value || "0");

  //     const priceInGST = gstRate
  //       ? priceExGST * (1 + gstRate / 100)
  //       : priceExGST;
  //     setNewExam((prev) => ({ ...prev, price_PM_in_GST: priceInGST }));
  //   }
  // };

  // const handleSelectChange = (
  //   option: Option | null,
  //   idName: string,
  //   name: string
  // ) => {
  //   setNewExam((prev) => {
  //     // Ensure newGST is a number
  //     const newGST = option && option.value ? parseFloat(option.value) : 0; // Default to 0 if option is null or value is undefined
  //     const priceExGST = parseFloat(prev.price_PM_ex_GST || "0");

  //     // Calculate price_PM_in_GST
  //     const priceInGST = newGST ? priceExGST * (1 + newGST / 100) : priceExGST;
  //     const hasWANModeChanged =
  //       idName === "WANmode" &&
  //       prev.WANmode_name !== (option ? option.value : "");

  //     return {
  //       ...prev,
  //       [idName]: option ? option.id : "",
  //       [name]: option ? option.value : "",
  //       price_PM_in_GST: priceInGST,
  //       ...(hasWANModeChanged
  //         ? {
  //             ISP_user_name: "",
  //             ISP_password: "",
  //             service_name: "",
  //             WAN_IP: null,
  //             subnet_mask: null,
  //             gateway_IP: null,
  //             DNS1: null,
  //             DNS2: null,
  //           }
  //         : {}),
  //     };
  //   });
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExam((prev) => {
      const updatedExam = {
        ...prev,
        [name]: value || null,
        reason_for_edit: null,
      };

      if (name === "price_PM_ex_GST" || name === "GST_per_value") {
        const priceExGST = parseFloat(updatedExam.price_PM_ex_GST || "0");
        const gstRate = parseFloat(updatedExam.GST_per_value || "0");

        const priceInGST = gstRate
          ? priceExGST * (1 + gstRate / 100)
          : priceExGST;
        updatedExam.price_PM_in_GST = priceInGST;
      }

      return updatedExam;
    });
  };

  const handleSelectChange = (
    option: Option | null,
    idName: string,
    name: string
  ) => {
    setNewExam((prev) => {
      const updatedExam = {
        ...prev,
        [idName]: option ? option.id : "",
        [name]: option ? option.value : "",
        reason_for_edit: null,
      };

      if (idName === "GST_per") {
        const priceExGST = parseFloat(updatedExam.price_PM_ex_GST || "0");
        const gstRate = option && option.value ? parseFloat(option.value) : 0;

        const priceInGST = gstRate
          ? priceExGST * (1 + gstRate / 100)
          : priceExGST;
        updatedExam.price_PM_in_GST = priceInGST;
      }

      if (
        idName === "WANmode" &&
        prev.WANmode_name !== (option ? option.value : "")
      ) {
        updatedExam.ISP_user_name = "";
        updatedExam.ISP_password = "";
        updatedExam.service_name = "";
        updatedExam.WAN_IP = null;
        updatedExam.subnet_mask = null;
        updatedExam.gateway_IP = null;
        updatedExam.DNS1 = null;
        updatedExam.DNS2 = null;
      }

      return updatedExam;
    });
  };
  useEffect(() => {
    if (searchQuery !== undefined) {
      fetchData(currentPage, { exams: true });
    }
  }, [searchQuery, pageSize]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSearchQuery(""); // Update state immediately if input is cleared
    } else {
      handleSearch(value);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPageSize(newPageSize);
  };

  const fetchStateZone = async (branchId: number) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await fetch(
        `${webApi}/branches/get_state_zone/${branchId}/`,
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const stateZoneData = await response.json();
      // Update the state and zone information in your state
      setNewExam((prev) => ({
        ...prev,
        state: stateZoneData.results.state,
        state_name: stateZoneData.results.state_name,
        zone: stateZoneData.results.zone,
        zone_name: stateZoneData.results.zone_name,
      }));
    } catch (error) {
      console.error("Error fetching state and zone:", error);
    }
  };

  const handleBranchChange = async (option: Option | null) => {
    const branchId = option && option.id !== undefined ? option.id : 0; // Default to 0 if branchId is null
    setNewExam((prev) => ({
      ...prev,
      branch: branchId,
      branch_name: option ? option.label : "",
    }));
    if (branchId !== 0) {
      await fetchStateZone(branchId);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (showErrorToast || showSuccessToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false);
        setShowSuccessToast(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast, showSuccessToast]);

  const handleDateChange = (date: dayjs.Dayjs | null, field: string) => {
    setNewExam((prev) => ({
      ...prev,
      [field]: date ? date.format("YYYY-MM-DD") : null,
    }));
  };

  const getModalContainer = () => {
    const modalElement = document.getElementById("modal-datepicker");
    return modalElement ? modalElement : document.body;
  };

  const canChangeBranchConnectionDetails = checkPermission(
    "change",
    "Can change BranchConnectionDetails"
  );
  const canAddBranchConnectionDetails = checkPermission(
    "add",
    "Can add BranchConnectionDetails"
  );
  const exportPermisson = checkPermission(
    "export",
    "CanExportBranchConnectionDetails"
  );

  const fetchData1 = () => {
    setLoading(true); // Set loading to true before fetching data

    // Close the dropdown menu immediately
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (dropdownMenu) {
      dropdownMenu.classList.remove("show");
    }

    const apiUrl = `${webApi}/provider/branch_connection_details/?branch=${newExam.branch}&state=${newExam.state}&zone=${newExam.zone}&ISP_provider=&connection_status=&device_type=&billing_frequency_in_months=&billing_company=&approval_status=&payment_status=&engineer=&admin=`;

    fetch(apiUrl, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setNetworkRecords(data.results.data);
        // Handle the data received from the API
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetching data
      });
  };

  const viewEditHistory = async (branchConnectionId: any) => {
    try {
      // Clear previous data

      const apiUrl = `${webApi}/provider/branch_connection_details_log_detail/${branchConnectionId}/`;
      const response = await fetch(apiUrl, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Network response was not ok");
      }

      // Generate modal content
      const modalContent = data.results
        .map((record: { [key: string]: any }) => {
          let recordContent = `<div style="border: 1px solid #007bff; border-radius: 10px; padding: 15px; margin-bottom: 15px;">`;

          // if (record.branch_name) {
          //   recordContent += `
          //   <div style="margin-bottom: 10px;">
          //     <strong style="color: #007bff;">Branch Name:</strong>
          //     <span style="margin-left: 10px;">${record.branch_name}</span>
          //   </div>`;
          // }
          if (record.ISP_provider_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">ISP Provider Name:</strong>
              <span style="margin-left: 10px;">${record.ISP_provider_name}</span>
            </div>`;
          }
          if (record.category_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Category Name:</strong>
              <span style="margin-left: 10px;">${record.category_name}</span>
            </div>`;
          }
          if (record.WANmode_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">WAN Mode Name:</strong>
              <span style="margin-left: 10px;">${record.WANmode_name}</span>
            </div>`;
          }
          if (record.ISP_user_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">ISP User Name:</strong>
              <span style="margin-left: 10px;">${record.ISP_user_name}</span>
            </div>`;
          }
          if (record.ISP_password) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">ISP Password:</strong>
              <span style="margin-left: 10px;">${record.ISP_password}</span>
            </div>`;
          }
          if (record.service_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Service Name:</strong>
              <span style="margin-left: 10px;">${record.service_name}</span>
            </div>`;
          }
          if (record.WAN_IP) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">WAN IP:</strong>
              <span style="margin-left: 10px;">${record.WAN_IP}</span>
            </div>`;
          }
          if (record.subnet_mask) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Subnet Mask:</strong>
              <span style="margin-left: 10px;">${record.subnet_mask}</span>
            </div>`;
          }
          if (record.gateway_IP) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Gateway IP:</strong>
              <span style="margin-left: 10px;">${record.gateway_IP}</span>
            </div>`;
          }
          if (record.DNS1) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">DNS1:</strong>
              <span style="margin-left: 10px;">${record.DNS1}</span>
            </div>`;
          }
          if (record.DNS2) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">DNS2:</strong>
              <span style="margin-left: 10px;">${record.DNS2}</span>
            </div>`;
          }
          if (record.LAN_IP) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">LAN IP:</strong>
              <span style="margin-left: 10px;">${record.LAN_IP}</span>
            </div>`;
          }
          if (record.device_type_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Device Type Name:</strong>
              <span style="margin-left: 10px;">${record.device_type_name}</span>
            </div>`;
          }
          if (record.device_serial_no) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Device Serial No:</strong>
              <span style="margin-left: 10px;">${record.device_serial_no}</span>
            </div>`;
          }
          if (record.Band_width) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Bandwidth:</strong>
              <span style="margin-left: 10px;">${record.Band_width}</span>
            </div>`;
          }
          if (record.section_connection_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Section Connection Name:</strong>
              <span style="margin-left: 10px;">${record.section_connection_name}</span>
            </div>`;
          }
          if (record.VPNtype_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">VPN Type Name:</strong>
              <span style="margin-left: 10px;">${record.VPNtype_name}</span>
            </div>`;
          }
          if (record.SSL_user_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">SSL User Name:</strong>
              <span style="margin-left: 10px;">${record.SSL_user_name}</span>
            </div>`;
          }
          if (record.SSL_password) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">SSL Password:</strong>
              <span style="margin-left: 10px;">${record.SSL_password}</span>
            </div>`;
          }
          if (record.price_PM_ex_GST) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Price PM Ex GST:</strong>
              <span style="margin-left: 10px;">${record.price_PM_ex_GST}</span>
            </div>`;
          }
          if (record.GST_per_value) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">GST Per Value:</strong>
              <span style="margin-left: 10px;">${record.GST_per_value}</span>
            </div>`;
          }
          if (record.price_PM_in_GST) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Price PM In GST:</strong>
              <span style="margin-left: 10px;">${record.price_PM_in_GST}</span>
            </div>`;
          }
          if (record.billing_company_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Billing Company Name:</strong>
              <span style="margin-left: 10px;">${record.billing_company_name}</span>
            </div>`;
          }
          if (record.billing_frequency_in_months) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Billing Frequency in Months:</strong>
              <span style="margin-left: 10px;">${record.billing_frequency_in_months}</span>
            </div>`;
          }
          if (record.total_price) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Total:</strong>
              <span style="margin-left: 10px;">${record.total_price}</span>
            </div>`;
          }
          if (record.billing_company_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Trust / Company to which Billing is Done:</strong>
              <span style="margin-left: 10px;">${record.billing_company_name}</span>
            </div>`;
          }
          if (record.recharge_from) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">From:</strong>
              <span style="margin-left: 10px;">${record.recharge_from}</span>
            </div>`;
          }
          if (record.recharge_to) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">To:</strong>
              <span style="margin-left: 10px;">${record.recharge_to}</span>
            </div>`;
          }
          if (record.last_payment_duration) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Last Payment Duration:</strong>
              <span style="margin-left: 10px;">${record.last_payment_duration}</span>
            </div>`;
          }
          if (record.next_payment_due_date) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Next Payment Due Date:</strong>
              <span style="margin-left: 10px;">${record.next_payment_due_date}</span>
            </div>`;
          }
          if (record.approval_status_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Approval Status:</strong>
              <span style="margin-left: 10px;">${record.approval_status_name}</span>
            </div>`;
          }
          if (record.invoice_submitted_date) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Invoice Submit Date:</strong>
              <span style="margin-left: 10px;">${record.invoice_submitted_date}</span>
            </div>`;
          }
          if (record.payment_status_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Payment Status / Remarks:</strong>
              <span style="margin-left: 10px;">${record.payment_status_name}</span>
            </div>`;
          }
          if (record.IT_remarks) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">IT Remarks:</strong>
              <span style="margin-left: 10px;">${record.IT_remarks}</span>
            </div>`;
          }
          if (record.invoice_number) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Invoice Number:</strong>
              <span style="margin-left: 10px;">${record.invoice_number}</span>
            </div>`;
          }
          if (record.invoice_date) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Invoice Date:</strong>
              <span style="margin-left: 10px;">${record.invoice_date}</span>
            </div>`;
          }
          if (record.changed_by_name) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Changed By:</strong>
              <span style="margin-left: 10px;">${record.changed_by_name}</span>
            </div>`;
          }
          if (record.reason_for_edit) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Remarks :</strong>
              <span style="margin-left: 10px;">${record.reason_for_edit}</span>
            </div>`;
          }
          if (record.change_date) {
            recordContent += `
            <div style="margin-bottom: 10px;">
              <strong style="color: #007bff;">Change Date:</strong>
              <span style="margin-left: 10px;">${record.change_date}</span>
            </div>`;
          }

          recordContent += `</div>`;
          return recordContent;
        })
        .join("");
      const tableBody = document.getElementById("paymentDuesContent");
      if (tableBody) {
        tableBody.innerHTML = modalContent;
        $("#viewPaymentDuesHistory").modal("show"); // Show the modal using Bootstrap's modal method
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      render: (_text: string, record: Exam) => (
        <div className="d-flex align-items-center">
          <span title="View">
            <button
              className="btn btn-icon btn-sm btn-soft-primary rounded-pill me-2"
              onClick={() => viewExam(record)}
              data-bs-toggle="modal"
              data-bs-target="#view_Connection"
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            >
              <i className="feather-eye" />
            </button>
          </span>
          {canChangeBranchConnectionDetails && (
            <span title="Edit">
              <button
                className="btn btn-icon btn-sm btn-soft-info rounded-pill me-2"
                onClick={() => editExam(record)}
                data-bs-toggle="modal"
                data-bs-target="#edit_Connection"
                style={{
                  backgroundColor: "#17a2b8",
                  color: "#fff",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              >
                <i className="feather-edit" />
              </button>
            </span>
          )}
          <span title="Check Ping">
            <button
              className="btn btn-icon btn-sm btn-soft-info rounded-pill me-2"
              onClick={() => checkPing(record)}
              style={{
                backgroundColor: "#17a2b8",
                color: "#fff",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            >
              <i className="feather-wifi" />
            </button>
          </span>
          <span title="View Previous Tickets">
            <button
              className="btn btn-icon btn-sm btn-soft-info rounded-pill"
              onClick={() => viewPreviousTickets(record)}
              data-bs-toggle="modal"
              data-bs-target="#view_PreviousTickets"
              style={{
                backgroundColor: "#17a2b8",
                color: "#fff",
                borderRadius: "50%",
              }}
            >
              <i className="feather-list" />
            </button>
          </span>
        </div>
      ),
    },
    {
      title: "State",
      dataIndex: "state_name",
      sorter: (a: Exam, b: Exam) => a.branch_name.localeCompare(b.branch_name),
    },
    {
      title: "Zone",
      dataIndex: "zone_name",
      sorter: (a: Exam, b: Exam) => a.branch_name.localeCompare(b.branch_name),
    },
    {
      title: "Branch Name",
      dataIndex: "branch_name",
      // render: (
      //   text:
      //     | string
      //     | number
      //     | boolean
      //     | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      //     | Iterable<React.ReactNode>
      //     | React.ReactPortal
      //     | null
      //     | undefined,
      //   record: { branch_connection_id: any }
      // ) => (
      //   // <a
      //   //   href="#"
      //   //   onClick={() => viewEditHistory(record.branch_connection_id)}
      //   //   data-bs-toggle="modal"
      //   //   data-bs-target="#viewPaymentDuesHistory"
      //   //   style={{ color: "#007bff", textDecoration: "underline" }}
      //   // >
      //   //   {text}
      //   // </a>
      // ),
      // sorter: (a: Exam, b: Exam) => a.branch_name.localeCompare(b.branch_name),
    },
    // {
    //   title: "Network Administrator",
    //   dataIndex: "admin_name",
    // },

    {
      title: "ISP Name",
      dataIndex: "ISP_provider_name",
      sorter: (a: Exam, b: Exam) =>
        a.ISP_provider_name.localeCompare(b.ISP_provider_name),
    },

    {
      title: "ISP Service Type",
      dataIndex: "category_name",
      sorter: (a: Exam, b: Exam) =>
        a.ISP_provider_name.localeCompare(b.ISP_provider_name),
    },
    {
      title: "WAN Connection Status",
      dataIndex: "ping_status_wan",
      render: (
        text:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined,
        record: {
          ping_status_wan: boolean;
        }
      ) => (
        <span
          className={`badge ${
            record.ping_status_wan ? "bg-soft-success" : "bg-soft-danger"
          }`}
        >
          {record.ping_status_wan ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "LAN Connection Status",
      dataIndex: "ping_status_lan",
      render: (
        text:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined,
        record: {
          ping_status_lan: boolean;
        }
      ) => (
        <span
          className={`badge ${
            record.ping_status_lan ? "bg-soft-success" : "bg-soft-danger"
          }`}
        >
          {record.ping_status_lan ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "WAN Mode ",
      dataIndex: "WANmode_name",
    },

    {
      title: "Username",
      dataIndex: "ISP_user_name",
    },
    {
      title: "Password",
      dataIndex: "ISP_password",
    },
    {
      title: "Service Name",
      dataIndex: "service_name",
    },
    // {
    //   title: "Static IP",
    //   dataIndex: "WAN_IP",
    // },
    {
      title: "WAN IP",
      dataIndex: "WAN_IP",
    },
    {
      title: "Subnet Mask",
      dataIndex: "subnet_mask",
    },
    {
      title: "Gateway IP",
      dataIndex: "gateway_IP",
    },
    {
      title: "DNS1",
      dataIndex: "DNS1",
    },
    {
      title: "DNS2",
      dataIndex: "DNS2",
    },
    {
      title: "LAN IP",
      dataIndex: "LAN_IP",
    },
    {
      title: "Gateway Device Type",
      dataIndex: "device_type_name",
    },
    {
      title: "Serial Number",
      dataIndex: "device_serial_no",
    },
    {
      title: "Bandwidth",
      dataIndex: "Band_width",
    },
    {
      title: "Device Location",
      dataIndex: "section_connection_name",
    },
    {
      title: "VPN Type",
      dataIndex: "VPNtype_name",
    },
    {
      title: "SSL Username",
      dataIndex: "SSL_user_name",
    },
    {
      title: "SSL Password",
      dataIndex: "SSL_password",
    },
    {
      title: "Price PM Ex.GST",
      dataIndex: "price_PM_ex_GST",
    },
    {
      title: "GST",
      dataIndex: "GST_per_value",
    },
    {
      title: "Price PM Inc.GST",
      dataIndex: "price_PM_in_GST",
    },
    {
      title: "Trust / company to which billing is done",
      dataIndex: "billing_company_name",
    },
  ];

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
        minHeight: "100vh",
        overflowY: "auto",
        overflowX: "auto",
      }}
    >
      <div className="page-wrapper">
        <div
         
          style={{

            minHeight: "99%",
            margin: "5px",
            marginLeft:"31px",
            marginRight:"25px",
            marginTop: "35px",
            position: "relative",
            maxWidth: "99%",
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Network Connections</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Branch Connection Details
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="mb-2 p-1">
                <button
                  className="btn btn-primary"
                  onClick={checkConnectionStatus}
                  type="button"
                >
                  <i className="ti ti-wifi me-2" />
                  Ping Check
                </button>
              </div>
              <div className="mb-2 p-1">
                {canAddBranchConnectionDetails && (
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    onClick={resetForm}
                    data-bs-target="#add_Connection"
                    type="button"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" /> Add
                    Branch Connection{" "}
                  </button>
                )}
              </div>
              <div className="mb-2 p-1">
                {exportPermisson && (
                  <button
                    className="btn btn-primary"
                    onClick={exportBranchConnectionDetails}
                    type="submit"
                  >
                    <i className="ti ti-export me-2" />
                    Export
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Guardians List */}
          <style>
  {`
    .styled-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      max-width: 100%;
    }
    .styled-card .card-body {
      padding: 20px;
    }
    .styled-card .ant-table {
      border-radius: 8px;
      overflow: hidden;
    }
    .styled-card .ant-table-thead > tr > th {
      background-color: #f5f5f5;
      font-weight: bold;
    }
    .styled-card .ant-table-tbody > tr > td {
      padding: 12px;
    }
    .styled-card .ant-table-pagination {
      margin: 16px 0;
    }
    .search-input {
      margin: 10px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 500px; /* Adjust width */
    }
    .clear-button {
      background: none;
      border: none;
      position: absolute;
      right: 10px;
      cursor: pointer;
      font-size: 16px;
      color: #aaa;
    }
    .pagination-controls {
      display: flex;
      align-items: center;
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .pagination-select {
      margin-left: 5px;
      padding: 4px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .input-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Media Queries for Responsive Design */
    @media (max-width: 768px) {
      .search-input {
        width: 100%; /* Full width on smaller screens */
      }
    }
  `}
</style>


          <div className="styled-card">
            <div className="card-body p-0 py-3">
              <div className="input-container">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  {searchQuery && (
                    <button className="clear-button">
                      {" "}
                      &#x2716; {/* Close icon */}{" "}
                    </button>
                  )}
                </div>
                <div className="pagination-controls">
                  {" "}
                  <label htmlFor="pageSize">Page size:</label>{" "}
                  <select
                    id="pageSize"
                    className="pagination-select"
                    onChange={handlePageSizeChange}
                  >
                    {" "}
                    <option value="10">10</option>{" "}
                    <option value="20">20</option>{" "}
                    <option value="50">50</option>{" "}
                    <option value="100">100</option>{" "}
                  </select>{" "}
                </div>
              </div>
              {/* Guardians List */}
              {isLoading ? (
                <Loader />
              ) : (
                <div
                  style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    maxHeight: "70vh",
                  }}
                >
                  <Table
                    columns={columns}
                    dataSource={networkRecords}
                    Selection={true}
                    handleNextPage={handleNextPage}
                    handlePreviousPage={handlePreviousPage}
                    currentpage={currentPage}
                    from={from}
                    to={to}
                    totalCount={totalCount}
                  />
                </div>
              )}

              {/* /Guardians List */}
            </div>
            <style>
              {`
            .loader-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(255, 255, 255, 0.8);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
            }
            .loader {
              border: 16px solid #f3f3f3;
              border-radius: 50%;
              border-top: 16px solid #3498db;
              width: 120px;
              height: 120px;
              animation: spin 2s linear infinite;
              position: relative;
            }
            .loader-icon {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 24px;
              color: #3498db;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
            </style>
            {loading && (
              <div className="loader-overlay">
                <div className="loader">
                  <i className="loader-icon ti ti-reload"></i>
                </div>
              </div>
            )}
          </div>
          {/* /Guardians List */}
        </div>
      </div>
      <>
        <Toast
          show={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          className="colored-toast bg-success text-fixed-white"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            zIndex: 1050,
          }}
        >
          <Toast.Body> {toastMessage} </Toast.Body>
        </Toast>
        {/* /Add Connection */}
        <style>
          {`
          .custom-modal-size {
            max-width: 1800px;
            width: auto;
          }
          .light-violet-bg {
            background-color: #f8f9f9;
          }
          .modal-body {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            max-height: 80vh; 
            overflow-y: auto;
          }
          .dual-list-box-container {
            grid-column: span 2;
            width: 100%
          }
        `}
        </style>
        <div
          className="modal fade"
          id="add_Connection"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Connection</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={resetForm}
                  id="submit-btn"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              >
                <div className="modal-body light-violet-bg">
                  <div className="mb-3">
                    <label className="form-label">Branch Name</label>
                    <CommonSelect
                      className="select"
                      options={branches}
                      onChange={(option) => {
                        handleSelectChange(option, "branch", "branch_name");
                        handleBranchChange(option);
                      }}
                      reset={resetSelect}
                      defaultValue={
                        branches.find(
                          (option: { value: string }) =>
                            option.value === newExam.branch_name
                        ) || undefined
                      } // Handle null case
                      required={true}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newExam.state_name || ""}
                      disabled={true} // Initially disabled
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Zone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newExam.zone_name || ""}
                      disabled={true} // Initially disabled
                      readOnly
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label className="form-label">Admin Name</label>
                    <CommonSelect
                      className="select"
                      options={admin}
                      onChange={(option) =>
                        handleSelectChange(option, "admin", "admin_name")
                      }
                      reset={resetSelect}
                    />
                  </div> */}
                  <div className="mb-3">
                    <label className="form-label">ISP Name</label>
                    <CommonSelect
                      className="select"
                      options={provider}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "ISP_provider",
                          "ISP_provider_name"
                        )
                      }
                      reset={resetSelect}
                      required={true}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Service Type</label>
                    <CommonSelect
                      className="select"
                      options={ispCategory}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "ISP_category",
                          "category_name"
                        )
                      }
                      reset={resetSelect}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">WAN Mode</label>
                    <CommonSelect
                      className="select"
                      options={wanMode}
                      onChange={(option) =>
                        handleSelectChange(option, "WANmode", "WANmode_name")
                      }
                      reset={resetSelect}
                    />
                  </div>
                  {newExam.WANmode_name === "PPPOE" ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.ISP_user_name ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="ISP_user_name"
                          placeholder="Username"
                          value={newExam.ISP_user_name}
                          required={true}
                        />
                        {errorMessage.ISP_user_name && (
                          <div className="invalid-feedback">
                            {errorMessage.ISP_user_name[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.ISP_password ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="ISP_password"
                          placeholder="Password"
                          value={newExam.ISP_password}
                          required={true}
                        />
                        {errorMessage.ISP_password && (
                          <div className="invalid-feedback">
                            {errorMessage.ISP_password[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Service Name</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.ISP_password ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="service_name"
                          placeholder="Service Name"
                          value={newExam.service_name || ""}
                        />
                        {errorMessage.ISP_password && (
                          <div className="invalid-feedback">
                            {errorMessage.ISP_password[0]}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Static IP</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.WAN_IP ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="WAN_IP"
                          placeholder="Static IP"
                          value={newExam.WAN_IP || ""}
                        />
                        {errorMessage.WAN_IP && (
                          <div className="invalid-feedback">
                            {errorMessage.WAN_IP[0]}
                          </div>
                        )}
                      </div>
                    </>
                  ) : null}
                  {newExam.WANmode_name === "Static" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">WAN IP</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.WAN_IP ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="WAN_IP"
                          placeholder="WAN IP"
                          value={newExam.WAN_IP || ""}
                          required={true}
                        />
                        {errorMessage.WAN_IP && (
                          <div className="invalid-feedback">
                            {errorMessage.WAN_IP[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Subnet Mask</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.subnet_mask ? "is-invalid" : ""
                          }`} // Use the correct error message
                          onChange={handleInputChange}
                          name="subnet_mask"
                          placeholder="Subnet Mask"
                          value={newExam.subnet_mask || ""}
                          required={true}
                        />
                        {errorMessage.subnet_mask && (
                          <div className="invalid-feedback">
                            {errorMessage.subnet_mask[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Gateway IP</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.gateway_IP ? "is-invalid" : ""
                          }`} // Use the correct error message
                          onChange={handleInputChange}
                          name="gateway_IP"
                          placeholder="Gateway IP"
                          value={newExam.gateway_IP || ""}
                          required={true}
                        />
                        {errorMessage.gateway_IP && (
                          <div className="invalid-feedback">
                            {errorMessage.gateway_IP[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">DNS1</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.DNS1 ? "is-invalid" : ""
                          }`} // Use the correct error message
                          onChange={handleInputChange}
                          name="DNS1"
                          placeholder="DNS1"
                          value={newExam.DNS1 || ""}
                          required={true}
                        />
                        {errorMessage.DNS1 && (
                          <div className="invalid-feedback">
                            {errorMessage.DNS1[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">DNS2</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.DNS2 ? "is-invalid" : ""
                          }`} // Use the correct error message
                          onChange={handleInputChange}
                          name="DNS2"
                          placeholder="DNS2"
                          value={newExam.DNS2 || ""}
                        />
                        {errorMessage.DNS2 && (
                          <div className="invalid-feedback">
                            {errorMessage.DNS2[0]}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="mb-3">
                    <label className="form-label">LAN IP</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.LAN_IP ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="LAN_IP"
                      placeholder="LAN IP"
                      value={newExam.LAN_IP || ""}
                    />
                    {errorMessage.LAN_IP && (
                      <div className="invalid-feedback">
                        {errorMessage.LAN_IP[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gateway Device Type</label>
                    <CommonSelect
                      className="select"
                      options={deviceTypes}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "device_type",
                          "device_type_name"
                        )
                      }
                      reset={resetSelect}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Serial Number</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.Device_serial_no ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="device_serial_no"
                      placeholder="Serial Number"
                      value={newExam.device_serial_no || ""}
                    />
                    {errorMessage.Device_serial_no && (
                      <div className="invalid-feedback">
                        {errorMessage.Device_serial_no[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bandwidth</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.BW_capasity ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="Band_width"
                      placeholder="Bandwidth"
                      value={newExam.Band_width || ""}
                    />
                    {errorMessage.Band_width && (
                      <div className="invalid-feedback">
                        {errorMessage.Band_width[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Device Location</label>
                    <CommonSelect
                      className="select"
                      options={sectionConnection}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "section_connection",
                          "section_connection_name"
                        )
                      }
                      reset={resetSelect}
                      required={true} // Add this line to make the field required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">VPN Type</label>
                    <CommonSelect
                      className="select"
                      options={vpnType}
                      onChange={(option) =>
                        handleSelectChange(option, "VPN_type", "VPNtype_name")
                      }
                      reset={resetSelect}
                    />
                  </div>
                  {newExam.VPNtype_name === "SSL" && ( // Check if the selected VPN type is "SSL"
                    <>
                      <div className="mb-3">
                        <label className="form-label">SSL Username</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.SSL_user_name ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="SSL_user_name"
                          placeholder="SSL Username"
                          value={newExam.SSL_user_name || ""}
                        />
                        {errorMessage.SSL_user_name && (
                          <div className="invalid-feedback">
                            {errorMessage.SSL_user_name[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">SSL Password</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.SSL_password ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="SSL_password"
                          placeholder="SSL Password"
                          value={newExam.SSL_password || ""}
                        />
                        {errorMessage.SSL_password && (
                          <div className="invalid-feedback">
                            {errorMessage.SSL_password[0]}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Price PM Ex.GST</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.price_PM_ex_GST ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="price_PM_ex_GST"
                      placeholder="Price PM Ex.GST"
                      value={newExam.price_PM_ex_GST || ""}
                    />
                    {errorMessage.price_PM_in_GST && (
                      <div className="invalid-feedback">
                        {errorMessage.price_PM_ex_GST &&
                          errorMessage.price_PM_ex_GST[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">GST</label>
                    <CommonSelect
                      className="select"
                      options={gstData}
                      onChange={(option) =>
                        handleSelectChange(option, "GST_per", "GST_per_name")
                      }
                      reset={resetSelect}
                      defaultValue={gstData.find(
                        (option: { value: string }) =>
                          option.value === newExam.GST_per_value
                      )}
                    />
                  </div>{" "}
                  <div className="mb-3">
                    <label className="form-label">Price PM Inc.GST</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.price_PM_in_GST ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="price_PM_in_GST"
                      placeholder="Price PM Inc.GST"
                      value={newExam.price_PM_in_GST || ""}
                    />
                    {errorMessage.price_PM_in_GST && (
                      <div className="invalid-feedback">
                        {errorMessage.price_PM_in_GST[0]}
                      </div>
                    )}
                  </div>
                  {/* <div className="mb-3">
                    <label className="form-label">
                      Billing frequency in Months
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.billing_frequency_in_months
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={handleInputChange}
                      name="billing_frequency_in_months"
                      placeholder="Billing frequency in Months"
                      value={newExam.billing_frequency_in_months || ""}
                    />
                    {errorMessage.billing_frequency_in_months && (
                      <div className="invalid-feedback">
                        {errorMessage.billing_frequency_in_months[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.total_price ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="total_price"
                      placeholder="Total"
                      value={newExam.total_price || ""}
                    />
                    {errorMessage.total_price && (
                      <div className="invalid-feedback">
                        {errorMessage.total_price[0]}
                      </div>
                    )}
                  </div> */}
                  <div className="mb-3">
                    <label className="form-label">Billing Company</label>
                    <CommonSelect
                      className="select"
                      options={billingCompanies}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "billing_company",
                          "billing_company_name"
                        )
                      }
                      reset={resetSelect}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Save
                  </button>
                  <Toast
                    show={showErrorToast}
                    onClose={() => setShowErrorToast(false)}
                    className="colored-toast bg-danger text-fixed-white"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    style={{
                      position: "fixed",
                      top: "1rem",
                      right: "1rem",
                      zIndex: 1050,
                    }}
                  >
                    <Toast.Body> {toastMessage} </Toast.Body>
                  </Toast>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Coonection */}
        {/* Edit Connection */}
        <style>
          {`
          .custom-modal-size {
            max-width: 1800px;
            width: auto;
          }
          .light-violet-bg {
            background-color: #f8f9f9;
          }
          .modal-body {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            max-height: 80vh; 
            overflow-y: auto;
          }
          .dual-list-box-container {
            grid-column: span 2;
            width: 100%
          }
        `}
        </style>
        <div className="modal fade" id="edit_Connection">
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Connection</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={resetForm}
                  id="submit-btn1"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
              >
                <div className="modal-body light-violet-bg">
                  <div className="mb-3">
                    <label className="form-label">Branch Name</label>
                    <CommonSelect
                      className="select"
                      options={branches}
                      onChange={(option) => {
                        handleSelectChange(option, "branch", "branch_name");
                        handleBranchChange(option);
                      }}
                      reset={resetSelect}
                      defaultValue={
                        branches.find(
                          (option: { value: string }) =>
                            option.value === newExam.branch_name
                        ) || undefined
                      } // Handle null case
                      required={true}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newExam.state_name || ""}
                      disabled={true} // Initially disabled
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Zone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newExam.zone_name || ""}
                      disabled={true} // Initially disabled
                      readOnly
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label className="form-label">Admin Name</label>
                    <CommonSelect
                      className="select"
                      options={admin}
                      onChange={(option) =>
                        handleSelectChange(option, "admin", "admin_name")
                      }
                      reset={resetSelect}
                    />
                  </div> */}
                  <div className="mb-3">
                    <label className="form-label">ISP Name</label>
                    <CommonSelect
                      className="select"
                      options={provider}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "ISP_provider",
                          "ISP_provider_name"
                        )
                      }
                      reset={resetSelect}
                      required={true}
                      defaultValue={provider.find(
                        (option: { value: string }) =>
                          option.value === newExam.ISP_provider_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Service Type</label>
                    <CommonSelect
                      className="select"
                      options={ispCategory}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "ISP_category",
                          "category_name"
                        )
                      }
                      reset={resetSelect}
                      defaultValue={ispCategory.find(
                        (option: { value: string }) =>
                          option.value === newExam.category_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">WAN Mode</label>
                    <CommonSelect
                      className="select"
                      options={wanMode}
                      onChange={(option) =>
                        handleSelectChange(option, "WANmode", "WANmode_name")
                      }
                      reset={resetSelect}
                      defaultValue={wanMode.find(
                        (option: { value: string }) =>
                          option.value === newExam.WANmode_name
                      )}
                    />
                  </div>
                  {newExam.WANmode_name === "PPPOE" ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.ISP_user_name ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="ISP_user_name"
                          placeholder="Username"
                          value={newExam.ISP_user_name}
                        />
                        {errorMessage.ISP_user_name && (
                          <div className="invalid-feedback">
                            {errorMessage.ISP_user_name[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.ISP_password ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="ISP_password"
                          placeholder="Password"
                          value={newExam.ISP_password}
                        />
                        {errorMessage.ISP_password && (
                          <div className="invalid-feedback">
                            {errorMessage.ISP_password[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Service Name</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.ISP_password ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="service_name"
                          placeholder="Service Name"
                          value={newExam.service_name || ""}
                        />
                        {errorMessage.ISP_password && (
                          <div className="invalid-feedback">
                            {errorMessage.ISP_password[0]}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Static IP</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.WAN_IP ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="WAN_IP"
                          placeholder="WAN IP"
                          value={newExam.WAN_IP || ""}
                        />
                        {errorMessage.WAN_IP && (
                          <div className="invalid-feedback">
                            {errorMessage.WAN_IP[0]}
                          </div>
                        )}
                      </div>
                    </>
                  ) : null}
                  {newExam.WANmode_name === "Static" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">WAN IP</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.WAN_IP ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="WAN_IP"
                          placeholder="WAN IP"
                          value={newExam.WAN_IP || ""}
                        />
                        {errorMessage.WAN_IP && (
                          <div className="invalid-feedback">
                            {errorMessage.WAN_IP[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Subnet Mask</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.subnet_mask ? "is-invalid" : ""
                          }`} // Use the correct error message
                          onChange={handleInputChange}
                          name="subnet_mask"
                          placeholder="Subnet Mask"
                          value={newExam.subnet_mask || ""}
                        />
                        {errorMessage.subnet_mask && (
                          <div className="invalid-feedback">
                            {errorMessage.subnet_mask[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Gateway IP</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.gateway_IP ? "is-invalid" : ""
                          }`} // Use the correct error message
                          onChange={handleInputChange}
                          name="gateway_IP"
                          placeholder="Gateway IP"
                          value={newExam.gateway_IP || ""}
                        />
                        {errorMessage.gateway_IP && (
                          <div className="invalid-feedback">
                            {errorMessage.gateway_IP[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">DNS1</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.DNS1 ? "is-invalid" : ""
                          }`} // Use the correct error message
                          onChange={handleInputChange}
                          name="DNS1"
                          placeholder="DNS1"
                          value={newExam.DNS1 || ""}
                        />
                        {errorMessage.DNS1 && (
                          <div className="invalid-feedback">
                            {errorMessage.DNS1[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">DNS2</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.DNS2 ? "is-invalid" : ""
                          }`} // Use the correct error message
                          onChange={handleInputChange}
                          name="DNS2"
                          placeholder="DNS2"
                          value={newExam.DNS2 || ""}
                        />
                        {errorMessage.DNS2 && (
                          <div className="invalid-feedback">
                            {errorMessage.DNS2[0]}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="mb-3">
                    <label className="form-label">LAN IP</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.LAN_IP ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="LAN_IP"
                      placeholder="LAN IP"
                      value={newExam.LAN_IP || ""}
                    />
                    {errorMessage.LAN_IP && (
                      <div className="invalid-feedback">
                        {errorMessage.LAN_IP[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gateway Device Type</label>
                    <CommonSelect
                      className="select"
                      options={deviceTypes}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "device_type",
                          "device_type_name"
                        )
                      }
                      reset={resetSelect}
                      defaultValue={deviceTypes.find(
                        (option: { value: string }) =>
                          option.value === newExam.device_type_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Serial Number</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.Device_serial_no ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="device_serial_no"
                      placeholder="Serial Number"
                      value={newExam.device_serial_no || ""}
                    />
                    {errorMessage.Device_serial_no && (
                      <div className="invalid-feedback">
                        {errorMessage.Device_serial_no[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bandwidth</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.BW_capasity ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="Band_width"
                      placeholder="Bandwidth"
                      value={newExam.Band_width || ""}
                    />
                    {errorMessage.Band_width && (
                      <div className="invalid-feedback">
                        {errorMessage.Band_width[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Device Location</label>
                    <CommonSelect
                      className="select"
                      options={sectionConnection}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "section_connection",
                          "section_connection_name"
                        )
                      }
                      reset={resetSelect}
                      required={true} // Add this line to make the field required
                      defaultValue={sectionConnection.find(
                        (option: { value: string }) =>
                          option.value === newExam.section_connection_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">VPN Type</label>
                    <CommonSelect
                      className="select"
                      options={vpnType}
                      onChange={(option) =>
                        handleSelectChange(option, "VPN_type", "VPNtype_name")
                      }
                      reset={resetSelect}
                      defaultValue={vpnType.find(
                        (option: { value: string }) =>
                          option.value === newExam.VPNtype_name
                      )}
                    />
                  </div>
                  {newExam.VPNtype_name === "SSL" && ( // Check if the selected VPN type is "SSL"
                    <>
                      <div className="mb-3">
                        <label className="form-label">SSL Username</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.SSL_user_name ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="SSL_user_name"
                          placeholder="SSL Username"
                          value={newExam.SSL_user_name || ""}
                        />
                        {errorMessage.SSL_user_name && (
                          <div className="invalid-feedback">
                            {errorMessage.SSL_user_name[0]}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">SSL Password</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.SSL_password ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="SSL_password"
                          placeholder="SSL Password"
                          value={newExam.SSL_password || ""}
                        />
                        {errorMessage.SSL_password && (
                          <div className="invalid-feedback">
                            {errorMessage.SSL_password[0]}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Price PM Ex.GST</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.price_PM_ex_GST ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="price_PM_ex_GST"
                      placeholder="Price PM Ex.GST"
                      value={newExam.price_PM_ex_GST || ""}
                    />
                    {errorMessage.price_PM_in_GST && (
                      <div className="invalid-feedback">
                        {errorMessage.price_PM_ex_GST &&
                          errorMessage.price_PM_ex_GST[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">GST</label>
                    <CommonSelect
                      className="select"
                      options={gstData}
                      onChange={(option) =>
                        handleSelectChange(option, "GST_per", "GST_per_name")
                      }
                      reset={resetSelect}
                      defaultValue={gstData.find(
                        (option: { value: string }) =>
                          option.value === newExam.GST_per_value
                      )}
                    />
                  </div>{" "}
                  <div className="mb-3">
                    <label className="form-label">Price PM Inc.GST</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.price_PM_in_GST ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="price_PM_in_GST"
                      placeholder="Price PM Inc.GST"
                      value={newExam.price_PM_in_GST || ""}
                    />
                    {errorMessage.price_PM_in_GST && (
                      <div className="invalid-feedback">
                        {errorMessage.price_PM_in_GST[0]}
                      </div>
                    )}
                  </div>
                  {/* <div className="mb-3">
                    <label className="form-label">
                      Billing frequency in Months
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.billing_frequency_in_months
                          ? "is-invalid"
                          : ""
                      }`}
                      onChange={handleInputChange}
                      name="billing_frequency_in_months"
                      placeholder="Billing frequency in Months"
                      value={newExam.billing_frequency_in_months || ""}
                    />
                    {errorMessage.billing_frequency_in_months && (
                      <div className="invalid-feedback">
                        {errorMessage.billing_frequency_in_months[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.total_price ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="total_price"
                      placeholder="Total"
                      value={newExam.total_price || ""}
                    />
                    {errorMessage.total_price && (
                      <div className="invalid-feedback">
                        {errorMessage.total_price[0]}
                      </div>
                    )}
                  </div> */}
                  <div className="mb-3">
                    <label className="form-label">Billing Company</label>
                    <CommonSelect
                      className="select"
                      options={billingCompanies}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "billing_company",
                          "billing_company_name"
                        )
                      }
                      reset={resetSelect}
                      defaultValue={billingCompanies.find(
                        (option: { value: string }) =>
                          option.value === newExam.billing_company_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Remarks</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.reason_for_edit ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="reason_for_edit"
                      placeholder="Remarks"
                      value={newExam.reason_for_edit || ""}
                      required
                    />
                    {errorMessage.reason_for_edit && (
                      <div className="invalid-feedback">
                        {errorMessage.reason_for_edit[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Save
                  </button>
                  <Toast
                    show={showErrorToast}
                    onClose={() => setShowErrorToast(false)}
                    className="colored-toast bg-danger text-fixed-white"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    style={{
                      position: "fixed",
                      top: "1rem",
                      right: "1rem",
                      zIndex: 1050,
                    }}
                  >
                    <Toast.Body> {toastMessage} </Toast.Body>
                  </Toast>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Exam */}
        <div className="modal fade" id="view_Connection">
          <div
            className="modal-dialog"
            style={{ maxWidth: "550px", width: "90%" }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                className="modal-header"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <h4 className="modal-title">View Connection</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="submit-btn1"
                  style={{ color: "#fff" }}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div
                className="modal-body"
                style={{ backgroundColor: "#f8f9fa", padding: "20px" }}
              >
                {selectedRecord ? (
                  <div className="connection-details">
                    <table className="table">
                      <tbody>
                        {selectedRecord.state_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                State:
                              </strong>
                            </td>
                            <td>{selectedRecord.state_name}</td>
                          </tr>
                        )}
                        {selectedRecord.zone_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Zone:
                              </strong>
                            </td>
                            <td>{selectedRecord.zone_name}</td>
                          </tr>
                        )}
                        {selectedRecord.branch_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Branch:
                              </strong>
                            </td>
                            <td>{selectedRecord.branch_name}</td>
                          </tr>
                        )}
                        {selectedRecord.ISP_provider_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                ISP Name:
                              </strong>
                            </td>
                            <td>{selectedRecord.ISP_provider_name}</td>
                          </tr>
                        )}
                        {selectedRecord.category_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                ISP Service Type:
                              </strong>
                            </td>
                            <td>{selectedRecord.category_name}</td>
                          </tr>
                        )}
                        {selectedRecord.WANmode_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                WAN Mode:
                              </strong>
                            </td>
                            <td>{selectedRecord.WANmode_name}</td>
                          </tr>
                        )}
                        {selectedRecord.ISP_user_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Username:
                              </strong>
                            </td>
                            <td>{selectedRecord.ISP_user_name}</td>
                          </tr>
                        )}
                        {selectedRecord.ISP_password && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Password:
                              </strong>
                            </td>
                            <td>{selectedRecord.ISP_password}</td>
                          </tr>
                        )}
                        {selectedRecord.service_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Service Name:
                              </strong>
                            </td>
                            <td>{selectedRecord.service_name}</td>
                          </tr>
                        )}
                        {selectedRecord.WAN_IP && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                WAN IP:
                              </strong>
                            </td>
                            <td>{selectedRecord.WAN_IP}</td>
                          </tr>
                        )}
                        {selectedRecord.subnet_mask && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Subnet Mask:
                              </strong>
                            </td>
                            <td>{selectedRecord.subnet_mask}</td>
                          </tr>
                        )}
                        {selectedRecord.gateway_IP && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Gateway IP:
                              </strong>
                            </td>
                            <td>{selectedRecord.gateway_IP}</td>
                          </tr>
                        )}
                        {selectedRecord.DNS1 && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                DNS1:
                              </strong>
                            </td>
                            <td>{selectedRecord.DNS1}</td>
                          </tr>
                        )}
                        {selectedRecord.DNS2 && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                DNS2:
                              </strong>
                            </td>
                            <td>{selectedRecord.DNS2}</td>
                          </tr>
                        )}
                        {selectedRecord.connection_status_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Connection Status:
                              </strong>
                            </td>
                            <td>{selectedRecord.connection_status_name}</td>
                          </tr>
                        )}
                        {selectedRecord.LAN_IP && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                LAN IP:
                              </strong>
                            </td>
                            <td>{selectedRecord.LAN_IP}</td>
                          </tr>
                        )}
                        {selectedRecord.device_type_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Gateway Device Type:
                              </strong>
                            </td>
                            <td>{selectedRecord.device_type_name}</td>
                          </tr>
                        )}
                        {selectedRecord.device_serial_no && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Serial Number:
                              </strong>
                            </td>
                            <td>{selectedRecord.device_serial_no}</td>
                          </tr>
                        )}
                        {selectedRecord.Band_width && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Bandwidth:
                              </strong>
                            </td>
                            <td>{selectedRecord.Band_width}</td>
                          </tr>
                        )}
                        {selectedRecord.section_connection_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Device Location:
                              </strong>
                            </td>
                            <td>{selectedRecord.section_connection_name}</td>
                          </tr>
                        )}
                        {selectedRecord.VPNtype_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                VPN Type:
                              </strong>
                            </td>
                            <td>{selectedRecord.VPNtype_name}</td>
                          </tr>
                        )}
                        {selectedRecord.SSL_user_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                SSL Username:
                              </strong>
                            </td>
                            <td>{selectedRecord.SSL_user_name}</td>
                          </tr>
                        )}
                        {selectedRecord.SSL_password && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                SSL Password:
                              </strong>
                            </td>
                            <td>{selectedRecord.SSL_password}</td>
                          </tr>
                        )}
                        {selectedRecord.price_PM_ex_GST && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Price PM Exc. GST:
                              </strong>
                            </td>
                            <td>{selectedRecord.price_PM_ex_GST}</td>
                          </tr>
                        )}
                        {selectedRecord.GST_per_value && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>GST:</strong>
                            </td>
                            <td>{selectedRecord.GST_per_value}</td>
                          </tr>
                        )}
                        {selectedRecord.price_PM_in_GST && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Price PM Inc. GST:
                              </strong>
                            </td>
                            <td>{selectedRecord.price_PM_in_GST}</td>
                          </tr>
                        )}
                        {selectedRecord.billing_frequency_in_months && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Billing Frequency:
                              </strong>
                            </td>
                            <td>
                              {selectedRecord.billing_frequency_in_months}{" "}
                              months
                            </td>
                          </tr>
                        )}
                        {selectedRecord.total_price && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Total:
                              </strong>
                            </td>
                            <td>{selectedRecord.total_price}</td>
                          </tr>
                        )}
                        {selectedRecord.billing_company_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Trust/Company:
                              </strong>
                            </td>
                            <td>{selectedRecord.billing_company_name}</td>
                          </tr>
                        )}
                        {selectedRecord.last_payment_amount && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Last Payment Amount:
                              </strong>
                            </td>
                            <td>{selectedRecord.last_payment_amount}</td>
                          </tr>
                        )}
                        {selectedRecord.last_payment_date && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Last Payment Date:
                              </strong>
                            </td>
                            <td>{selectedRecord.last_payment_date}</td>
                          </tr>
                        )}
                        {selectedRecord.recharge_from && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                From:
                              </strong>
                            </td>
                            <td>{selectedRecord.recharge_from}</td>
                          </tr>
                        )}
                        {selectedRecord.recharge_to && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>To:</strong>
                            </td>
                            <td>{selectedRecord.recharge_to}</td>
                          </tr>
                        )}
                        {selectedRecord.last_payment_duration && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Last Payment Duration:
                              </strong>
                            </td>
                            <td>{selectedRecord.last_payment_duration}</td>
                          </tr>
                        )}
                        {selectedRecord.next_payment_due_date && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Next Payment Due Date:
                              </strong>
                            </td>
                            <td>{selectedRecord.next_payment_due_date}</td>
                          </tr>
                        )}
                        {selectedRecord.approval_status_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Approval Status:
                              </strong>
                            </td>
                            <td>{selectedRecord.approval_status_name}</td>
                          </tr>
                        )}
                        {selectedRecord.invoice_submitted_date && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Invoice Submit Date:
                              </strong>
                            </td>
                            <td>{selectedRecord.invoice_submitted_date}</td>
                          </tr>
                        )}
                        {selectedRecord.payment_status_name && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Payment Status/Remarks:
                              </strong>
                            </td>
                            <td>{selectedRecord.payment_status_name}</td>
                          </tr>
                        )}
                        {selectedRecord.IT_remarks && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                IT Remarks:
                              </strong>
                            </td>
                            <td>{selectedRecord.IT_remarks}</td>
                          </tr>
                        )}
                        {selectedRecord.ISP_provider_contact && (
                          <tr>
                            <td>
                              <strong style={{ color: "#007bff" }}>
                                Provider Contact:
                              </strong>
                            </td>
                            <td>{selectedRecord.ISP_provider_contact}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: "#dc3545", textAlign: "center" }}>
                    No record selected.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="view_PreviousTickets">
          <div
            className="modal-dialog"
            style={{ maxWidth: "1150px", width: "90%" }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                className="modal-header"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <h4 className="modal-title">Previous Tickets</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ color: "#fff" }}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div
                className="modal-body"
                style={{ backgroundColor: "#f8f9fa", padding: "20px" }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ticket Number</th>
                      <th>Category</th>
                      <th>Subcategory</th>
                      <th>Short Description</th>
                      <th>Description</th>
                      <th>Resolution Note</th>
                      <th>Updated At</th>
                    </tr>
                  </thead>
                  <tbody id="previousTicketsTableBody">
                    {/* Ticket details will be inserted here */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="viewPaymentDuesHistory"
          aria-labelledby="viewPaymentDuesHistoryLabel"
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: "550px", width: "90%" }}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                className="modal-header"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <h4 className="modal-title" id="viewPaymentDuesHistoryLabel">
                  Edit History
                </h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="submit-btn1"
                  style={{ color: "#fff" }}
                >
                  <i className="ti ti-x"></i>
                </button>
              </div>
              <div
                className="modal-body"
                style={{ backgroundColor: "#f8f9fa", padding: "20px" }}
              >
                <div id="paymentDuesContent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>
                    You want to delete all the marked items, this cant be undone
                    once you delete.
                  </p>
                  <div className="d-flex justify-content-center">
                    <Link
                      to="#"
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-danger"
                    >
                      Yes, Delete
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </>
    </div>
  );
};
export default NetworkConnectionDetails;
