import React, { useRef, useState, useEffect } from "react";
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

type ErrorMessage = {
  username?: string[];
  password?: string[];
  is_active?: string[];
};

type User = {
  username: string | null;
  id: number;
  password: string | null;
  last_login: string | null;
  is_superuser: boolean | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_staff: boolean | null;
  is_active: boolean | null;
  date_joined: boolean | null;
  groups: Array<number>;
  user_permissions: Array<number>;
  bio?: string | null;
  phone_number?: string | null;
  states?: Array<number>;
  zones?: Array<number>;
  branches?: Array<number>;
};

type Permission = { id: number; name: string };

interface Group {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
}

interface Zone {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

const Users = () => {
  const routes = all_routes;
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<User[]>([]);
  const jwtToken = Cookies.get("authToken");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { userPermissions, webApi } = useUserPermissions();
  const [currentRecord, setCurrentRecord] = useState<User | null>(null);
  const checkPermission = (action: any, subject: any) => {
    return userPermissions.some(
      (ability) => ability.action === action && ability.subject === subject
    );
  };
  const [groupName, setGroupName] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [groupsDropdown, setGroupsDropdown] = useState<Group[]>([]);
  const [chosenPermissions, setChosenPermissions] = useState<Permission[]>([]);
  const [chosenGroups, setChosenGroups] = useState<Group[]>([]);
  const [chosenStates, setChosenStates] = useState<State[]>([]);
  const [chosenZones, setChosenZones] = useState<Zone[]>([]);
  const [chosenBranches, setChosenBranches] = useState<Branch[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [availableZones, setAvailableZones] = useState<Zone[]>([]);
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [from, setFrom] = useState();
  const [to, setTo] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount,setTotalCount] = useState();

  const resetPasswordForm = () => {
    setNewPassword("");
    setConfirmPassword("");
  };

  const [profileRecord, setProfileRecord] = useState<User | null>(null);

  const [newAdmin, setNewAdmin] = useState<User>({
    user_permissions: [],
    username: null,
    id: 0,
    password: null,
    last_login: null,
    is_superuser: false,
    first_name: null,
    last_name: null,
    email: null,
    is_staff: null,
    is_active: null,
    date_joined: null,
    groups: [],
    bio: null,
    phone_number: null,
    states: [],
    zones: [],
    branches: [],
  });

  const resetForm = () => {
    setNewAdmin({
      user_permissions: [],
      username: null,
      id: 0,
      password: null,
      last_login: null,
      is_superuser: false,
      first_name: null,
      last_name: null,
      email: null,
      is_staff: null,
      is_active: false,
      date_joined: null,
      groups: [],
      bio: null,
      phone_number: null,
      states: [],
      zones: [],
      branches: [],
    });
    setEditingIndex(null);
    setErrorMessage({});
    setChosenPermissions([]);
    setChosenGroups([]);
    setCurrentRecord(null);
  };

  const resetDual = () => {
    setChosenBranches([]);
    setChosenGroups([]);
    setChosenPermissions([]);
    setChosenStates([]);
    setAvailableZones([]);
    setChosenZones([]);
    setAvailableBranches([]);
    setAvailableStates([]);
  };

  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  const fetchProviderData = async (page: number) => {
    const response = await fetch(
      `${webApi}/usermgmt/users/?page=${page}`,
      options
    );
    return await response.json();
  };

  const fetchGroupsData = async () => {
    const response = await fetch(
      `${webApi}/usermgmt/get_groups_dropdown/`,
      options
    );
    return await response.json();
  };

  const fetchStateData = async () => {
    const response = await fetch(
      `${webApi}/branches/branches_state_dropdown/`,
      options
    );
    return await response.json();
  };

  const handleStateChange = async (selected: State[]) => {
    setChosenStates(selected);
    const stateIds =
      selected.length > 0 ? selected.map((state) => state.id).join(",") : "0";

    // Fetch zones based on the selected states
    const response = await fetch(
      `${webApi}/usermgmt/get_zones_dropdown/${stateIds}/`,
      options
    );
    const data = await response.json();
    const zones = data.results.map(
      (zone: { zone_id: number; name: string }) => ({
        id: zone.zone_id,
        name: zone.name,
      })
    );

    setAvailableZones(zones);
    setChosenZones([]);
    setAvailableBranches([]);
    setChosenBranches([]);

    // Update available states
    const availableStates = states.filter(
      (state) => !selected.some((sel) => sel.id === state.id)
    );
    setAvailableStates(availableStates);
  };

  const handleZoneChange = async (selected: Zone[]) => {
    setChosenZones(selected);
    const zoneIds =
      selected.length > 0 ? selected.map((zone) => zone.id).join(",") : "0";
    const stateIds =
      chosenStates.length > 0
        ? chosenStates.map((state) => state.id).join(",")
        : "0";

    // Fetch branches based on the selected states and zones
    const response = await fetch(
      `${webApi}/usermgmt/get_branches_dropdown/${zoneIds}/`,
      options
    );
    const data = await response.json();
    const branches = data.results.map(
      (branch: { branch_id: number; name: string }) => ({
        id: branch.branch_id,
        name: branch.name,
      })
    );

    setAvailableBranches(branches);
    setChosenBranches([]);
  };

  const fetchData = async (_page: number) => {
    setIsLoading(true); // Start loading
    try {
      const [providerData, groupsData, stateData] = await Promise.all([
        fetchProviderData(_page),
        fetchGroupsData(),
        fetchStateData(),
      ]);

      setTotalPages(providerData.total_pages);
      setGroupsDropdown(groupsData.results);
      setAdmin(providerData.results);
      setFrom(providerData.from);
      setTo(providerData.to);
      setTotalCount(providerData.total_count)

      // Convert state_id to id and save the state data
      const states = stateData.results.map(
        (state: { state_id: number; name: string; is_active: boolean }) => ({
          id: state.state_id,
          name: state.name,
          is_active: state.is_active,
        })
      );
      setStates(states);
      console.log("states", states);
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
    const fetchDefaultPermissions = async () => {
      const response = await fetch(
        `${webApi}/usermgmt/get_permissions_dropdown/group_id/0/`,
        options
      );
      const data = await response.json();
      setPermissions(data.results);
    };
    fetchDefaultPermissions();
  }, []);

  useEffect(() => {
    if (!checkPermission("view", "Can view user")) {
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
        ? `${webApi}/usermgmt/users/${newAdmin.id}/`
        : `${webApi}/usermgmt/users/`;
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      setErrorMessage(errorData);
      if (errorData.is_active) {
        setShowErrorToast(true);
      } else {
        setShowErrorToast(false);
      }
      throw new Error("Network response was not ok");
    }
    setAdmin(updatedProviderDetails);
    await fetchData(currentPage);
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profileRecord) return;

    const profileData = {
      bio: profileRecord.bio,
      phone_number: profileRecord.phone_number,
      states: chosenStates.map((state) => state.id),
      zones: chosenZones.map((zone) => zone.id),
      branches: chosenBranches.map((branch) => branch.id),
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(profileData),
    };

    try {
      const url = `${webApi}/usermgmt/add_update_userprofile/${profileRecord.id}/`;
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }

      const data = await response.json();
      console.log("Profile updated successfully:", data);
      resetDual();
      const submitBtn = document.getElementById("submit-btn3");
      if (submitBtn) {
        submitBtn.setAttribute("data-bs-dismiss", "modal");
        submitBtn.click();
      }
    } catch (error) {}
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateData();
      resetForm();
      resetDual();
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

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    };

