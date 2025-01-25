import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../core/common/dataTable/index";
import CommonSelect, { Option } from "../../../../core/common/commonSelect";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import Cookies from "js-cookie";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { useUserPermissions } from "../../../UserPermissionsContext";
import { Toast } from "react-bootstrap";

const priorityColors: { [key: string]: string } = {
  Critical: "bg-soft-danger",
  High: "bg-soft-warning",
  Medium: "bg-soft-info",
  Low: "bg-soft-success",
};

const statusColors: { [key: string]: string } = {
  Active: "bg-soft-success",
  Reopened: "bg-soft-warning",
  // Add more statuses as needed
};
interface ExamDescriptionProps {
  text: string;
  color: string;
}

type Exam = {
  AssignedTo_name: string | null;
  channel_name: string | null;
  ticket_id: number | null;
  state: number | null;
  zone: number | null;
  state_name: any;
  zone_name: any;
  branch_name: any;
  ticket_number: any;
  caller: any;
  category: number | null;
  channel: number | null;
  impact: number | null;
  urgency: number | null;
  servicetype_name: any;
  subcategory_name: string | null;
  created_by: string | null;
  priority: string | null;
  impact_name: string | null;
  urgency_name: string | null;
  priority_name: string | null;
  Short_description: string | null;
  description: string | null;
  created_at: string;
  AssignedTo: number | null;
  category_name: string | null;
  subcategory: number | null;
  payment_status: any;
  branch: number | null;
  color: string;
  resolution_notes: string | null;
  resolved_by: string | null;
  part_waranty_status: string | null;
  reported_problem: string | null;
  updated_by: string;
  updated_at: string;
  state_of_ticket: number;
  section_connection: number | null;
  provider: number | null;
  ISP_provider_name: string | null;
  section_connection_name: string | null;
  state_of_ticket_name: string | null;
};
const Tickets = () => {
  const routes = all_routes;
  const [exams, setExams] = useState<Exam[]>([]);
  const jwtToken = Cookies.get("authToken");
  const [newExam, setNewExam] = useState<Exam>({
    ticket_id: null,
    state: null,
    zone: null,
    state_name: "",
    zone_name: "",
    branch_name: "",
    ticket_number: "",
    caller: "",
    category: null,
    channel: null,
    impact: null,
    urgency: null,
    servicetype_name: "",
    subcategory_name: "",
    created_by: "",
    priority: "",
    impact_name: "",
    urgency_name: "",
    priority_name: "",
    Short_description: "",
    description: "",
    created_at: "",
    AssignedTo: null,
    category_name: "",
    subcategory: null,
    payment_status: "",
    branch: null,
    color: "",
    resolution_notes: "",
    resolved_by: "",
    part_waranty_status: "",
    reported_problem: "",
    updated_by: "mohan",
    updated_at: "2024-11-12 09:52:50",
    state_of_ticket: 1,
    section_connection: null,
    provider: null,
    ISP_provider_name: null,
    section_connection_name: null,
    AssignedTo_name: null,
    channel_name: null,
    state_of_ticket_name: null,
  });
  const resetForm = () => {
    setNewExam({
      ticket_id: null,
      state: null,
      zone: null,
      state_name: "",
      zone_name: "",
      branch_name: "",
      ticket_number: "",
      caller: "",
      category: null,
      channel: null,
      impact: null,
      urgency: null,
      servicetype_name: "",
      subcategory_name: "",
      created_by: "",
      priority: "",
      impact_name: "",
      urgency_name: "",
      priority_name: "",
      Short_description: "",
      description: "",
      created_at: "",
      AssignedTo: null,
      category_name: "",
      subcategory: null,
      payment_status: "",
      branch: null,
      color: "",
      resolution_notes: "",
      resolved_by: "",
      part_waranty_status: "",
      reported_problem: "",
      updated_by: "mohan",
      updated_at: "2024-11-12 09:52:50",
      state_of_ticket: 1,
      section_connection: null,
      provider: null,
      ISP_provider_name: null,
      section_connection_name: null,
      AssignedTo_name: null,
      channel_name: null,
      state_of_ticket_name: null,
    });
    setEditingIndex(null);
    setCurrentRecord(null);
    setResetSelect((prev) => !prev);
    setSelectedState(null);
    setSelectedZone(null);
  };
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [resetSelect, setResetSelect] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [provider, setProvider] = useState([]);
  const [branches, setBranches] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentRecord, setCurrentRecord] = useState<Exam | null>(null);
  const [approvalStatus, setAprrovalStatus] = useState([]);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const { userPermissions, webApi } = useUserPermissions();
  const [channels, setChannels] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [impact, setImpact] = useState([]);
  const [urgency, setUrgency] = useState([]);
  const navigate = useNavigate();
  const [from, setFrom] = useState();
  const [to, setTo] = useState<number>();
  const [ispProviders, setIspProviders] = useState([]);
  const [sectionConnections, setSectionConnections] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [ticketRecord, setTicketRecord] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery,setSearchQuery] = useState('');
