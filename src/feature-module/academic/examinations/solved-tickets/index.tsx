import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../core/common/dataTable/index";
import { TableData } from "../../../../core/data/interface";
import { Option } from "../../../../core/common/commonSelect";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import Cookies from "js-cookie";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { useUserPermissions } from "../../../UserPermissionsContext";

interface ExamDescriptionProps {
  text: string;
  color: string;
}
interface ErrorMessages {
  Short_description?: string[];
  description?: string[];
}

type Exam = {
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
};
const SolvedTickets = () => {
  const routes = all_routes;
  const [exams, setExams] = useState<Exam[]>([]);
  const jwtToken = Cookies.get("authToken");
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate);
  const defaultValue = dayjs(formattedDate);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>({});

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
    state_of_ticket: 3,
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
      state_of_ticket: 3,
    });
    setEditingIndex(null);
    setResetSelect((prev) => !prev);
  };
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [resetSelect, setResetSelect] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [branches, setBranches] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentRecord, setCurrentRecord] = useState<Exam | null>(null);
  const [zone, setZone] = useState([]);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const { userPermissions, webApi } = useUserPermissions();
  const [subCategory, setSubCategory] = useState([]);
  const navigate = useNavigate();
  const [from, setFrom] = useState();
  const [to, setTo] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const checkPermission = (action: any, subject: any) => {
    return userPermissions.some(
      (ability) => ability.action === action && ability.subject === subject
    );
  };

  const fetchData = async (_page: number, searchQuery: string) => {
    if (!checkPermission("view", "Can view ticket")) {
      Cookies.remove("authToken");
      navigate("/login");
      return;
    }

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    setIsLoading(true); // Start loading
    try {
      const examsResponse = await fetch(
        `${webApi}/tickets/ticketsinactive/?page=${_page}&search=${searchQuery}`,
        options
      );
      const examsData = await examsResponse.json();
      setTotalPages(examsData.total_pages);
      console.log(examsData);
      setExams(examsData.results.data);
      setFrom(examsData.from);
      setTo(examsData.to);
      setTotalCount(examsData.total_count);
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

  useEffect(() => {
    fetchData(currentPage, searchQuery);
  }, [currentPage]);

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
          label: item.label,
          id: item.branch_id,
          idName: "branch",
          name: "branch_name",
        })
      )
    );
  };

  useEffect(() => {
    if (selectedCategoryId !== null && "hasSubCategory") {
      fetchSubCategories(selectedCategoryId);
    }
  }, [selectedCategoryId]);

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
    }
  }, [selectedZone]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Update the state_of_ticket to 3 for resolution
    const updatedExam = {
      ...newExam,
      state_of_ticket: 3,
      Short_description: `${currentRecord?.Short_description || ""}\n${
        newExam.Short_description || ""
      }`,
      description: `${currentRecord?.description || ""}\n${
        newExam.description || ""
      }`,
    };

    const updatedExams =
      editingIndex !== null
        ? exams.map((exam, index) =>
            index === editingIndex ? { ...updatedExam } : exam
          )
        : [...exams, { ...updatedExam }]; // Add new exam

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
          ? `${webApi}/tickets/ticketsinactive/${updatedExam.ticket_id}/`
          : `${webApi}/tickets/ticketsinactive/`;
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        const errData = await response.json();
        setErrors(errData);
        setErrorMessage(errData);
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      await fetchData(currentPage, searchQuery);

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

  const openTicket = async (record: Exam) => {
    const updatedRecord = { ...record, state_of_ticket: 3 };
    setNewExam(updatedRecord);
    setEditingIndex(record.ticket_id);
    setCurrentRecord(record);
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

  useEffect(() => {
    if (searchQuery !== undefined) {
      fetchData(currentPage, searchQuery);
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

  const handleCategoryChange = (option: Option | null) => {
    setSelectedCategoryId(option && option.id !== undefined ? option.id : null);
  };

  const handleStateChange = (option: Option | null) => {
    setSelectedState(option && option.id !== undefined ? option.id : null);
    setSelectedZone(null);
    setBranches([]);
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
          <span title="Open Ticket">
            <button
              className="btn btn-icon btn-sm btn-soft-info rounded-pill me-2"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#open_ticket"
              onClick={() => openTicket(record)}
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
        </div>
      ),
    },
    {
      title: "Resolved By",
      dataIndex: "updated_by",
      render: (text: any, record: { color: any }) => (
        <ExamDescription text={text} color={record.color} />
      ),
    },
    {
      title: "Resolution Notes",
      dataIndex: "resolution_notes",
      render: (text: string | null, record: { color: string }) => (
        <ExamDescription text={text || ""} color={record.color} />
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
      title: "Resolved At",
      dataIndex: "updated_at",
      sorter: (a: TableData, b: TableData) =>
        a.examName.length - b.examName.length,
      render: (text: string, record: Exam) => (
        <span style={{ color: `${record.color}` }}>{text}</span>
      ),
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
                    Solved Tickets
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
            `}
          </style>
          <div className="styled-card">
            <div className="card-body p-0 py-3">
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
        {/* Add Ticket */}
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

        {/* Add Ticket */}
        {/* Add Ticket */}
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
        <div
          className="modal fade"
          id="open_ticket"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Re Open Ticket</h4>
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
                  <div className="mb-3">
                    <label className="form-label">Short Note</label>
                    <textarea
                      className={`form-control ${
                        errorMessage.Short_description ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="Short_description"
                      placeholder="Short Note"
                      value={
                        newExam.Short_description ===
                        (currentRecord?.Short_description || "")
                          ? ""
                          : newExam.Short_description || ""
                      }
                      rows={4} // Adjust the number of rows as needed
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        height: "auto",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      }}
                    />
                    {errorMessage.Short_description && (
                      <div className="invalid-feedback">
                        {errorMessage.Short_description[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className={`form-control ${
                        errorMessage.description ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="description"
                      placeholder="Description"
                      value={
                        newExam.description ===
                        (currentRecord?.description || "")
                          ? ""
                          : newExam.description || ""
                      }
                      rows={5} // Adjust the number of rows as needed
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        height: "auto",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      }}
                    />
                    {errorMessage.description && (
                      <div className="invalid-feedback">
                        {errorMessage.description[0]}
                      </div>
                    )}
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
      </>
    </div>
  );
};
export default SolvedTickets;
