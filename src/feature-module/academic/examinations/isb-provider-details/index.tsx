import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../core/common/dataTable/index";
import { all_routes } from "../../../router/all_routes";
import Cookies from "js-cookie";
import { useUserPermissions } from "../../../UserPermissionsContext";

interface ErrorMEssage {
  provider_name?: string[];
  provider_contact?: string[];
  provider_address?: string[];
  provider_contact_person?: string[];
  provider_email?: string[];
  vendor_id?: string[];
}

type Provider = {
  provider_name: string | null;
  provider_contact: string | null;
  provider_address: string | null;
  provider_id: number;
  provider_contact_person: string | null;
  provider_email: string | null;
  vendor_id: string | null;
};

const ProviderDetailsTable = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [providerDetails, setProviderDetails] = useState<Provider[]>([]);
  const jwtToken = Cookies.get("authToken");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMEssage>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { userPermissions, webApi } = useUserPermissions();
  const [currentRecord, setCurrentRecord] = useState<Provider | null>(null);
  const [from, setFrom] = useState();
  const [to, setTo] = useState<number>();
  const [totalCount, setTotalCount] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number | undefined>(10);
  const checkPermission = (action: any, subject: any) => {
    return userPermissions.some(
      (ability) => ability.action === action && ability.subject === subject
    );
  };

  const [newProvider, setNewProvider] = useState<Provider>({
    provider_name: null,
    provider_contact: null,
    provider_address: null,
    provider_id: 0,
    provider_contact_person: null,
    provider_email: null,
    vendor_id: null,
  });

  const resetForm = () => {
    setNewProvider({
      provider_name: null,
      provider_contact: null,
      provider_address: null,
      provider_id: 0,
      provider_contact_person: null,
      provider_email: null,
      vendor_id: null,
    });
    setEditingIndex(null);
    setErrorMessage({});
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
      `${webApi}/provider/providers/?page=${page}&page_size=${pageSize}&search=${searchQuery}`,
      options
    );
    return await response.json();
  };

  const fetchData = async (
    _page: number,
    searchQuery: string,
    pageSize: number
  ) => {
    try {
      const [providerData] = await Promise.all([
        fetchProviderData(_page, searchQuery, pageSize),
      ]);
      setTotalPages(providerData.total_pages);
      setProviderDetails(providerData.results.data);
      setFrom(providerData.from);
      setTo(providerData.to);
      setTotalCount(providerData.total_count);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => {
    if (!checkPermission("view", "Can view provider")) {
      Cookies.remove("authToken");
      navigate("/login");
    } else {
      if (pageSize !== undefined) fetchData(currentPage, searchQuery, pageSize);
    }
  }, [currentPage, userPermissions, navigate]);

  const updateData = async () => {
    const updatedProviderDetails =
      editingIndex !== null
        ? providerDetails.map((providerDetail, index) =>
            index == editingIndex ? { ...newProvider } : providerDetail
          )
        : [...providerDetails, { ...newProvider }];
    const requestOptions = {
      method: editingIndex !== null ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newProvider),
    };
    const url =
      editingIndex !== null
        ? `${webApi}/provider/providers/${newProvider.provider_id}/`
        : `${webApi}/provider/providers/`;
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      setErrorMessage(errorData);
      throw new Error("Network response was not ok");
    }
    setProviderDetails(updatedProviderDetails);
    if (pageSize !== undefined)
      await fetchData(currentPage, searchQuery, pageSize);
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
    } catch (error) {}
  };

  useEffect(() => {
    if (currentRecord) {
      setNewProvider({
        provider_name: currentRecord.provider_name,
        provider_address: currentRecord.provider_address,
        provider_contact: currentRecord.provider_contact,
        provider_id: currentRecord.provider_id,
        provider_contact_person: currentRecord.provider_contact_person,
        provider_email: currentRecord.provider_email,
        vendor_id: currentRecord.vendor_id,
      });
      setEditingIndex(currentRecord.provider_id);
    }
  }, [currentRecord]);

  const editProviderDetails = (record: Provider) => {
    setCurrentRecord(record);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProvider({ ...newProvider, [name]: value || null });
  };
  useEffect(() => {
    if (searchQuery !== undefined && pageSize !== undefined) {
      fetchData(currentPage, searchQuery, pageSize);
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
    fetchData(1, searchQuery, newPageSize);
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

  const getModalContainer = () => {
    const modalElement = document.getElementById("modal-datepicker");
    return modalElement ? modalElement : document.body;
  };

  const columns = [
    // {
    //     title: "Provider Id",
    //     dataIndex: "provider_id"
    // },
    {
      title: "Provider Name",
      dataIndex: "provider_name",
    },
    {
      title: "Contact Person",
      dataIndex: "provider_contact_person",
    },
    {
      title: "Provider Address",
      dataIndex: "provider_address",
    },
    {
      title: "Provider Contact",
      dataIndex: "provider_contact",
    },
    {
      title: "Provider Email",
      dataIndex: "provider_email",
    },
    {
      title: "Vendor Id",
      dataIndex: "vendor_id",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_text: string, record: Provider) => (
        <div className="d-flex align-items-center">
          {" "}
          {checkPermission("change", "Can change provider") && (
            <button
              className="btn btn-icon btn-sm btn-soft-info rounded-pill"
              onClick={() => editProviderDetails(record)}
              data-bs-toggle="modal"
              data-bs-target="#edit_Provider"
            >
              {" "}
              <i className="feather-edit" />{" "}
            </button>
          )}{" "}
        </div>
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
              <h3 className="page-title mb-1">ISP Details</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    ISP Details
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="mb-2">
                {checkPermission("add", "Can add provider") && (
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    onClick={resetForm}
                    data-bs-target="#add_Provider"
                    type="button"
                  >
                    {" "}
                    <i className="ti ti-square-rounded-plus-filled me-2" /> Add
                    New{" "}
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
             .pagination-controls { display: flex; align-items: center; margin-left: 10px; margin-right: 10px; margin-bottom: 10px;} 
              .pagination-select { margin-left: 5px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; }
              .input-container { display: flex; align-items: center; justify-content: space-between; }
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
                  )}{" "}
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
              <div style={{ overflowX: "auto" }}>
                <Table
                  columns={columns}
                  dataSource={providerDetails}
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
          {/* /Guardians List */}
        </div>
      </div>
      <>
        {/* /Add Connection */}
        <style>
          {`
          .custom-modal-size {
            max-width: 600px;
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
          id="add_Provider"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add ISP</h4>
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
                    <label className="form-label">ISP Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_name ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_name"
                      placeholder="ISP Name"
                      value={newProvider.provider_name || ""}
                    />
                    {errorMessage.provider_name && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_name[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Contact Person</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_contact_person ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_contact_person"
                      placeholder="ISP Conatct Person"
                      value={newProvider.provider_contact_person || ""}
                    />
                    {errorMessage.provider_contact_person && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_contact_person[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Address</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_address ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_address"
                      placeholder="ISP Address"
                      value={newProvider.provider_address || ""}
                    />
                    {errorMessage.provider_address && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_address[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Contact</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_contact ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_contact"
                      placeholder="ISP Contact"
                      value={newProvider.provider_contact || ""}
                    />
                    {errorMessage.provider_contact && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_contact[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Email</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_email ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_email"
                      placeholder="ISP Email"
                      value={newProvider.provider_email || ""}
                    />
                    {errorMessage.provider_email && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_email[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vendor Id</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.vendor_id ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="vendor_id"
                      placeholder="Vendor Id"
                      value={newProvider.vendor_id || ""}
                    />
                    {errorMessage.vendor_id && (
                      <div className="invalid-feedback">
                        {errorMessage.vendor_id[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="edit_Provider"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit ISP</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
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
                    <label className="form-label">ISP Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_name ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_name"
                      placeholder="ISP Name"
                      value={newProvider.provider_name || ""}
                    />
                    {errorMessage.provider_name && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_name[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Contact Person</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_contact_person ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_contact_person"
                      placeholder="ISP Conatct Person"
                      value={newProvider.provider_contact_person || ""}
                    />
                    {errorMessage.provider_contact_person && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_contact_person[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Address</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_address ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_address"
                      placeholder="ISP Address"
                      value={newProvider.provider_address || ""}
                    />
                    {errorMessage.provider_address && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_address[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Contact</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_contact ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_contact"
                      placeholder="ISP Contact"
                      value={newProvider.provider_contact || ""}
                    />
                    {errorMessage.provider_contact && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_contact[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISP Email</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.provider_email ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="provider_email"
                      placeholder="ISP Email"
                      value={newProvider.provider_email || ""}
                    />
                    {errorMessage.provider_email && (
                      <div className="invalid-feedback">
                        {errorMessage.provider_email[0]}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vendor Id</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.vendor_id ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="vendor_id"
                      placeholder="Vendor Id"
                      value={newProvider.vendor_id || ""}
                    />
                    {errorMessage.vendor_id && (
                      <div className="invalid-feedback">
                        {errorMessage.vendor_id[0]}
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

export default ProviderDetailsTable;
