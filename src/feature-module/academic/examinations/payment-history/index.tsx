import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonSelect, { Option } from "../../../../core/common/commonSelect";
import Cookies from "js-cookie";
import { all_routes } from "../../../router/all_routes";
import { useUserPermissions } from "../../../UserPermissionsContext";
import Table from "../../../../core/common/dataTable/index";

type ErrorMessage = {
  name?: string[];
};

type PaymentData = {
  branch_name: string;
  ISP_provider_name: string;
  changed_by_name: string;
  change_date: string;
  payment_status_name: string;
  payment_date: string;
  payment_amount: number;
  UTR_details: string;
  IT_remarks: string;
  invoice_date: string;
  invoice_number: string;
};

const PaymentHistory = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const jwtToken = Cookies.get("authToken");
  const [loading, setLoading] = useState(false);
  const { userPermissions, webApi, userProfile } = useUserPermissions();
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [from, setFrom] = useState();
  const [to, setTo] = useState<number>();
  const [totalCount, setTotalCount] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number | undefined>(10);

  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

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

  const fetchBranches = async () => {
    try {
      const response = await fetch(
        `${webApi}/branches/branch_dropdown/`,
        options
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const branchesData = await response.json();

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

  const fetchProviderData = async (
    page: number,
    searchQuery: string,
    pageSize: number
  ) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `${webApi}/provider/branch_connection_details_last_log/?page=${page}&page_size=${pageSize}&search=${searchQuery}`,
      options
    );
    const data = await response.json();
    setPaymentData(data.results);
    setFrom(data.from);
    setTo(data.to);
    setTotalCount(data.total_count);
    setTotalPages(data.total_pages);
  };

  useEffect(() => {
    if (!checkPermission("view", "Can view sub category")) {
      Cookies.remove("authToken");
      navigate("/login");
    } else {
      fetchBranches();
      if (pageSize !== undefined)
        fetchProviderData(currentPage, searchQuery, pageSize);
    }
  }, [userPermissions, navigate]);

  useEffect(() => {
    if (pageSize !== undefined)
      fetchProviderData(currentPage, searchQuery, pageSize);
  }, [searchQuery]);

  const handleSelectChange = async (id: any) => {
    try {
      const response = await fetch(
        `${webApi}/provider/branch_connection_details_payment_log_detail/${id}/?page=${currentPage}&page_size=${pageSize}&search=${searchQuery}`,
        options
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Network response was not ok");
      }

      // Generate modal content
      const modalContent = data.results
        .map((record: { [key: string]: any }) => {
          let recordContent = `<div style="border: 1px solid #007bff; border-radius: 10px; padding: 15px; margin-bottom: 15px;">`;

          if (record.payment_status_name) {
            recordContent += `
              <div style="margin-bottom: 10px;">
                <strong style="color: #007bff;">Payment Status:</strong>
                <span style="margin-left: 10px;">${record.payment_status_name}</span>
              </div>`;
          }
          if (record.payment_date) {
            recordContent += `
              <div style="margin-bottom: 10px;">
                <strong style="color: #007bff;">Payment Date:</strong>
                <span style="margin-left: 10px;">${record.payment_date}</span>
              </div>`;
          }
          if (record.payment_amount) {
            recordContent += `
              <div style="margin-bottom: 10px;">
                <strong style="color: #007bff;">Payment Amount:</strong>
                <span style="margin-left: 10px;">${record.payment_amount}</span>
              </div>`;
          }
          if (record.UTR_details) {
            recordContent += `
              <div style="margin-bottom: 10px;">
                <strong style="color: #007bff;">UTR Details:</strong>
                <span style="margin-left: 10px;">${record.UTR_details}</span>
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
          if (record.IT_remarks) {
            recordContent += `
              <div style="margin-bottom: 10px;">
                <strong style="color: #007bff;">IT Remarks:</strong>
                <span style="margin-left: 10px;">${record.IT_remarks}</span>
              </div>`;
          }
          if (record.changed_by_name) {
            recordContent += `
              <div style="margin-bottom: 10px;">
                <strong style="color: #007bff;">Changed By:</strong>
                <span style="margin-left: 10px;">${record.changed_by_name}</span>
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

      // Update modal content
      const tableBody = document.getElementById("paymentDuesContent");
      if (tableBody) {
        tableBody.innerHTML = modalContent;
        $("#viewPaymentDuesHistory").modal("show"); // Show the modal using Bootstrap's modal method
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPageSize(newPageSize);
    fetchProviderData(1, searchQuery, newPageSize);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  const handleClear = () => {
    setSearchTerm("");
    setSelectedBranch(null);
    if (pageSize !== undefined)
      fetchProviderData(currentPage, searchQuery, pageSize);
    setSelectedOption(null);
  };

  const filteredData = paymentData.filter((data) =>
    Object.values(data).some(
      (value) =>
        value != null &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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

  const columns = [
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
          onClick={() => handleSelectChange(record.branch_connection_id)}
          data-bs-toggle="modal"
          data-bs-target="#viewPaymentDuesHistory"
          style={{ color: "#007bff", textDecoration: "underline" }}
        >
          {text}
        </a>
      ),
    },

    {
      title: "ISP Name",
      dataIndex: "ISP_provider_name",
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status_name",
    },
    {
      title: "Payment Date",
      dataIndex: "payment_date",
    },
    {
      title: "Payment Amount",
      dataIndex: "payment_amount",
    },
    {
      title: "UTR Details",
      dataIndex: "UTR_details",
    },

    {
      title: "Invoice Number",
      dataIndex: "invoice_number",
    },
    {
      title: "Invoice Date",
      dataIndex: "invoice_date",
    },
    {
      title: "IT Remarks",
      dataIndex: "IT_remarks",
    },
    {
      title: "Changed By",
      dataIndex: "changed_by_name",
    },
    {
      title: "Change Date",
      dataIndex: "change_date",
    },
  ];

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
        minHeight: "100vh",
        overflow: "hidden",
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
          }}
        >
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Payment History Details</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Payment History Details
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        <div
          style={{ maxWidth: "750px", width: "100%", marginLeft: "59px" }}
        ></div>
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
           `}
        </style>
        {loading ? (
          <Loader />
        ) : (
          <div
            className="styled-card"
            style={{ marginLeft: "25px", marginRight: "25px" }}
          >
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

              <div
                style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "70vh",
                }}
              >
                <Table
                  columns={columns}
                  dataSource={paymentData}
                  Selection={true}
                  handleNextPage={handleNextPage}
                  handlePreviousPage={handlePreviousPage}
                  currentpage={currentPage}
                  from={from}
                  to={to}
                  totalCount={totalCount}
                />
              </div>

              {/* /Guardians List */}
            </div>
          </div>
        )}
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
                  Payment Dues History
                </h4>
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
                <div id="paymentDuesContent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
