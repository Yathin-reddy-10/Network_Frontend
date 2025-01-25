import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../core/common/dataTable/index";
import CommonSelect, { Option } from "../../../../core/common/commonSelect";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import Cookies from "js-cookie";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { useUserPermissions } from "../../../UserPermissionsContext";

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
  UTR_details?: string[];
  payment_amount?: string[];
  payment_date?: string[];
}

type Exam = {
  branch_connection_id: number;
  state: number;
  zone: number;
  state_name: any;
  zone_name: any;
  branch_name: any;
  ISP_provider: any;
  ISP_provider_name: any;
  GST_per: number | null;
  price_PM_in_GST: number | null;
  total_price: number | null;
  billing_frequency_in_months: number | null;
  billing_company: number | null;
  recharge_from: string | null;
  recharge_to: string | null;
  last_payment_duration: any;
  next_payment_due_date: string | null;
  approval_status: number | null;
  approval_status_name: string | null;
  invoice_submitted_date: string | null;
  payment_status: any;
  IT_remarks: string | null;
  has_class_room_wifi: boolean;
  count_class_room_wifi: string | null;
  branch: number;
  color: string;
  admin: number | null;
  admin_name: string | null;
  GST_per_value: string | null;
  billing_company_name: string | null;
  payment_status_name: string | null;
  price_PM_ex_GST: string | null;
  section_connection_name: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  UTR_details: string | null;
  payment_amount: number | null;
  payment_date: string | null;
  payment_method: number | null;
  payment_method_name: string | null;
};
const PaymentEntry = () => {
  const routes = all_routes;
  const [exams, setExams] = useState<Exam[]>([]);
  const jwtToken = Cookies.get("authToken");
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const defaultValue = dayjs(formattedDate);
  const [isLoading, setIsLoading] = useState(false);
  const [newExam, setNewExam] = useState<Exam>({
    branch_connection_id: 9,
    state_name: "",
    zone_name: "",
    branch_name: "",
    ISP_provider: "",
    ISP_provider_name: "",
    GST_per: null,
    price_PM_in_GST: null,
    total_price: null,
    billing_frequency_in_months: null,
    billing_company: null,
    recharge_from: null,
    recharge_to: null,
    last_payment_duration: null,
    next_payment_due_date: null,
    approval_status_name: null,
    invoice_submitted_date: null,
    payment_status: "",
    IT_remarks: null,
    has_class_room_wifi: true,
    count_class_room_wifi: null,
    branch: 0,
    color: "",
    zone: 0,
    state: 0,
    admin: null,
    admin_name: null,
    approval_status: null,
    GST_per_value: null,
    billing_company_name: null,
    payment_status_name: null,
    price_PM_ex_GST: null,
    section_connection_name: null,
    invoice_number: null,
    invoice_date: null,
    UTR_details: null,
    payment_amount: null,
    payment_date: null,
    payment_method: null,
    payment_method_name: null,
  });
  const resetForm = () => {
    setNewExam({
      branch_connection_id: 9,
      state_name: "",
      zone_name: "",
      branch_name: "",
      ISP_provider: "",
      ISP_provider_name: "",
      GST_per: null,
      price_PM_in_GST: null,
      total_price: null,
      billing_frequency_in_months: null,
      billing_company: null,
      recharge_from: null,
      recharge_to: null,
      last_payment_duration: null,
      next_payment_due_date: null,
      approval_status_name: null,
      invoice_submitted_date: null,
      payment_status: "",
      IT_remarks: null,
      has_class_room_wifi: true,
      count_class_room_wifi: null,
      branch: 0,
      color: "",
      zone: 0,
      state: 0,
      admin: null,
      admin_name: null,
      approval_status: null,
      GST_per_value: null,
      billing_company_name: null,
      payment_status_name: null,
      price_PM_ex_GST: null,
      section_connection_name: null,
      invoice_number: null,
      invoice_date: null,
      UTR_details: null,
      payment_amount: null,
      payment_date: null,
      payment_method: null,
      payment_method_name: null,
    });
    setEditingIndex(null);
    setResetSelect((prev) => !prev);
  };
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [resetSelect, setResetSelect] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [provider, setProvider] = useState([]);
  const [branches, setBranches] = useState([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>({});
  const [currentRecord, setCurrentRecord] = useState<Exam | null>(null);
  const [approvalStatus, setAprrovalStatus] = useState([]);
  const [state, setState] = useState([]);
  const [zone, setZone] = useState([]);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [admin, setAdmin] = useState([]);
  const [gstData, setGstData] = useState([]);
  const [billingCompanies, setBillingCompanies] = useState([]);
  const { userPermissions, webApi } = useUserPermissions();
  const [paymentStatus, setPaymentStatus] = useState([]);
  const navigate = useNavigate();
  const [from, setFrom] = useState();
  const [to, setTo] = useState<number>();
  const [totalCount, setTotalCount] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number | undefined>(10);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentMethod, setPaymentMEthod] = useState([]);
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
  const fetchExams = async (
    _page: number,
    searchQuery: string,
    pageSize: number
  ) => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(
        `${webApi}/provider/branch_connection_details/?page=${_page}&page_size=${pageSize}&search=${searchQuery}`,
        options
      );
      const data = await response.json();
      setTotalPages(data.total_pages);
      setExams(data.results.data);
      setFrom(data.from);
      setTo(data.to);
      setTotalCount(data.total_count);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchProviders = async () => {
    const response = await fetch(
      `${webApi}/provider/provider_details_dropdown/`,
      options
    );
    const data = await response.json();
    setProvider(
      data.map((item: { provider_id: number; name: any; label: any }) => ({
        value: item.name,
        label: item.label,
        id: item.provider_id,
        idName: "ISP_provider",
        name: "ISP_provider_name",
      }))
    );
  };

  const fetchApprovalStatus = async () => {
    const response = await fetch(
      `${webApi}/provider/approval_status_dropdown/`,
      options
    );
    const data = await response.json();
    setAprrovalStatus(
      data.map((item: { id: number; name: any; label: any }) => ({
        value: item.name,
        label: item.label,
        id: item.id,
        idName: "approval_status",
        name: "approval_status_name",
      }))
    );
  };

  const fetchAdmins = async () => {
    const response = await fetch(
      `${webApi}/provider/admins_dropdown/`,
      options
    );
    const data = await response.json();
    setAdmin(
      data.map((item: { id: number; name: string; label: string }) => ({
        value: item.name,
        label: item.label,
        id: item.id,
        idName: "admin",
        name: "admin_name",
      }))
    );
  };

  const fetchGstData = async () => {
    const response = await fetch(
      `${webApi}/provider/gst_percentages_dropdown/`,
      options
    );
    const data = await response.json();
    setGstData(
      data.map((item: { id: number; GST_value: string; label: string }) => ({
        value: item.GST_value,
        label: item.label,
        id: item.id,
        idName: "GST_per",
        name: "GST_per_name",
      }))
    );
  };

  const fetchBillingCompanies = async () => {
    const response = await fetch(
      `${webApi}/provider/billing_companies_dropdown/`,
      options
    );
    const data = await response.json();
    setBillingCompanies(
      data.map((item: { id: number; company: string; label: string }) => ({
        value: item.company,
        label: item.label,
        id: item.id,
        idName: "billing_company",
        name: "billing_company_name",
      }))
    );
  };

  const fetchPaymentStatus = async () => {
    const response = await fetch(
      `${webApi}/provider/payment_status_dropdown/`,
      options
    );
    const data = await response.json();
    setPaymentStatus(
      data.map((item: { name: any; label: any; id: any }) => ({
        value: item.name,
        label: item.label,
        id: item.id,
        idName: "payment_status",
        name: "payment_status_name",
      }))
    );
  };
  const fetchPaymentMethod = async () => {
    const response = await fetch(
      `${webApi}/provider/PaymentMethod_dropdown/`,
      options
    );
    const data = await response.json();
    setPaymentMEthod(
      data.map(
        (item: { payment_method_name: any; payment_method_id: any }) => ({
          value: item.payment_method_name,
          label: item.payment_method_name,
          id: item.payment_method_id,
          idName: "payment_method",
          name: "payment_method_name",
        })
      )
    );
  };
  useEffect(() => {
    if (!checkPermission("view", "Can view BranchConnectionDetails")) {
      Cookies.remove("authToken");
      navigate("/login");
      return;
    }
    if (pageSize !== undefined) fetchExams(currentPage, searchQuery, pageSize);
  }, [currentPage]);

  useEffect(() => {
    if (!checkPermission("view", "Can view BranchConnectionDetails")) {
      Cookies.remove("authToken");
      navigate("/login");
      return;
    }

    fetchProviders();
    fetchApprovalStatus();
    fetchAdmins();
    fetchGstData();
    fetchBillingCompanies();
    fetchPaymentStatus();
    fetchPaymentMethod();
  }, []);

  const fetchStates = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `${webApi}/branches/branches_state_dropdown/`,
      options
    );
    const stateData = await response.json();
    setState(
      stateData.results.map(
        (item: { name: any; label: any; state_id: any }) => ({
          value: item.name,
          label: item.label,
          id: item.state_id,
          idName: "state",
          name: "state_name",
        })
      )
    );
  };

  const fetchZones = async (stateId: number) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `${webApi}/branches/branches_zone_dropdown/${stateId}/`,
      options
    );
    const zonesData = await response.json();
    setZone(
      zonesData.results.map(
        (item: { name: any; label: any; zone_id: any }) => ({
          value: item.name,
          label: item.label,
          id: item.zone_id,
          idName: "zone",
          name: "zone_name",
        })
      )
    );
  };

  const fetchBranches = async (stateId: number, zoneId: number) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `${webApi}/branches/branches_branches_dropdown/${stateId}/${zoneId}/`,
      options
    );
    const branchesData = await response.json();
    setBranches(
      branchesData.results.map(
        (item: { name: any; label: any; branch_id: any }) => ({
          value: item.name,
          label: item.name,
          id: item.branch_id,
          idName: "branch",
          name: "branch_name",
        })
      )
    );
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState !== null) {
      fetchZones(selectedState);
      setSelectedZone(null);
      setBranches([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedState !== null && selectedZone !== null) {
      fetchBranches(selectedState, selectedZone);
    } else {
      setBranches([]);
    }
  }, [selectedZone]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedExams =
      editingIndex !== null
        ? exams.map((exam, index) =>
            index === editingIndex ? { ...newExam } : exam
          )
        : [...exams, { ...newExam }]; // Add new exam

    console.log(updatedExams);

    try {
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
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Success:", data);
      setExams(updatedExams);
      if (pageSize !== undefined)
        await fetchExams(currentPage, searchQuery, pageSize);
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
    } catch (error) {
      console.error("Error submitting form:", error);
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
        GST_per: currentRecord.GST_per,
        price_PM_in_GST: currentRecord.price_PM_in_GST,
        total_price: currentRecord.total_price,
        billing_frequency_in_months: currentRecord.billing_frequency_in_months,
        billing_company: currentRecord.billing_company,
        recharge_from: currentRecord.recharge_from,
        recharge_to: currentRecord.recharge_to,
        last_payment_duration: currentRecord.last_payment_duration,
        next_payment_due_date: currentRecord.next_payment_due_date,
        approval_status_name: currentRecord.approval_status_name,
        invoice_submitted_date: currentRecord.invoice_submitted_date,
        payment_status: currentRecord.payment_status,
        IT_remarks: currentRecord.IT_remarks,
        has_class_room_wifi: currentRecord.has_class_room_wifi,
        count_class_room_wifi: currentRecord.count_class_room_wifi,
        branch_connection_id: currentRecord.branch_connection_id,
        branch: currentRecord.branch,
        color: currentRecord.color,
        state: currentRecord.state,
        zone: currentRecord.zone,
        admin: currentRecord.admin,
        admin_name: currentRecord.admin_name,
        approval_status: currentRecord.approval_status,
        GST_per_value: currentRecord.GST_per_value,
        billing_company_name: currentRecord.billing_company_name,
        payment_status_name: currentRecord.payment_status_name,
        price_PM_ex_GST: currentRecord.price_PM_ex_GST,
        section_connection_name: currentRecord.section_connection_name,
        invoice_number: currentRecord.invoice_number,
        invoice_date: currentRecord.invoice_date,
        UTR_details: currentRecord.UTR_details,
        payment_amount: currentRecord.payment_amount,
        payment_date: currentRecord.payment_date,
        payment_method: currentRecord.payment_method,
        payment_method_name: currentRecord.payment_method_name,
      });
      setEditingIndex(currentRecord.branch_connection_id);
      setSelectedState(currentRecord.state);
      setSelectedZone(currentRecord.zone);
    }
  }, [currentRecord]);

  const editExam = async (record: Exam) => {
    const branchConnectionId = record.branch_connection_id; // Extract the id from the record

    try {
      const response = await fetch(
        `${webApi}/provider/branch_connection_details/${branchConnectionId}/`,
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCurrentRecord(data.data); // Set the fetched data to currentRecord
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    const { price_PM_in_GST, billing_frequency_in_months } = newExam;

    if (price_PM_in_GST && billing_frequency_in_months) {
      const price = parseFloat(price_PM_in_GST.toString());
      const frequency = parseInt(billing_frequency_in_months.toString(), 10);
      const total = price * frequency;
      setNewExam((prev) => ({ ...prev, total_price: total }));
    } else {
      setNewExam((prev) => ({ ...prev, total_price: null }));
    }
  }, [newExam.price_PM_in_GST, newExam.billing_frequency_in_months]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExam({ ...newExam, [name]: value || null, IT_remarks: null });

    // Calculate price_PM_in_GST if price_PM_ex_GST is changed or GST is selected
    if (name === "price_PM_ex_GST" || name === "GST_per_value") {
      const priceExGST = parseFloat(newExam.price_PM_ex_GST || "0");
      const gstRate = parseFloat(newExam.GST_per_value || "0");

      // Calculate price_PM_in_GST
      const priceInGST = gstRate
        ? priceExGST * (1 + gstRate / 100)
        : priceExGST;
      setNewExam((prev) => ({ ...prev, price_PM_in_GST: priceInGST }));
    }
  };

  const handleSelectChange = (
    option: Option | null,
    idName: string,
    name: string
  ) => {
    setNewExam((prev) => ({
      ...prev,
      [idName]: option ? option.id : "",
      [name]: option ? option.value : "",
      IT_remarks: null,
    }));

    // Check if the selected option is for payment status
    if (idName === "payment_status") {
      if (option && option.value === "COMPLETED") {
        // If the payment status is COMPLETED, ensure UTR_details, payment_amount, and payment_date are set
        setNewExam((prev) => ({
          ...prev,
          UTR_details: prev.UTR_details || "", // Keep existing value or set to empty
          payment_amount: prev.payment_amount || 0, // Ensure this is a number
          payment_date: prev.payment_date || null, // Keep existing value or set to null
        }));
        setShowPaymentDetails(true); // Show additional fields
      } else {
        // If the payment status is not COMPLETED, you might want to clear these fields
        setNewExam((prev) => ({
          ...prev,
          UTR_details: "", // Clear UTR_details
          payment_amount: 0, // Clear payment_amount and set to 0
          payment_date: null, // Clear payment_date and set to null
        }));
        setShowPaymentDetails(false); // Hide additional fields
      }
    }
  };

  const handleReasonForEditChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewExam({ ...newExam, [name]: value || null});
  };
  useEffect(() => {
    if (searchQuery !== undefined && pageSize !== undefined) {
      fetchExams(currentPage, searchQuery, pageSize);
    }
  }, [searchQuery]);

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
    fetchExams(1, searchQuery, newPageSize);
  };

  const handleStateChange = (option: Option | null) => {
    setSelectedState(option && option.id !== undefined ? option.id : null);
  };

  const handleZoneChange = (option: Option | null) => {
    setSelectedZone(option && option.id !== undefined ? option.id : null);
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
          let recordContent = `<div style="border: 1px solid #007bff; border-radius: 10px; padding: 15px; margin-bottom: 15px; overflow: hidden; word-wrap: break-word; white-space: normal; text-overflow: ellipsis;">`;

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
      // setLoading(false);
    }
  };
  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      render: (_text: string, record: Exam) => (
        <div className="d-flex align-items-center">
          {checkPermission(
            "change",
            "Can change BranchConnectionPaymentDetails"
          ) && (
            <span title="Edit">
              <button
                className="btn btn-icon btn-sm btn-soft-info rounded-pill"
                onClick={() => editExam(record)}
                data-bs-toggle="modal"
                data-bs-target="#edit_Connection"
                style={{
                  backgroundColor: "#17a2b8",
                  color: "#fff",
                  borderRadius: "50%",
                }}
              >
                <i className="feather-edit" />
              </button>
            </span>
          )}
        </div>
      ),
    },
    {
      title: "State",
      dataIndex: "state_name",
      sorter: (a: Exam, b: Exam) => a.branch_name.localeCompare(b.branch_name),
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Zone",
      dataIndex: "zone_name",
      sorter: (a: Exam, b: Exam) => a.branch_name.localeCompare(b.branch_name),
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Branch Name",
      dataIndex: "branch_name",
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
        record: { branch_connection_id: any }
      ) => (
        <a
          href="#"
          onClick={() => viewEditHistory(record.branch_connection_id)}
          data-bs-toggle="modal"
          data-bs-target="#viewPaymentDuesHistory"
          style={{ color: "#007bff", textDecoration: "underline" }}
        >
          {text}
        </a>
      ),
      sorter: (a: Exam, b: Exam) => a.branch_name.localeCompare(b.branch_name),
    },
    {
      title: "Provider Name",
      dataIndex: "ISP_provider_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Device Location",
      dataIndex: "section_connection_name",
    },
    {
      title: "Price PM Ex.GST",
      dataIndex: "price_PM_ex_GST",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "GST",
      dataIndex: "GST_per_value",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Price PM Inc.GST",
      dataIndex: "price_PM_in_GST",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Billing frequency in Months",
      dataIndex: "billing_frequency_in_months",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Total",
      dataIndex: "total_price",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Trust / company to which billing is done",
      dataIndex: "billing_company_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "From",
      dataIndex: "recharge_from",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "To",
      dataIndex: "recharge_to",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Last payment duration",
      dataIndex: "last_payment_duration",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Next Payment Due Date",
      dataIndex: "next_payment_due_date",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Approval status",
      dataIndex: "approval_status_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Invoice Submit date",
      dataIndex: "invoice_submitted_date",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Payment Status /remarks",
      dataIndex: "payment_status_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "IT Remarks",
      dataIndex: "IT_remarks",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Invoice Number",
      dataIndex: "invoice_number",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoice_date",
    },
  ];
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
          className="content"
          style={{
            backgroundImage:
              "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
            minHeight: "99%",
            margin: "5px",
            marginTop: "15px",
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
                    Payment Entry
                  </li>
                </ol>
              </nav>
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
                max-width: 100%
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
                    .search-input { margin: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 500px; /* Adjust width */ }
              .clear-button { background: none; border: none; position: absolute; right: 10px; cursor: pointer; font-size: 16px; color: #aaa; }
              .pagination-controls { display: flex; align-items: center; margin-left: 10px; margin-right: 10px; margin-bottom: 10px;} 
              .pagination-select { margin-left: 5px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; }
              .input-container { display: flex; align-items: center; justify-content: space-between; }
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
                    dataSource={exams}
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
          </div>
          {/* /Guardians List */}
        </div>
      </div>
      <>
        {/* Edit Exam */}
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
                  // onClick={resetForm}
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
                    <label className="form-label">State</label>
                    <CommonSelect
                      className="select"
                      options={state}
                      onChange={(option) => {
                        // handleSelectChange(option, "state", "state_name");
                        handleStateChange(option);
                      }}
                      reset={resetSelect}
                      disabled={true}
                      defaultValue={state.find(
                        (option: { value: string }) =>
                          option.value === newExam.state_name
                      )}
                    />
                  </div>{" "}
                  <div className="mb-3">
                    <label className="form-label">Zone</label>
                    <CommonSelect
                      className="select"
                      options={zone}
                      onChange={(option) => {
                        // handleSelectChange(option, "zone", "zone_name");
                        handleZoneChange(option);
                      }}
                      reset={resetSelect}
                      disabled={true}
                      defaultValue={zone.find(
                        (option: { value: string }) =>
                          option.value === newExam.zone_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Branch Name</label>
                    <CommonSelect
                      className="select"
                      options={branches}
                      onChange={(option) =>
                        handleSelectChange(option, "branch", "branch_name")
                      }
                      reset={resetSelect}
                      disabled={true}
                      defaultValue={branches.find(
                        (option: { value: string }) =>
                          option.value === newExam.branch_name
                      )}
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
                      defaultValue={admin.find(
                        (option: { value: string }) =>
                          option.value === newExam.admin_name
                      )}
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
                      defaultValue={provider.find(
                        (option: { value: string }) =>
                          option.value === newExam.ISP_provider_name
                      )}
                      disabled={true}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price PM Exc.GST</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.price_PM_ex_GST ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="price_PM_ex_GST"
                      placeholder="Price PM Inc.GST"
                      value={newExam.price_PM_ex_GST || ""}
                      disabled={true}
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
                        handleSelectChange(option, "GST_per", "GST_per_value")
                      }
                      reset={resetSelect}
                      defaultValue={gstData.find(
                        (option: { value: string }) =>
                          option.value === newExam.GST_per_value
                      )}
                      disabled={true}
                    />
                  </div>
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
                      disabled={true}
                    />
                    {errorMessage.price_PM_in_GST && (
                      <div className="invalid-feedback">
                        {errorMessage.price_PM_in_GST[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Billing frequency in Months
                    </label>
                    <input
                      type="text"
                      className={`form-control`}
                      onChange={handleInputChange}
                      name="billing_frequency_in_months"
                      placeholder="Billing frequency in Months"
                      value={newExam.billing_frequency_in_months || ""}
                    />
                  </div>{" "}
                  <div className="mb-3">
                    <label className="form-label">Total</label>
                    <input
                      type="text"
                      className={`form-control`}
                      onChange={handleInputChange}
                      name="total_price"
                      placeholder="Total"
                      value={newExam.total_price || ""}
                      disabled={true}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Approval Status</label>
                    <CommonSelect
                      className="select"
                      options={approvalStatus}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "approval_status",
                          "approval_status_name"
                        )
                      }
                      reset={resetSelect}
                      defaultValue={approvalStatus.find(
                        (option: { value: string }) =>
                          option.value === newExam.approval_status_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Status</label>
                    <CommonSelect
                      className="select"
                      options={paymentStatus}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "payment_status",
                          "payment_status_name"
                        )
                      }
                      reset={resetSelect}
                      defaultValue={paymentStatus.find(
                        (option: { value: string }) =>
                          option.value === newExam.payment_status_name
                      )}
                    />
                  </div>
                  {newExam.payment_status_name === "COMPLETED" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">UTR Details</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errorMessage.UTR_details ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="UTR_details"
                          value={newExam.UTR_details || ""}
                          required
                        />
                        {errorMessage.UTR_details && (
                          <div className="invalid-feedback">
                            {errorMessage.UTR_details[0]}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Payment Amount</label>
                        <input
                          type="number" // Change to number input
                          className={`form-control ${
                            errorMessage.payment_amount ? "is-invalid" : ""
                          }`}
                          onChange={handleInputChange}
                          name="payment_amount"
                          value={newExam.payment_amount || ""} // Ensure this is a number
                          required
                        />
                        {errorMessage.payment_amount && (
                          <div className="invalid-feedback">
                            {errorMessage.payment_amount[0]}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Payment Date</label>
                        <DatePicker
                          className="form-control"
                          value={
                            newExam.payment_date
                              ? dayjs(newExam.payment_date)
                              : null
                          }
                          onChange={(date) =>
                            handleDateChange(date, "payment_date")
                          }
                          required
                        />
                        {errorMessage.payment_date && (
                          <div className="invalid-feedback">
                            {errorMessage.payment_date[0]}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Payment Method</label>
                        <CommonSelect
                          className="select"
                          options={paymentMethod}
                          onChange={(option) =>
                            handleSelectChange(
                              option,
                              "payment_method",
                              "payment_method_name"
                            )
                          }
                          reset={resetSelect}
                          defaultValue={paymentMethod.find(
                            (option: { value: string }) =>
                              option.value === newExam.payment_method_name
                          )}
                        />
                      </div>
                    </>
                  )}
                  <div className="mb-3">
                    <label className="form-label">IT Remarks</label>
                    <input
                      type="text"
                      className={`form-control`}
                      onChange={handleReasonForEditChange}
                      name="IT_remarks"
                      placeholder="IT Remarks"
                      value={newExam.IT_remarks || ""}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">From</label>
                    <div className="date-pic">
                      <DatePicker
                        className="form-control datetimepicker"
                        format="YYYY-MM-DD"
                        getPopupContainer={getModalContainer}
                        defaultValue={defaultValue}
                        onChange={(date) =>
                          handleDateChange(date, "recharge_from")
                        }
                        value={
                          newExam.recharge_from
                            ? dayjs(newExam.recharge_from, "YYYY-MM-DD")
                            : null
                        }
                      />
                      {/* <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span> */}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">To</label>
                    <div className="date-pic">
                      <DatePicker
                        className={`form-control datetimepicker ${
                          errorMessage.recharge_to ? "is-invalid" : ""
                        }`}
                        format="YYYY-MM-DD"
                        getPopupContainer={getModalContainer}
                        defaultValue={defaultValue}
                        onChange={(date) =>
                          handleDateChange(date, "recharge_to")
                        }
                        value={
                          newExam.recharge_to
                            ? dayjs(newExam.recharge_to, "YYYY-MM-DD")
                            : null
                        }
                      />
                      {errorMessage.recharge_to && (
                        <div className="invalid-feedback">
                          {errorMessage.recharge_to[0]}
                        </div>
                      )}
                      {/* <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span> */}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Payment Duration</label>
                    <input
                      type="text"
                      className={`form-control`}
                      onChange={handleInputChange}
                      name="last_payment_duration"
                      placeholder="Last Payment Duration"
                      value={newExam.last_payment_duration || ""}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Next Payment Due Date</label>
                    <div className="date-pic">
                      <DatePicker
                        className={`form-control datetimepicker ${
                          errorMessage.next_payment_due_date ? "is-invalid" : ""
                        }`}
                        format="YYYY-MM-DD"
                        getPopupContainer={getModalContainer}
                        defaultValue={defaultValue}
                        onChange={(date) =>
                          handleDateChange(date, "next_payment_due_date")
                        }
                        value={
                          newExam.next_payment_due_date
                            ? dayjs(newExam.next_payment_due_date, "YYYY-MM-DD")
                            : null
                        }
                      />
                      {errorMessage.next_payment_due_date && (
                        <div className="invalid-feedback">
                          {errorMessage.next_payment_due_date[0]}
                        </div>
                      )}
                      {/* <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span> */}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Invoice Number</label>
                    <input
                      type="text"
                      className={`form-control`}
                      onChange={handleInputChange}
                      name="invoice_number"
                      placeholder="Invoice Number"
                      value={newExam.invoice_number || ""}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Invoice date</label>
                    <div className="date-pic">
                      <DatePicker
                        className="form-control datetimepicker"
                        format="YYYY-MM-DD"
                        getPopupContainer={getModalContainer}
                        defaultValue={defaultValue}
                        onChange={(date) =>
                          handleDateChange(date, "invoice_date")
                        }
                        value={
                          newExam.invoice_date
                            ? dayjs(newExam.invoice_date, "YYYY-MM-DD")
                            : null
                        }
                      />
                      {/* <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span> */}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Invoice Submit date</label>
                    <div className="date-pic">
                      <DatePicker
                        className="form-control datetimepicker"
                        format="YYYY-MM-DD"
                        getPopupContainer={getModalContainer}
                        defaultValue={defaultValue}
                        onChange={(date) =>
                          handleDateChange(date, "invoice_submitted_date")
                        }
                        value={
                          newExam.invoice_submitted_date
                            ? dayjs(
                                newExam.invoice_submitted_date,
                                "YYYY-MM-DD"
                              )
                            : null
                        }
                      />
                      {/* <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span> */}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Payment Due */}
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
export default PaymentEntry;
