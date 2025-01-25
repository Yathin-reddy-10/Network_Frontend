import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../core/common/dataTable/index";
import { all_routes } from "../../../router/all_routes";
import Cookies from "js-cookie";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { useUserPermissions } from "../../../UserPermissionsContext";
import DualListBox from "../../../dualListBox";
import { Toast } from "react-bootstrap";

type ErrorMEssage = {
  name?: string[];
};

type Admin = {
  permissions: Array<number>;
  name: string | null;
  id: number;
};

type Permission = { id: number; name: string };

const Groups = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin[]>([]);
  const jwtToken = Cookies.get("authToken");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMEssage>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { userPermissions, webApi } = useUserPermissions();
  const [currentRecord, setCurrentRecord] = useState<Admin | null>(null);
  const checkPermission = (action: any, subject: any) => {
    return userPermissions.some(
      (ability) => ability.action === action && ability.subject === subject
    );
  };
  const [chosenPermissions, setChosenPermissions] = useState<Permission[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [from, setFrom] = useState();
  const [to, setTo] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount,setTotalCount] = useState();
  const [newAdmin, setNewAdmin] = useState<Admin>({
    name: null,
    id: 0,
    permissions: [],
  });

  const resetForm = () => {
    setNewAdmin({
      name: null,
      id: 0,
      permissions: [],
    });
    setEditingIndex(null);
    setErrorMessage({});
    setChosenPermissions([]);
  };

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  const fetchProviderData = async (page: number) => {
    const response = await fetch(
      `${webApi}/usermgmt/usergroup/?page=${page}`,
      options
    );
    return await response.json();
  };

  const fetchPermissionsData = async () => {
    const resposne = await fetch(
      `${webApi}/usermgmt/get_permissions_dropdown/`,
      options
    );
    return await resposne.json();
  };

  const fetchData = async (_page: number) => {
    setIsLoading(true); // Start loading
    try {
      const [providerData, permissionsData] = await Promise.all([
        fetchProviderData(_page),
        fetchPermissionsData(),
      ]);
      setTotalPages(providerData.total_pages);
      setPermissions(permissionsData.results);
      setAdmin(providerData.results);
      setFrom(providerData.from);
      setTo(providerData.to);
      setTotalCount(providerData.total_count)
      setToastMessage(providerData.message || "submitted successfully!");
      setShowSuccessToast(true);
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
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  useEffect(() => {
    if (!checkPermission("view", "Can view group")) {
      Cookies.remove("authToken");
      navigate("/login");
    } else {
      fetchData(currentPage);
    }
  }, [currentPage, userPermissions, navigate]);

  const updateData = async () => {
    const updatedProviderDetails =
      editingIndex !== null
        ? admin.map((admin, index) =>
            index == editingIndex ? { ...newAdmin } : admin
          )
        : [...admin, { ...newAdmin }];
    const requestOptions = {
      method: editingIndex !== null ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(newAdmin),
    };
    const url =
      editingIndex !== null
        ? `${webApi}/usermgmt/usergroup/${newAdmin.id}/`
        : `${webApi}/usermgmt/usergroup/`;
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      setErrorMessage(errorData);
      throw new Error("Network response was not ok");
    }
    setAdmin(updatedProviderDetails);
    await fetchData(currentPage);
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

  const editApprovalStatus = async (record: Admin) => {
    try {
      const response = await fetch(
        `${webApi}/usermgmt/usergroup/${record.id}/`,
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCurrentRecord(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currentRecord) {
      const selectedPermissions = permissions.filter((permission) =>
        currentRecord.permissions.includes(permission.id)
      );
      setNewAdmin({
        id: currentRecord.id,
        name: currentRecord.name,
        permissions: currentRecord.permissions,
      });
      setChosenPermissions(selectedPermissions);
      setEditingIndex(currentRecord.id);
    }
  }, [currentRecord, permissions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value || null });
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

  const handlePermissionsChange = (selected: Permission[]) => {
    setChosenPermissions(selected);
    setNewAdmin({
      ...newAdmin,
      permissions: selected.map((permission) => permission.id),
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_text: string, record: Admin) => (
        <div className="d-flex align-items-center">
          {checkPermission("change", "Can change group") && (
            <button
              className="btn btn-icon btn-sm btn-soft-info rounded-pill"
              onClick={() => editApprovalStatus(record)}
              data-bs-toggle="modal"
              data-bs-target="#edit_Provider"
            >
              <i className="feather-edit" />
            </button>
          )}
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
              <h3 className="page-title mb-1">Groups</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Groups
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="mb-2">
                {checkPermission("add", "Can add group") && (
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    onClick={resetForm}
                    data-bs-target="#add_Approaval"
                    type="button"
                  >
                    {" "}
                    <i className="ti ti-square-rounded-plus-filled me-2" /> Add
                    New
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
            `}
          </style>
          <div className="styled-card">
            <div className="card-body p-0 py-3">
              {isLoading ? (
                <Loader />
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <Table
                    columns={columns}
                    dataSource={admin}
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
            </div>
          </div>
          {/* /Guardians List */}
        </div>
      </div>
      <>
        {/* /Add Connection */}
        <style>
          {" "}
          {` 
                .custom-modal-size { max-width: 1100px; width: auto; } 
                .light-violet-bg { background-color: #f8f9f9; } 
                .modal-body { display: flex; flex-direction: column; align-items: flex-start; /* Align items to the start (left) */ max-height: 80vh; overflow-y: auto; padding: 20px; /* Add padding for better spacing */ } 
                .form-group { width: 100%; max-width: 400px; margin-bottom: 20px; } 
                .dual-list-box-container { width: 100%; max-width: 1000px; } 
                `}
        </style>

        <div
          className="modal fade"
          id="add_Approaval"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Group</h4>
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
                  <div className="form-group">
                    <label className="form-label">Group Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.name ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="name"
                      placeholder="Group Name"
                      value={newAdmin.name || ""}
                    />
                    {errorMessage.name && (
                      <div className="invalid-feedback">
                        {errorMessage.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="form-group dual-list-box-container">
                    <label className="form-label">Permissions</label>
                    <DualListBox
                      options={permissions}
                      selected={chosenPermissions}
                      onChange={handlePermissionsChange}
                    />
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

        <div
          className="modal fade"
          id="edit_Provider"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Admin Details</h4>
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
                  <div className="form-group">
                    <label className="form-label">Group Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.name ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="name"
                      placeholder="Name"
                      value={newAdmin.name || ""}
                    />
                    {errorMessage.name && (
                      <div className="invalid-feedback">
                        {errorMessage.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="form-group dual-list-box-container">
                    {" "}
                    <label className="form-label">Permissions</label>
                    <DualListBox
                      options={permissions}
                      selected={chosenPermissions}
                      onChange={handlePermissionsChange}
                    />{" "}
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
          {" "}
          <Toast.Body> {toastMessage} </Toast.Body>{" "}
        </Toast>
      </>
    </div>
  );
};

export default Groups;
