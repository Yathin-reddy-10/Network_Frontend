import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../../core/common/dataTable/index";
import CommonSelect, { Option } from "../../../../core/common/commonSelect";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import Cookies from "js-cookie";
import 'react-dual-listbox/lib/react-dual-listbox.css'
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useUserPermissions } from "../../../UserPermissionsContext";
import BigNumber from "bignumber.js";

type ErrorMEssage = {
    name?: string[],
}


type Billing = {
    company: string | null,
    id: number,
}

const BillingCompanyTable = () => {
    const routes = all_routes;
    const navigate = useNavigate();
    const [billingCompany, setBillingCompany] = useState<Billing[]>([]);
    const jwtToken = Cookies.get('authToken');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<ErrorMEssage>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { userPermissions,webApi } = useUserPermissions();
    const [currentRecord, setCurrentRecord] = useState<Billing | null>(null);
    const [from,setFrom] = useState();
    const [to, setTo] = useState<number>();
    const [totalCount,setTotalCount] = useState();
    const checkPermission = (action: any, subject: any) => { return userPermissions.some(ability => ability.action === action && ability.subject === subject); };

    const [newBillingCompany, setNewBillingCompany] = useState<Billing>({
      company: null, id: 0,
    })

    const resetForm = () => {
        setNewBillingCompany({
            company: null, id: 0,
        })
        setEditingIndex(null);
        setErrorMessage({})
    }

    const fetchProviderData = async (page: number) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
        };
        const response = await fetch(`${webApi}/provider/billing_companies/?page=${page}`, options);
        return await response.json();
    }

    const fetchData = async (_page: number) => {
        try {
            const [providerData] = await Promise.all([
                fetchProviderData(_page)
            ]);
            setTotalPages(providerData.total_pages)
            setBillingCompany(providerData.results.data)
            setFrom(providerData.from);
            setTo(providerData.to);
            setTotalCount(providerData.total_count)
        }
        catch (error) {
            console.error('Error fetching data', error)
        }
    };

    useEffect(() => { if (!checkPermission("view", "Can view billing company")) { Cookies.remove('authToken'); navigate('/login'); } else { fetchData(currentPage); } }, [currentPage, userPermissions, navigate])

    const updateData = async () => {
        const updatedProviderDetails = editingIndex !== null ? billingCompany.map((billingCompany, index) => index == editingIndex ? { ...newBillingCompany } : billingCompany) : [...billingCompany, { ...newBillingCompany }];
        const requestOptions = {
            method: editingIndex !== null ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(newBillingCompany)
        };
        const url = editingIndex !== null ? `${webApi}/provider/billing_companies/${newBillingCompany.id}/` : `${webApi}/provider/billing_companies/`;
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            const errorData = await response.json();
            setErrorMessage(errorData);
            throw new Error('Network response was not ok');
        }
        setBillingCompany(updatedProviderDetails);
        await fetchData(currentPage);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateData();
            resetForm();
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.setAttribute('data-bs-dismiss', 'modal');
                submitBtn.click();
            }
            const submitBtn1 = document.getElementById('submit-btn1');
            if (submitBtn1) {
                submitBtn1.setAttribute('data-bs-dismiss', 'modal');
                submitBtn1.click();
            }
        }
        catch (error) {

        }
    };

    const editApprovalStatus = (record: Billing) => {
        setCurrentRecord(record);
    }

    useEffect(() => {
        if (currentRecord) {
            setNewBillingCompany({
                id: currentRecord.id, company: currentRecord.company
            })
            setEditingIndex(currentRecord.id)
        }
    },[currentRecord])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewBillingCompany({ ...newBillingCompany, [name]: value || null });
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
        //     title: "Id",
        //     dataIndex: "id"
        // },
        {
            title: "Name",
            dataIndex: "company",
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_text: string, record: Billing) => (
              <div className="d-flex align-items-center">
                {checkPermission("change", "Can change billing company") && (
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

    ]

    return (
        <div style={{ backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)', minHeight: '100vh', overflowY: 'auto', overflowX: 'auto' }}>
            <div className="page-wrapper" >
                <div className="content" style={{ backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)', minHeight: '99%', margin: '5px', marginTop: '15px', position: 'relative', maxWidth: '99%', overflowY: 'auto', overflowX: 'auto' }}>
                    {/* Page Header */}
                    <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                        <div className="my-auto mb-2">
                            <h3 className="page-title mb-1">Billing Companies</h3>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to={routes.adminDashboard}>Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                    Billing Companies
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                            <div className="mb-2">
                            {checkPermission("add", "Can add billing company") && (<button className="btn btn-primary" data-bs-toggle="modal" onClick={resetForm} data-bs-target="#add_Approaval" type="button" > <i className="ti ti-square-rounded-plus-filled me-2" /> Add New</button>)}
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
                            <div style={{ overflowX: 'auto' }}>
                                <Table
                                    columns={columns}
                                    dataSource={billingCompany}
                                    Selection={true}
                                    handleNextPage={handleNextPage}
                                    handlePreviousPage={handlePreviousPage}
                                    currentpage={currentPage}
                                    from = {from}
                                    to = {to}
                                    totalCount = {totalCount}
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
                <div className="modal fade" id="add_Approaval" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog custom-modal-size">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Billing Company</h4>
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
                            <form onSubmit={handleSubmit} onKeyPress={(e) => { if (e.key === 'Enter') { handleSubmit(e); } }}>
                                <div className="modal-body light-violet-bg">
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorMessage.name ? 'is-invalid' : ''}`}
                                            onChange={handleInputChange}
                                            name="company"
                                            placeholder="Name"
                                            value={newBillingCompany.company || ''}
                                        />
                                        {errorMessage.name && (
                                            <div className="invalid-feedback">{errorMessage.name[0]}</div>
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
                <div className="modal fade" id="edit_Provider" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog custom-modal-size">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Edit Billing Company</h4>
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
                            <form onSubmit={handleSubmit} onKeyPress={(e) => { if (e.key === 'Enter') { handleSubmit(e); } }}>
                                <div className="modal-body light-violet-bg">
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errorMessage.name ? 'is-invalid' : ''}`}
                                            onChange={handleInputChange}
                                            name="company"
                                            placeholder="Name"
                                            value={newBillingCompany.company || ''}
                                        />
                                        {errorMessage.name && (
                                            <div className="invalid-feedback">{errorMessage.name[0]}</div>
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
    )
}

export default BillingCompanyTable