const [totalCount,setTotalCount] = useState();
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  const checkPermission = (action: any, subject: any) => {
    return userPermissions.some(
      (ability) => ability.action === action && ability.subject === subject
    );
  };

  const fetchExams = async (_page: number,searchQuery: string) => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(
        `${webApi}/tickets/tickets/?page=${_page}&search=${searchQuery}`,
        options
      );
      const data = await response.json();
      setTotalPages(data.total_pages);
      setExams(data.results.data);
      setFrom(data.from);
      setTo(data.to);
      setTotalCount(data.total_count)
    } catch (error) {
      console.error("Error fetching exams:", error);
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

  const fetchChannels = async () => {
    const response = await fetch(
      `${webApi}/tickets/channels_dropdowns/`,
      options
    );
    const data = await response.json();
    setChannels(
      data.map((item: { channel_id: number; name: any }) => ({
        value: item.name,
        label: item.name,
        id: item.channel_id,
        idName: "channel",
        name: "channel_name",
      }))
    );
  };

  const fetchServiceTypes = async () => {
    const response = await fetch(
      `${webApi}/tickets/service_types_dropdowns/`,
      options
    );
    const data = await response.json();
    setServiceTypes(
      data.map((item: { service_id: number; name: any }) => ({
        value: item.name,
        label: item.name,
        id: item.service_id,
        idName: "servicetype",
        name: "servicetype_name",
      }))
    );
  };

  const fetchAssignedTo = async () => {
    const response = await fetch(`${webApi}/tickets/user_names/`, options);
    const data = await response.json();
    setAssignedTo(
      data.map((item: { id: number; username: any }) => ({
        value: item.username,
        label: item.username,
        id: item.id,
        idName: "AssignedTo",
        name: "AssignedTo_name",
      }))
    );
  };

  const fetchCategories = async () => {
    const response = await fetch(
      `${webApi}/tickets/categories_dropdowns/`,
      options
    );
    const data = await response.json();
    setCategory(
      data.map(
        (item: { category_id: number; name: any; has_sub_category: any }) => ({
          value: item.name,
          label: item.name,
          id: item.category_id,
          idName: "category",
          name: "category_name",
          hasSubCategory: item.has_sub_category,
        })
      )
    );
  };

  const fetchImpacts = async () => {
    const response = await fetch(
      `${webApi}/tickets/impacts_dropdowns/`,
      options
    );
    const data = await response.json();
    setImpact(
      data.map((item: { impact_id: number; name: any; label: any }) => ({
        value: item.name,
        label: item.name,
        id: item.impact_id,
        idName: "impact",
        name: "impact_name",
      }))
    );
  };

  const fetchUrgencies = async () => {
    const response = await fetch(
      `${webApi}/tickets/urgencies_dropdowns/`,
      options
    );
    const data = await response.json();
    setUrgency(
      data.map((item: { urgency_id: number; name: any; label: any }) => ({
        value: item.name,
        label: item.name,
        id: item.urgency_id,
        idName: "urgency",
        name: "urgency_name",
      }))
    );
  };
  useEffect(() => {
    if (!checkPermission("view", "Can view BranchConnectionDetails")) {
      Cookies.remove("authToken");
      navigate("/login");
      return;
    }

    fetchExams(currentPage,searchQuery);
  }, [currentPage]);

  useEffect(() => {
    if (!checkPermission("view", "Can view BranchConnectionDetails")) {
      Cookies.remove("authToken");
      navigate("/login");
      return;
    }

    fetchProviders();
    fetchApprovalStatus();
    fetchChannels();
    fetchServiceTypes();
    fetchAssignedTo();
    fetchCategories();
    fetchImpacts();
    fetchUrgencies();
  }, []);

  const fetchSubCategories = async (selectedCategoryId: number) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `${webApi}/tickets/subcategory_dropdown/${selectedCategoryId}/`,
      options
    );
    const stateData = await response.json();
    setSubCategory(
      stateData.results.map((item: { sub_category_id: number; name: any }) => ({
        value: item.name,
        label: item.name,
        id: item.sub_category_id,
        idName: "subcategory",
        name: "subcategory_name",
      }))
    );
  };

  // const fetchStates = async () => {
  //     const options = {
  //         method: 'GET',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${jwtToken}`,
  //         },
  //     };
  //     const response = await fetch(`${webApi}/branches/branches_state_dropdown/`, options);
  //     const stateData = await response.json();
  //     setState(stateData.results.map((item: { name: any; label: any; state_id: any; }) => ({ value: item.name, label: item.label, id: item.state_id, idName: 'state', name: 'state_name', })));
  // };

  // const fetchZones = async (stateId: number) => {
  //     const options = {
  //         method: 'GET',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${jwtToken}`,
  //         },
  //     };
  //     const response = await fetch(`${webApi}/branches/branches_zone_dropdown/${stateId}/`, options);
  //     const zonesData = await response.json();
  //     setZone(zonesData.results.map((item: { name: any; label: any; zone_id: any; }) => ({ value: item.name, label: item.label, id: item.zone_id, idName: 'zone', name: 'zone_name', })));
  // };

  // const fetchBranches = async (stateId: number, zoneId: number) => {
  //     const options = {
  //         method: 'GET',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${jwtToken}`,
  //         },
  //     };
  //     const response = await fetch(`${webApi}/branches/branches_branches_dropdown/${stateId}/${zoneId}/`, options);
  //     const branchesData = await response.json();
  //     setBranches(branchesData.results.map((item: { name: any; label: any; branch_id: any; }) => ({ value: item.name, label: item.label, id: item.branch_id, idName: 'branch', name: 'branch_name', })));
  // };

  const fetchBranches = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await fetch(
        `${webApi}/branches/branch_dropdown/`,
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const branchesData = await response.json();
      setBranches(
        branchesData.results.map((item: { name: any; branch_id: any }) => ({
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

  const fetchIspProviders = async (branchId: number) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `${webApi}/tickets/tickets_provider_dropdown/${branchId}/`,
      options
    );
    const ispData = await response.json();
    setIspProviders(
      ispData.results.map(
        (item: { ISP_provider: any; ISP_provider_name: any }) => ({
          value: item.ISP_provider_name,
          label: item.ISP_provider_name,
          id: item.ISP_provider,
        })
      )
    );
  };

  const fetchSectionConnections = async (
    branchId: number,
    providerId: number
  ) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `${webApi}/tickets/tickets_section_connection_dropdown/${branchId}/${providerId}`,
      options
    );
    const sectionData = await response.json();
    setSectionConnections(
      sectionData.results.map(
        (item: { section_connection: any; section_connection_name: any }) => ({
          value: item.section_connection_name,
          label: item.section_connection_name,
          id: item.section_connection,
        })
      )
    );
  };

  // const handleBranchChange = (option: any) => {
  //     setNewExam((prev) => ({
  //         ...prev,
  //         ISP_provider_name: null,
  //         provider: null,
  //         section_connection: null,
  //         section_connection_name: null,
  //     }));
  //     const branchId = option && option.id !== undefined ? option.id : null;
  //     setSelectedBranch(branchId);
  //     setIspProviders([]);
  //     setSectionConnections([]);
  //     if (branchId !== null) {
  //         fetchIspProviders(branchId);
  //         if (selectedProvider !== null) {
  //             fetchSectionConnections(branchId, selectedProvider); // Pass both branch ID and provider ID
  //         }
  //     }
  //     handleSelectChange(option, "branch", "branch_name");
  // };

  const handleIspProviderChange = (option: any) => {
    setNewExam((prev) => ({
      ...prev,
      section_connection: null,
      section_connection_name: null,
    }));
    setSectionConnections([]);
    if (selectedBranch !== null) {
      fetchSectionConnections(selectedBranch, option.id); // Pass both branch ID and provider ID
    }
    handleSelectChange(option, "provider", "ISP_provider_name");
  };

  useEffect(() => {
    if (selectedCategoryId !== null && "hasSubCategory") {
      fetchSubCategories(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  // useEffect(() => {
  //     fetchStates();
  // }, []);

  // useEffect(() => {
  //     if (selectedState !== null) {
  //         fetchZones(selectedState);
  //         setSelectedZone(null);
  //         setBranches([]);
  //         setIspProviders([]);
  //         setSectionConnections([]);
  //     }
  // }, [selectedState]);

  // useEffect(() => {
  //     if (selectedState !== null && selectedZone !== null) {
  //         fetchBranches(selectedState, selectedZone);
  //         setSelectedBranch(null);
  //         setIspProviders([]);
  //         setSectionConnections([]);
  //     }
  // }, [selectedZone]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const currentDateTime = new Date().toLocaleString();
    // const updatedResolutionNotes = `${newExam.resolution_notes}\n${currentDateTime}`;

    const updatedExam = {
      ...newExam,
      resolution_notes: `${currentRecord?.resolution_notes || ""}\n${
        newExam.resolution_notes || ""
      }`,
    };

    console.log(updatedExam);

    const updatedExams =
      editingIndex !== null
        ? exams.map((exam, index) =>
            index === editingIndex ? { ...updatedExam } : exam
          )
        : [...exams, { ...updatedExam }]; // Add new exam

    console.log(updatedExams);

    try {
      const requestOptions = {
        method: editingIndex !== null ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedExam),
      };
      const url =
        editingIndex !== null
          ? `${webApi}/tickets/tickets/${updatedExam.ticket_id}/`
          : `${webApi}/tickets/tickets/`;
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        const errData = await response.json();
        setErrors(errData);
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
      console.log("Success:", data);
      setExams(updatedExams);
      await fetchExams(currentPage,searchQuery);
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
      const submitBtn2 = document.getElementById("submit-btn2");
      if (submitBtn2) {
        submitBtn2.setAttribute("data-bs-dismiss", "modal");
        submitBtn2.click();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  useEffect(() => {
    if (currentRecord) {
      setNewExam({
        ticket_id: currentRecord.ticket_id,
        state: currentRecord.state,
        zone: currentRecord.zone,
        state_name: currentRecord.state_name,
        zone_name: currentRecord.zone_name,
        branch_name: currentRecord.branch_name,
        ticket_number: currentRecord.ticket_number,
        caller: currentRecord.caller,
        category: currentRecord.category,
        channel: currentRecord.channel,
        impact: currentRecord.impact,
        urgency: currentRecord.urgency,
        servicetype_name: currentRecord.servicetype_name,
        subcategory_name: currentRecord.subcategory_name,
        created_by: currentRecord.created_by,
        priority: currentRecord.priority,
        impact_name: currentRecord.impact_name,
        urgency_name: currentRecord.urgency_name,
        priority_name: currentRecord.priority_name,
        Short_description: currentRecord.Short_description,
        description: currentRecord.description,
        created_at: currentRecord.created_at,
        AssignedTo: currentRecord.AssignedTo,
        category_name: currentRecord.category_name,
        subcategory: currentRecord.subcategory,
        payment_status: currentRecord.payment_status,
        branch: currentRecord.branch,
        color: currentRecord.color,
        resolution_notes: currentRecord.resolution_notes,
        resolved_by: currentRecord.resolved_by,
        part_waranty_status: currentRecord.part_waranty_status,
        reported_problem: currentRecord.reported_problem,
        updated_by: currentRecord.updated_by,
        updated_at: currentRecord.updated_at,
        state_of_ticket: 2,
        section_connection: currentRecord.section_connection,
        provider: currentRecord.provider,
        ISP_provider_name: currentRecord.ISP_provider_name,
        section_connection_name: currentRecord.section_connection_name,
        channel_name: currentRecord.channel_name,
        AssignedTo_name: currentRecord.AssignedTo_name,
        state_of_ticket_name: currentRecord.state_of_ticket_name,
      });
      setEditingIndex(currentRecord.ticket_id);
    }
  }, [currentRecord]);

  const editExam = (record: Exam) => {
    setCurrentRecord(record);
  };

  useEffect(() => {
    if (ticketRecord) {
      setNewExam({
        ticket_id: ticketRecord.ticket_id,
        state: ticketRecord.state,
        zone: ticketRecord.zone,
        state_name: ticketRecord.state_name,
        zone_name: ticketRecord.zone_name,
        branch_name: ticketRecord.branch_name,
        ticket_number: ticketRecord.ticket_number,
        caller: ticketRecord.caller,
        category: ticketRecord.category,
        channel: ticketRecord.channel,
        impact: ticketRecord.impact,
        urgency: ticketRecord.urgency,
        servicetype_name: ticketRecord.servicetype_name,
        subcategory_name: ticketRecord.subcategory_name,
        created_by: ticketRecord.created_by,
        priority: ticketRecord.priority,
        impact_name: ticketRecord.impact_name,
        urgency_name: ticketRecord.urgency_name,
        priority_name: ticketRecord.priority_name,
        Short_description: ticketRecord.Short_description,
        description: ticketRecord.description,
        created_at: ticketRecord.created_at,
        AssignedTo: ticketRecord.AssignedTo,
        category_name: ticketRecord.category_name,
        subcategory: ticketRecord.subcategory,
        payment_status: ticketRecord.payment_status,
        branch: ticketRecord.branch,
        color: ticketRecord.color,
        resolution_notes: ticketRecord.resolution_notes,
        resolved_by: ticketRecord.resolved_by,
        part_waranty_status: ticketRecord.part_waranty_status,
        reported_problem: ticketRecord.reported_problem,
        updated_by: ticketRecord.updated_by,
        updated_at: ticketRecord.updated_at,
        state_of_ticket: ticketRecord.state_of_ticket,
        section_connection: ticketRecord.section_connection,
        provider: ticketRecord.provider,
        ISP_provider_name: ticketRecord.ISP_provider_name,
        section_connection_name: ticketRecord.section_connection_name,
        channel_name: ticketRecord.channel_name,
        AssignedTo_name: ticketRecord.AssignedTo_name,
        state_of_ticket_name: ticketRecord.state_of_ticket_name,
      });
      setEditingIndex(ticketRecord.ticket_id);
      setSelectedState(ticketRecord.state);
      setSelectedCategoryId(ticketRecord.category);
      setSelectedProvider(ticketRecord.provider);
      setSelectedZone(ticketRecord.zone);
      setSelectedBranch(ticketRecord.branch);
      if (ticketRecord.branch !== null) {
        fetchIspProviders(ticketRecord.branch);
      }
      if (ticketRecord.branch !== null && ticketRecord.provider !== null) {
        fetchSectionConnections(ticketRecord.branch, ticketRecord.provider);
      }
    }
  }, [ticketRecord]);

  const editTicket = async (record: Exam) => {
    try {
      const response = await fetch(
        `${webApi }/tickets/tickets/${record.ticket_id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTicketRecord(data.data);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  const formatText = (text: string) => {
    const maxLength = 30;
    let formattedText = "";
    let currentLine = "";

    text.split(" ").forEach((word) => {
      if ((currentLine + word).length > maxLength) {
        formattedText += currentLine.trim() + "\n";
        currentLine = "";
      }
      currentLine += word + " ";
    });

    formattedText += currentLine.trim();
    return formattedText;
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    const formattedValue = value
      .split("\n")
      .map((line: { length: number; match: (arg0: RegExp) => any[] }) =>
        line.length > 20 ? line.match(/.{1,30}/g).join("\n") : line
      )
      .join("\n");
    setNewExam({ ...newExam, [name]: formattedValue || null });
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
    }));
  };
  const handleCategoryChange = (option: Option | null) => {
    setSelectedCategoryId(option && option.id !== undefined ? option.id : null);
    setNewExam((prev) => ({
      ...prev,
      subcategory: null,
      subcategory_name: null,
    }));
    setSubCategory([]); // Reset subcategory options
  };
  useEffect(() => {
      if (searchQuery !== undefined) {
        fetchExams(currentPage, searchQuery);
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
      ISP_provider_name: null,
      provider: null,
      section_connection: null,
      section_connection_name: null,
    }));
    setSelectedBranch(branchId);
    setIspProviders([]);
    setSectionConnections([]);
    if (branchId !== 0) {
      await fetchStateZone(branchId);
      await fetchIspProviders(branchId);
      if (selectedProvider !== null) {
        fetchSectionConnections(branchId, selectedProvider); // Pass both branch ID and provider ID
      }
    }
    handleSelectChange(option, "branch", "branch_name");
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
  const camAddTicket = checkPermission("add", "Can add ticket");

  const ExamDescription: React.FC<ExamDescriptionProps> = ({ text, color }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
      setIsExpanded(!isExpanded);
    };

    if (!text) return null;

    return (
      <span
        style={{
          color: color,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {text.length > 15 ? (
          <>
            {isExpanded ? (
              <span onClick={toggleReadMore} style={{ cursor: "pointer" }}>
                {text}
              </span>
            ) : (
              <a
                onClick={toggleReadMore}
                style={{ color: "blue", cursor: "pointer" }}
              >
                {`${text.substring(0, 15)}...`}
              </a>
            )}
          </>
        ) : (
          text
        )}
      </span>
    );
  };

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      render: (_text: string, record: Exam) => (
        <div className="d-flex align-items-center">
          {checkPermission("resolve", "Can Resolve Ticket") && (
            <span title="Solve Ticket">
              <button
                className="btn btn-icon btn-sm btn-soft-info rounded-pill me-2"
                data-bs-toggle="modal"
                onClick={() => editExam(record)}
                data-bs-target="#solve_ticket"
                type="button"
                style={{
                  backgroundColor: "#17a2b8",
                  color: "#fff",
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              >
                <i className="fas fa-ticket"></i>
              </button>
            </span>
          )}
           {checkPermission("change", "Can change ticket") && (
          <span title="Edit Connection">
            <button
              className="btn btn-icon btn-sm btn-soft-info rounded-pill me-2"
              data-bs-toggle="modal"
              data-bs-target="#edit_connection"
              type="button"
              onClick={() => editTicket(record)}
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
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "state_of_ticket_name",
      render: (text: string, record: Exam) => (
        <span
          className={`badge ${
            record.state_of_ticket_name
              ? statusColors[record.state_of_ticket_name]
              : ""
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority_name",
      render: (text: string, record: Exam) => (
        <span
          className={`badge ${
            record.priority_name ? priorityColors[record.priority_name] : ""
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Ticket Number",
      dataIndex: "ticket_number",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "State",
      dataIndex: "state_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Zone",
      dataIndex: "zone_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Branch Name",
      dataIndex: "branch_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "ISp Provider",
      dataIndex: "ISP_provider_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Section Connection",
      dataIndex: "section_connection_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Caller",
      dataIndex: "caller",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },

    {
      title: "Channel",
      dataIndex: "channel_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Service Type",
      dataIndex: "servicetype_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "AssignedTo_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    {
      title: "Sub Category",
      dataIndex: "subcategory_name",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },
    // {
    //     title: "Impact",
    //     dataIndex: "impact_name",
    //     sorter: (a: TableData, b: TableData) =>
    //         a.examName.length - b.examName.length,
    //     render: (text: string, record: Exam) => (
    //         <span style={{ color: `${record.color}` }}>{text}</span>
    //     ),
    // },
    // {
    //     title: "Urgency ",
    //     dataIndex: "urgency_name",
    //     sorter: (a: TableData, b: TableData) =>
    //         a.examName.length - b.examName.length,
    //     render: (text: string, record: Exam) => (
    //         <span style={{ color: `${record.color}` }}>{text}</span>
    //     ),
    // },
    {
      title: "Short Note",
      dataIndex: "Short_description",
      render: (text: any, record: { color: any }) => (
        <ExamDescription text={text} color={record.color} />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text: any, record: { color: any }) => (
        <ExamDescription text={text} color={record.color} />
      ),
    },

    {
      title: "Created At",
      dataIndex: "created_at",
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
    },

    // {
    //     title: "Action",
    //     dataIndex: "action",
    //     render: (_text: string, record: Exam) => (
    //         <div className="d-flex align-items-center">
    //             <button
    //                 className="btn btn-icon btn-sm btn-soft-info rounded-pill"
    //                 onClick={() => editExam(record)}
    //                 data-bs-toggle="modal"
    //                 data-bs-target="#edit_Connection"
    //             >
    //                 <i className="feather-edit" />
    //             </button>
    //         </div>
    //     ),
    // }
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
                    Tickets
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="mb-2">
                {camAddTicket && (
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_Connection"
                    type="button"
                    onClick={resetForm}
                  >
                    {" "}
                    <i className="ti ti-square-rounded-plus-filled me-2" /> Add
                    Ticket
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
            `}
          </style>
          <div className="styled-card">
            <div className="card-body p-0 py-3">
            <input type="text" placeholder="Search" className="search-input" value={searchQuery} onChange={handleSearchInputChange} />{searchQuery && ( <button className="clear-button" > &#x2716; {/* Close icon */} </button> )}
              {/* Guardians List */}
              {isLoading ? (
                <Loader />
              ) : (
                <div
                  style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    maxHeight: "80vh",
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
                    totalCount = {totalCount}
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
        {/* Add Ticket */}
        <div>
          <style>
            {`
    .custom-modal-size {
      max-width: 1200px;
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
          <div className="modal fade" id="add_Connection">
            <div className="modal-dialog custom-modal-size">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Add Ticket</h4>
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
                <form onSubmit={handleSubmit}>
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
                    <div className="mb-3">
                      <label className="form-label">ISP Provider</label>
                      <CommonSelect
                        className="select"
                        options={ispProviders}
                        onChange={(option) => {
                          handleIspProviderChange(option);
                        }}
                        reset={resetSelect}
                        disabled={!selectedBranch}
                        defaultValue={ispProviders.find(
                          (option: { value: string }) =>
                            option.value === newExam.ISP_provider_name
                        )}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Section Connection</label>
                      <CommonSelect
                        className="select"
                        options={sectionConnections}
                        onChange={(option) =>
                          handleSelectChange(
                            option,
                            "section_connection",
                            "section_connection_name"
                          )
                        }
                        reset={resetSelect}
                        disabled={!selectedBranch}
                        defaultValue={sectionConnections.find(
                          (option: { value: string }) =>
                            option.value === newExam.section_connection_name
                        )}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Caller</label>
                      <input
                        type="text"
                        className={`form-control`}
                        onChange={handleInputChange}
                        name="caller"
                        placeholder="Caller"
                        value={newExam.caller}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Channel</label>
                      <CommonSelect
                        className="select"
                        options={channels}
                        onChange={(option) =>
                          handleSelectChange(option, "channel", "channel_name")
                        }
                        reset={resetSelect}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Service Type</label>
                      <CommonSelect
                        className="select"
                        options={serviceTypes}
                        onChange={(option) =>
                          handleSelectChange(
                            option,
                            "servicetype",
                            "servicetype_name"
                          )
                        }
                        reset={resetSelect}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Impact</label>
                      <CommonSelect
                        className="select"
                        options={impact}
                        onChange={(option) =>
                          handleSelectChange(option, "impact", "impact_name")
                        }
                        reset={resetSelect}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Urgency</label>
                      <CommonSelect
                        className="select"
                        options={urgency}
                        onChange={(option) =>
                          handleSelectChange(option, "urgency", "urgency_name")
                        }
                        reset={resetSelect}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Assigned To</label>
                      <CommonSelect
                        className="select"
                        options={assignedTo}
                        onChange={(option) =>
                          handleSelectChange(
                            option,
                            "AssignedTo",
                            "AssignedTo_name"
                          )
                        }
                        reset={resetSelect}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <CommonSelect
                        className="select"
                        options={category}
                        onChange={(option) => {
                          handleSelectChange(
                            option,
                            "category",
                            "category_name"
                          );
                          handleCategoryChange(option);
                        }}
                        reset={resetSelect}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Sub Category</label>
                      <CommonSelect
                        className="select"
                        options={subCategory}
                        onChange={(option) => {
                          handleSelectChange(
                            option,
                            "subcategory",
                            "subcategory_name"
                          );
                        }}
                        reset={resetSelect}
                        defaultValue={subCategory.find(
                          (option: { value: string }) =>
                            option.value === newExam.subcategory_name
                        )}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Short Note</label>
                      <textarea
                        className={`form-control`}
                        onChange={handleInputChange}
                        name="Short_description"
                        placeholder="Short Note"
                        value={newExam.Short_description || ""}
                        rows={4} // Adjust the number of rows as needed
                        required={true}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className={`form-control`}
                        onChange={handleInputChange}
                        name="description"
                        placeholder="Description"
                        value={newExam.description || ""}
                        rows={5} // Adjust the number of rows as needed
                        required={true}
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
                      {" "}
                      <Toast.Body> {toastMessage} </Toast.Body>{" "}
                    </Toast>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="edit_connection">
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Ticket</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  // onClick={resetForm}
                  id="submit-btn2"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
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
                  <div className="mb-3">
                    <label className="form-label">ISP Provider</label>
                    <CommonSelect
                      className="select"
                      options={ispProviders}
                      onChange={(option) => {
                        handleIspProviderChange(option);
                      }}
                      reset={resetSelect}
                      // disabled={!selectedBranch}
                      defaultValue={ispProviders.find(
                        (option: { value: string }) =>
                          option.value === newExam.ISP_provider_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Section Connection</label>
                    <CommonSelect
                      className="select"
                      options={sectionConnections}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "section_connection",
                          "section_connection_name"
                        )
                      }
                      reset={resetSelect}
                      // disabled={!selectedBranch}
                      defaultValue={sectionConnections.find(
                        (option: { value: string }) =>
                          option.value === newExam.section_connection_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Caller</label>
                    <input
                      type="text"
                      className={`form-control`}
                      onChange={handleInputChange}
                      name="caller"
                      placeholder="Caller"
                      value={newExam.caller}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Channel</label>
                    <CommonSelect
                      className="select"
                      options={channels}
                      onChange={(option) =>
                        handleSelectChange(option, "channel", "channel_name")
                      }
                      reset={resetSelect}
                      defaultValue={channels.find(
                        (option: { value: string }) =>
                          option.value === newExam.channel_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Service Type</label>
                    <CommonSelect
                      className="select"
                      options={serviceTypes}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "servicetype",
                          "servicetype_name"
                        )
                      }
                      reset={resetSelect}
                      defaultValue={serviceTypes.find(
                        (option: { value: string }) =>
                          option.value === newExam.servicetype_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Impact</label>
                    <CommonSelect
                      className="select"
                      options={impact}
                      onChange={(option) =>
                        handleSelectChange(option, "impact", "impact_name")
                      }
                      reset={resetSelect}
                      defaultValue={impact.find(
                        (option: { value: string }) =>
                          option.value === newExam.impact_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Urgency</label>
                    <CommonSelect
                      className="select"
                      options={urgency}
                      onChange={(option) =>
                        handleSelectChange(option, "urgency", "urgency_name")
                      }
                      reset={resetSelect}
                      defaultValue={urgency.find(
                        (option: { value: string }) =>
                          option.value === newExam.urgency_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Assigned To</label>
                    <CommonSelect
                      className="select"
                      options={assignedTo}
                      onChange={(option) =>
                        handleSelectChange(
                          option,
                          "AssignedTo",
                          "AssignedTo_name"
                        )
                      }
                      reset={resetSelect}
                      defaultValue={assignedTo.find(
                        (option: { value: string }) =>
                          option.value === newExam.AssignedTo_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <CommonSelect
                      className="select"
                      options={category}
                      onChange={(option) => {
                        handleSelectChange(option, "category", "category_name");
                        handleCategoryChange(option);
                      }}
                      reset={resetSelect}
                      defaultValue={category.find(
                        (option: { value: string }) =>
                          option.value === newExam.category_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sub Category</label>
                    <CommonSelect
                      className="select"
                      options={subCategory}
                      onChange={(option) => {
                        handleSelectChange(
                          option,
                          "subcategory",
                          "subcategory_name"
                        );
                      }}
                      reset={resetSelect}
                      defaultValue={subCategory.find(
                        (option: { value: string }) =>
                          option.value === newExam.subcategory_name
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Short Note</label>
                    <textarea
                      className={`form-control`}
                      onChange={handleInputChange}
                      name="Short_description"
                      placeholder="Short Note"
                      value={newExam.Short_description || ""}
                      required
                      rows={4} // Adjust the number of rows as needed
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className={`form-control`}
                      onChange={handleInputChange}
                      name="description"
                      placeholder="Description"
                      value={newExam.description || ""}
                      rows={5} // Adjust the number of rows as needed
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
                    {" "}
                    <Toast.Body> {toastMessage} </Toast.Body>{" "}
                  </Toast>
                </div>
              </form>
            </div>
          </div>
        </div>
        <style>
          {`
    .custom-modal-size1 {
      max-width:500px;
      width: auto;
    }`}
        </style>
        {/* Add Ticket */}
        {/* Add Ticket */}
        <div
          className="modal fade"
          id="solve_ticket"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size1 modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Solve Ticket</h4>
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
              <form onSubmit={handleSubmit}>
                <div className="modal-body light-violet-bg">
                  {/* <div className="mb-3">
                                        <label className="form-label">Resolution Notes</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={handleInputChange}
                                            name="resolution_notes"
                                            placeholder="Resolution Notes"
                                            value={newExam.resolution_notes || ''}
                                        />
                                    </div> */}
                  {/* <div className="mb-3">
                    <label className="form-label">
                      Previous Resolution Notes
                    </label>
                    <textarea
                      className="form-control"
                      value={currentRecord?.resolution_notes || ""}
                      disabled
                      rows={22}
                    />
                  </div> */}
                  <div className="mb-3">
                    <label className="form-label">New Resolution Notes</label>
                    <textarea
                      className="form-control"
                      onChange={handleInputChange}
                      name="resolution_notes"
                      placeholder="Enter new resolution notes"
                      value={
                        newExam.resolution_notes ===
                        (currentRecord?.resolution_notes || "")
                          ? ""
                          : newExam.resolution_notes || ""
                      }
                      required
                      rows={5}
                    />
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" type="submit">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Edit Payment Due */}
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
export default Tickets;