    try {
      const url = `${webApi}/usermgmt/changepassword/${userId}/`;
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update password");
      }

      const data = await response.json();
      console.log("Password updated successfully:", data);

      // Clear the input fields
      setNewPassword("");
      setConfirmPassword("");

      const submitBtn = document.getElementById("submit-btn7");
      if (submitBtn) {
        submitBtn.setAttribute("data-bs-dismiss", "modal");
        submitBtn.click();
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (currentRecord) {
      const selectedPermissions = permissions.filter((permission) =>
        currentRecord.user_permissions.includes(permission.id)
      );
      const selectedGroups = groupsDropdown.filter((group) =>
        currentRecord.groups.includes(group.id)
      );
      setNewAdmin({
        id: currentRecord.id,
        user_permissions: currentRecord.user_permissions,
        username: currentRecord.username,
        password: currentRecord.password,
        last_login: currentRecord.last_login,
        is_superuser: currentRecord.is_superuser,
        first_name: currentRecord.first_name,
        last_name: currentRecord.last_name,
        email: currentRecord.email,
        is_staff: currentRecord.is_staff,
        is_active: currentRecord.is_active,
        date_joined: currentRecord.date_joined,
        groups: currentRecord.groups,
      });
      setEditingIndex(currentRecord.id);
      setChosenPermissions(selectedPermissions);
      setChosenGroups(selectedGroups);
    }
  }, [currentRecord]);

  const editApprovalStatus = async (record: {
    username?: string | null;
    id: any;
    password?: string | null;
    last_login?: string | null;
    is_superuser?: boolean | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    is_staff?: boolean | null;
    is_active?: boolean | null;
    date_joined?: boolean | null;
    groups?: number[];
    user_permissions?: number[];
    bio?: string | null | undefined;
    phone_number?: string | null | undefined;
    states?: number[] | undefined;
    zones?: number[] | undefined;
    branches?: number[] | undefined;
  }) => {
    try {
      const response = await fetch(
        `${webApi}/usermgmt/users/${record.id}/`,
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

  const editProfile = async (record: User) => {
    try {
      const response = await fetch(
        `${webApi}/usermgmt/add_update_userprofile/${record.id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch profile data");
      }

      const data = await response.json();
      const profileData = data.data;

      // Set the fetched data as default values
      setProfileRecord({
        ...record, // Include all properties from the original record
        bio: profileData.bio,
        phone_number: profileData.phone_number,
        states: profileData.states,
        zones: profileData.zones,
        branches: profileData.branches,
      });

      // Fetch states if null
      if (profileData.states.length === 0) {
        const statesResponse = await fetch(
          `${webApi}/branches/branches_state_dropdown/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const statesData = await statesResponse.json();
        const states = statesData.results.map(
          (state: { state_id: number; name: string }) => ({
            id: state.state_id,
            name: state.name,
          })
        );

        setStates(states);
        setAvailableStates(states);
      } else {
        const selectedStates = profileData.states.map((stateId: number) => {
          const state = states.find((state) => state.id === stateId);
          return state
            ? { id: state.id, name: state.name }
            : { id: stateId, name: "" };
        });
        const availableStates = states.filter(
          (state) => !profileData.states.includes(state.id)
        );

        setChosenStates(selectedStates);
        setAvailableStates(availableStates);
      }

      // Fetch zones if states are not null
      if (profileData.states.length > 0) {
        const stateIds = profileData.states.join(",");
        const zonesResponse = await fetch(
          `${webApi}/usermgmt/get_zones_dropdown/${stateIds}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const zonesData = await zonesResponse.json();
        const zones = zonesData.results.map(
          (zone: { zone_id: number; name: string }) => ({
            id: zone.zone_id,
            name: zone.name,
          })
        );

        setZones(zones);

        if (profileData.zones.length === 0) {
          setAvailableZones(zones);
        } else {
          const selectedZones = profileData.zones.map((zoneId: any) => {
            const zone = zones.find((zone: { id: any }) => zone.id === zoneId);
            return zone
              ? { id: zone.id, name: zone.name }
              : { id: zoneId, name: "" };
          });
          const availableZones = zones.filter(
            (zone: { id: any }) => !profileData.zones.includes(zone.id)
          );

          setChosenZones(selectedZones);
          setAvailableZones(availableZones);
        }

        // Fetch branches if zones are not null
        if (profileData.zones.length > 0) {
          const zoneIds = profileData.zones.join(",");
          const branchesResponse = await fetch(
            `${webApi}/usermgmt/get_branches_dropdown/${zoneIds}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );

          const branchesData = await branchesResponse.json();
          const branches = branchesData.results.map(
            (branch: { branch_id: number; name: string }) => ({
              id: branch.branch_id,
              name: branch.name,
            })
          );

          setBranches(branches);

          if (profileData.branches.length === 0) {
            setAvailableBranches(branches);
          } else {
            const selectedBranches = profileData.branches.map(
              (branchId: any) => {
                const branch = branches.find(
                  (branch: { id: any }) => branch.id === branchId
                );
                return branch
                  ? { id: branch.id, name: branch.name }
                  : { id: branchId, name: "" };
              }
            );
            const availableBranches = branches.filter(
              (branch: { id: any }) => !profileData.branches.includes(branch.id)
            );

            setChosenBranches(selectedBranches);
            setAvailableBranches(availableBranches);
          }
        }
      }
    } catch (error) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value || null });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value === "true" });
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

  const handlePermissionsChange = async (
    selected: Permission[] | Group[],
    type: "user_permissions" | "groups"
  ) => {
    if (type === "user_permissions") {
      setChosenPermissions(selected as Permission[]);
      setNewAdmin({
        ...newAdmin,
        user_permissions: (selected as Permission[]).map(
          (permission) => permission.id
        ),
      });
    } else if (type === "groups") {
      setChosenGroups(selected as Group[]);
      setNewAdmin({
        ...newAdmin,
        groups: (selected as Group[]).map((group) => group.id),
      });
      const groupIds =
        (selected as Group[]).map((group) => group.id).join(",") || "0";
      const response = await fetch(
        `${webApi}/usermgmt/get_permissions_dropdown/group_id/${groupIds}/`,
        options
      );
      const data = await response.json();
      setPermissions(data.results);
    }
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_text: string, record: User) => (
        <div className="d-flex align-items-center">
          {checkPermission("change", "Can change user") && (
            <button
              className="btn btn-icon btn-sm btn-soft-info rounded-pill"
              onClick={() => editApprovalStatus(record)}
              data-bs-toggle="modal"
              data-bs-target="#action"
            >
              <i className="feather-edit" />
            </button>
          )}
        </div>
      ),
    },
    {
      title: "Profile",
      dataIndex: "profile",
      render: (_text: string, record: User) => (
        <div className="d-flex align-items-center">
          {checkPermission("change", "Can change user profile") && (
            <button
              className="btn btn-icon btn-sm btn-soft-info rounded-pill"
              onClick={() => editProfile(record)}
              data-bs-toggle="modal"
              data-bs-target="#profile"
            >
              <i className="feather-edit" />
            </button>
          )}
        </div>
      ),
    },
    {
      title: "Update password",
      dataIndex: "updatepassword",
      render: (_text: string, record: User) => (
        <div className="d-flex align-items-center">
          {checkPermission("change", "Can change admin") && (
            <button
              className="btn btn-icon btn-sm btn-soft-info rounded-pill"
              data-bs-toggle="modal"
              data-bs-target="#updatepassword"
              onClick={() => setUserId(record.id)}
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
              <h3 className="page-title mb-1">Users</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Users
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="mb-2">
                {checkPermission("add", "Can add user") && (
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#addUser"
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
              {/* Guardians List */}
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
              {/* /Guardians List */}
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
  .custom-modal-size { max-width: 1050px; width: auto; } 
  .light-violet-bg { background-color: #f8f9f9; } 
  .modal-body { display: flex; flex-direction: column; align-items: flex-start; max-height: 80vh; overflow-y: auto; padding: 20px; } 
  .form-group { width: 100%; max-width: 400px; margin-bottom: 20px; } 
  .dual-list-box-container { width: 100%; max-width: 1000px; margin-top: 25px;} 
  .radio-group { display: flex; justify-content: space-between; width: 100%; }
  .radio-group-item { display: flex; flex-direction: column; align-items: flex-start; }
  .radio-group-item input[type="radio"] { transform: scale(1.5); margin-right: 10px; } 
  .radio-group-item label { margin-right: 20px; }
`}
        </style>
        <div
          className="modal fade"
          id="addUser"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add User</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    resetDual();
                    resetForm();
                  }}
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
                  <div className="d-flex justify-content-between">
                    <div
                      className="form-group me-3"
                      style={{ flex: 1, marginRight: "45px" }}
                    >
                      <label className="form-label">User Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errorMessage.username ? "is-invalid" : ""
                        }`}
                        onChange={handleInputChange}
                        name="username"
                        placeholder="User Name"
                        value={newAdmin.username || ""}
                        style={{ width: "100%", minWidth: "395px" }}
                      />
                      {errorMessage.username && (
                        <div className="invalid-feedback">
                          {errorMessage.username[0]}
                        </div>
                      )}
                    </div>
                    <div
                      className="form-group ms-auto"
                      style={{ flex: 1, marginLeft: "35px" }}
                    >
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className={`form-control ${
                          errorMessage.password ? "is-invalid" : ""
                        }`}
                        onChange={handleInputChange}
                        name="password"
                        placeholder="Password"
                        value={newAdmin.password || ""}
                        style={{ width: "100%", minWidth: "395px" }}
                      />
                      {errorMessage.password && (
                        <div className="invalid-feedback">
                          {errorMessage.password[0]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="radio-group">
                    <div className="radio-group-item">
                      <label className="form-label">Is Superuser</label>
                      <div>
                        <input
                          type="radio"
                          id="is_superuser_yes"
                          name="is_superuser"
                          value="true"
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="is_superuser_yes">Yes</label>
                        <input
                          type="radio"
                          id="is_superuser_no"
                          name="is_superuser"
                          value="false"
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="is_superuser_no">No</label>
                      </div>
                    </div>
                    <div className="radio-group-item">
                      <label className="form-label">Is Active</label>
                      <div>
                        <input
                          type="radio"
                          id="is_active_yes"
                          name="is_active"
                          value="true"
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="is_active_yes">Yes</label>
                        <input
                          type="radio"
                          id="is_active_no"
                          name="is_active"
                          value="false"
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="is_active_no">No</label>
                      </div>
                      {errorMessage.is_active && (
                        <div className="invalid-feedback">
                          {errorMessage.is_active[0]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group dual-list-box-container">
                    <label className="form-label">Groups</label>
                    <DualListBox
                      options={groupsDropdown}
                      selected={chosenGroups}
                      onChange={(selected) =>
                        handlePermissionsChange(selected, "groups")
                      }
                    />
                  </div>
                  <div className="form-group dual-list-box-container">
                    <label className="form-label">User Permissions</label>
                    <DualListBox
                      options={permissions}
                      selected={chosenPermissions}
                      onChange={(selected) =>
                        handlePermissionsChange(selected, "user_permissions")
                      }
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
                    <Toast.Body>
                      {" "}
                      Is Active field may not be null.{" "}
                    </Toast.Body>{" "}
                  </Toast>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="action"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit User</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="submit-btn1"
                  // onClick={() => { resetDual(); }}
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
                    <label className="form-label">User Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errorMessage.username ? "is-invalid" : ""
                      }`}
                      onChange={handleInputChange}
                      name="username"
                      placeholder="Group Name"
                      value={newAdmin.username || ""}
                    />
                    {errorMessage.username && (
                      <div className="invalid-feedback">
                        {errorMessage.username[0]}
                      </div>
                    )}
                  </div>
                  <div className="radio-group">
                    <div className="radio-group-item">
                      <label className="form-label">Is Superuser</label>
                      <div>
                        <input
                          type="radio"
                          id="is_superuser_yes"
                          name="is_superuser"
                          value="true"
                          checked={newAdmin.is_superuser === true}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="is_superuser_yes">Yes</label>
                        <input
                          type="radio"
                          id="is_superuser_no"
                          name="is_superuser"
                          value="false"
                          checked={newAdmin.is_superuser === false}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="is_superuser_no">No</label>
                      </div>
                    </div>
                    <div className="radio-group-item">
                      <label className="form-label">Is Active</label>
                      <div>
                        <input
                          type="radio"
                          id="is_active_yes"
                          name="is_active"
                          value="true"
                          checked={newAdmin.is_active === true}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="is_active_yes">Yes</label>
                        <input
                          type="radio"
                          id="is_active_no"
                          name="is_active"
                          value="false"
                          checked={newAdmin.is_active === false}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="is_active_no">No</label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group dual-list-box-container">
                    {" "}
                    <label className="form-label">Groups</label>
                    <DualListBox
                      options={groupsDropdown}
                      selected={chosenGroups}
                      onChange={(selected) =>
                        handlePermissionsChange(selected, "groups")
                      }
                    />{" "}
                  </div>
                  <div className="form-group dual-list-box-container">
                    {" "}
                    <label className="form-label">User Permissions</label>
                    <DualListBox
                      options={permissions}
                      selected={chosenPermissions}
                      onChange={(selected) =>
                        handlePermissionsChange(selected, "user_permissions")
                      }
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

        <div
          className="modal fade"
          id="profile"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">User Profile</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    resetDual();
                  }}
                  id="submit-btn3"
                >
                  <i className="ti ti-x" />
                </button>{" "}
              </div>
              <form
                onSubmit={handleProfileSubmit}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleProfileSubmit(e);
                  }
                }}
              >
                <div className="modal-body light-violet-bg">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="phone_number"
                      placeholder="Phone Number"
                      value={
                        profileRecord ? profileRecord.phone_number || "" : ""
                      }
                      onChange={(e) =>
                        setProfileRecord(
                          profileRecord
                            ? { ...profileRecord, phone_number: e.target.value }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="form-group dual-list-box-container">
                    <label className="form-label">States</label>
                    <DualListBox
                      options={availableStates}
                      selected={chosenStates}
                      onChange={handleStateChange}
                    />
                  </div>
                  <div className="form-group dual-list-box-container">
                    <label className="form-label">Zones</label>
                    <DualListBox
                      options={availableZones}
                      selected={chosenZones}
                      onChange={handleZoneChange}
                    />
                  </div>
                  <div className="form-group dual-list-box-container">
                    <label className="form-label">Branches</label>
                    <DualListBox
                      options={availableBranches}
                      selected={chosenBranches}
                      onChange={(selected) => setChosenBranches(selected)}
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
          id="updatepassword"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div
            className="modal-dialog"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100% - 1rem)",
            }}
          >
            <div
              className="modal-content"
              style={{
                maxWidth: "900px",
                padding: "20px",
                borderRadius: "10px",
                minWidth: "600px",
              }}
            >
              <div
                className="modal-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #dee2e6",
                  borderRadius: "10px 10px 0 0",
                }}
              >
                <h4 className="modal-title">Update Password</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="submit-btn7"
                  onClick={resetPasswordForm}
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              <form id="updatePasswordForm" onSubmit={handlePasswordUpdate}>
                <div
                  className="modal-body light-violet-bg"
                  style={{ padding: "20px" }}
                >
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="new_password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        minWidth: "500px",
                        minHeight: "55px",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirm_password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        minWidth: "500px",
                        minHeight: "55px",
                      }}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      style={{ borderRadius: "5px" }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Users;
