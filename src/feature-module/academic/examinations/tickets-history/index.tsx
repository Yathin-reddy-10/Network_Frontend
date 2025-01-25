import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../../core/common/dataTable/index";
import { TableData } from "../../../../core/data/interface";
import CommonSelect, { Option } from "../../../../core/common/commonSelect";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import Cookies from "js-cookie";
import 'react-dual-listbox/lib/react-dual-listbox.css'
import 'react-dual-listbox/lib/react-dual-listbox.css';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useUserPermissions } from "../../../UserPermissionsContext";

type Exam = {
    ticket_id: number | null; state: number | null, zone: number | null, state_name: any; zone_name: any; branch_name: any; ticket_number: any, caller: any; category: number | null, channel: number | null, impact: number | null, urgency: number | null, servicetype_name: any, subcategory_name: string | null; created_by: string | null; priority: string | null; impact_name: string | null; urgency_name: string | null, priority_name: string | null; Short_description: string | null, description: string | null; created_at: string; AssignedTo: number | null, category_name: string | null; subcategory: number | null; payment_status: any, branch: number | null, color: string; resolution_notes: string | null; resolved_by: string | null;  part_waranty_status: string | null; reported_problem: string | null;  updated_by: string; updated_at: string; state_of_ticket: number;
};
const Tickets = () => {
    const routes = all_routes;
    const [exams, setExams] = useState<Exam[]>([]);
    const jwtToken = Cookies.get('authToken');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
    const defaultValue = dayjs(formattedDate);

        const [newExam, setNewExam] = useState<Exam>({
           ticket_id: null, state: null, zone: null, state_name: '', zone_name: '', branch_name: '', ticket_number: '', caller: '', category: null, channel: null, impact: null, urgency: null, servicetype_name: '', subcategory_name: '', created_by: '', priority: '', impact_name: '', urgency_name: '', priority_name: '', Short_description: '', description: '', created_at: '', AssignedTo: null, category_name: '', subcategory: null, payment_status: '', branch: null, color: '', resolution_notes: '', resolved_by: '', part_waranty_status: '', reported_problem: '', updated_by: 'mohan', updated_at: '2024-11-12 09:52:50', state_of_ticket: 2
        });
    const resetForm = () => {
        setNewExam({
           ticket_id: null, state: null, zone: null, state_name: '', zone_name: '', branch_name: '', ticket_number: '', caller: '', category: null, channel: null, impact: null, urgency: null, servicetype_name: '', subcategory_name: '', created_by: '', priority: '', impact_name: '', urgency_name: '', priority_name: '', Short_description: '', description: '', created_at: '', AssignedTo: null, category_name: '', subcategory: null, payment_status: '', branch: null, color: '', resolution_notes: '', resolved_by: '',  part_waranty_status: '', reported_problem: '', updated_by: 'mohan', updated_at: '2024-11-12 09:52:50', state_of_ticket: 2
        });
        setEditingIndex(null);
        setResetSelect((prev) => !prev)
    };
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [resetSelect, setResetSelect] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [startTime, setStartTime] = useState<string | null>('10:00');
    const [endTime, setEndTime] = useState<string | null>('12:00');
    const [subjectsDropdown, setSubjectsDropdown] = useState([]);
    const [time, setTime] = useState('09:00:00');
    const [provider, setProvider] = useState([]);
    const [branches, setBranches] = useState([]);
    const webApi = 'http://10.30.31.218:8000';
    const [errors, setErrors] = useState({});
    const [currentRecord, setCurrentRecord] = useState<Exam | null>(null);
    const [approvalStatus, setAprrovalStatus] = useState([]);
    const [state, setState] = useState([]);
    const [zone, setZone] = useState([]);
    const [selectedState, setSelectedState] = useState<number | null>(null);
    const [selectedZone, setSelectedZone] = useState<number | null>(null);
    const { userPermissions } = useUserPermissions();
    const [channels, setChannels] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [assignedTo, setAssignedTo] = useState([]);
    const [category, setCategory] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [from,setFrom] = useState();
    const [to, setTo] = useState<number>();
    const checkPermission = (action: any, subject: any) => { return userPermissions.some(ability => ability.action === action && ability.subject === subject); };

    useEffect(() => {
        const fetchData = async (_page: number) => {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
            };
            const examsResponse = await fetch(`http://10.30.31.218:8000/tickets/tickets/?page=${_page}`, options);
            const providerResponse = await fetch(`${webApi}/provider/provider_details_dropdown/`, options);
            // const branchesResponse = await fetch(`${webApi}//branches/branches_branches_dropdown/1/1/`, options);
            const approvalResponse = await fetch(`${webApi}//provider/approval_status_dropdown/`, options)
            const channelResponse = await fetch(`${webApi}//tickets/channels/`, options)
            const serviceTypeResponse = await fetch(`${webApi}//tickets/service-types/`, options)
            const assignedToResonnse = await fetch(`${webApi}//tickets/user_names/`, options)
            const categoryResponse = await fetch(`${webApi}//tickets/categories/`, options)


            const categoryData = await categoryResponse.json()
            const AssignedToData = await assignedToResonnse.json();
            const serviceTypeData = await serviceTypeResponse.json();
            const providerData = await providerResponse.json();
            // const branchesData = await branchesResponse.json();
            const approvalData = await approvalResponse.json();
            const channelsData = await channelResponse.json();

            setCategory((categoryData.map((item: { category_id: number, name: any, has_sub_category: any }) => ({ value: item.name, label: item.name, id: item.category_id, idName: 'category', name: 'category_name', 'hasSubCategory': item.has_sub_category }))))
            setAssignedTo(AssignedToData.map((item: { id: number, username: any }) => ({ value: item.username, label: item.username, id: item.id, idName: 'AssignedTo', name: 'AssignedTo_name' })))
            setServiceTypes(serviceTypeData.map((item: { service_id: number, name: any }) => ({ value: item.name, label: item.name, id: item.service_id, idName: 'servicetype', name: 'servicetype_name' })))
            setProvider(providerData.map((item: { provider_id: number, name: any, label: any }) => ({ value: item.name, label: item.label, id: item.provider_id, idName: 'ISP_provider', name: 'ISP_provider_name' })));
            // setBranches(branchesData.results.map((item: { branch_id: number, name: any, label: any }) => ({ value: item.name, label: item.label, id: item.branch_id, idName: 'branch', name: 'branch_name' })))
            setAprrovalStatus(approvalData.map((item: { id: number, name: any, label: any }) => ({ value: item.name, label: item.label, id: item.id, idName: 'approval_status', name: 'approval_status_name' })))
            setChannels(channelsData.map((item: { channel_id: number, name: any, }) => ({ value: item.name, label: item.name, id: item.channel_id, idName: 'channel', name: 'channel_name' })))
            const examsData = await examsResponse.json();
            setTotalPages(examsData.total_pages);
            console.log(examsData);
            setExams(examsData.results.data);
            setFrom(examsData.from);
            setTo(examsData.to);
        };
        fetchData(currentPage);
    }, [currentPage, newExam]);

    const fetchSubCategories = async (selectedCategoryId: number) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
        };
        const response = await fetch(`http://10.30.31.218:8000//tickets/subcategory_dropdown/${selectedCategoryId}/`, options);
        const stateData = await response.json();
        setSubCategory(stateData.results.map((item: { sub_category_id: number; name: any; }) => ({ value: item.name, label: item.name, id: item.sub_category_id, idName: 'subcategory', name: 'subcategory_name', })));
    };

    const fetchStates = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
        };
        const response = await fetch('http://10.30.31.218:8000/branches/branches_state_dropdown/', options);
        const stateData = await response.json();
        setState(stateData.results.map((item: { name: any; label: any; state_id: any; }) => ({ value: item.name, label: item.label, id: item.state_id, idName: 'state', name: 'state_name', })));
    };

    const fetchZones = async (stateId: number) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
        };
        const response = await fetch(`http://10.30.31.218:8000/branches/branches_zone_dropdown/${stateId}/`, options);
        const zonesData = await response.json();
        setZone(zonesData.results.map((item: { name: any; label: any; zone_id: any; }) => ({ value: item.name, label: item.label, id: item.zone_id, idName: 'zone', name: 'zone_name', })));
    };

    const fetchBranches = async (stateId: number, zoneId: number) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
        };
        const response = await fetch(`http://10.30.31.218:8000/branches/branches_branches_dropdown/${stateId}/${zoneId}/`, options);
        const branchesData = await response.json();
        setBranches(branchesData.results.map((item: { name: any; label: any; branch_id: any; }) => ({ value: item.name, label: item.label, id: item.branch_id, idName: 'branch', name: 'branch_name', })));
    };

    useEffect(() => {
        if (selectedCategoryId !== null && 'hasSubCategory') {
            fetchSubCategories(selectedCategoryId)
        }
    }, [selectedCategoryId])

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
        }
    }, [selectedZone]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Define the required fields
        // const requiredFields: (keyof Exam)[] = [];

        // // Check if all required fields are filled
        // let isFormValid = requiredFields.every(field => newExam[field]);
        // if (!isFormValid) {
        //   alert('Please fill in all required fields.');
        //   return;
        // }

        console.log(newExam);

        const updatedExams = editingIndex !== null
            ? exams.map((exam, index) =>
                index === editingIndex
                    ? { ...newExam } : exam
            )
            : [...exams, { ...newExam }]; // Add new exam

        console.log(updatedExams);

        try {
            const requestOptions = {
                method: editingIndex !== null ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(newExam)
            };
            const url = editingIndex !== null
                ? `${webApi}//tickets/tickets/${newExam.ticket_id}/`
                : `${webApi}//tickets/tickets/`;
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                const errData = await response.json()
                setErrors(errData)
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Success:', data);
            setExams(updatedExams);
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
            console.error('Error submitting form:', error);
        }
    };

    const editExam = (record: Exam) => {
        setCurrentRecord(record);
    };


    useEffect(() => {
        if (currentRecord) {
            //   setNewExam({
            //     state_name: currentRecord.state_name,
            //     zone_name: currentRecord.zone_name,
            //     branch_name: currentRecord.branch_name,
            //     branch: currentRecord.branch,
            //     color: currentRecord.color,
            //     state:currentRecord.state,
            //     zone: currentRecord.zone
            //   });
            setEditingIndex(currentRecord.ticket_id);
        }
    }, [currentRecord])




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewExam({ ...newExam, [name]: value || null });
    };

    const handleSelectChange = (option: Option | null, idName: string, name: string) => {
        setNewExam((prev) => ({
            ...prev,
            [idName]: option ? option.id : "",
            [name]: option ? option.value : "",
        }));
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
    const camAddTicket = checkPermission("add", "ticket");

    const columns = [
        {
            title: "Solve Ticket",
            dataIndex: "action",
            render: (_text: string, record: Exam) => (
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-icon btn-sm btn-soft-info rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target="#solve_ticket"
                        type="button"
                    >
                        <i className="fas fa-ticket"></i>
                    </button>
                </div>
            ),
        },
        {
            title: "Ticket Number",
            dataIndex: "ticket_number",
            sorter: (a: Exam, b: Exam) => a.branch_name.localeCompare(b.branch_name), ender: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "State",
            dataIndex: "state_name",
            sorter: (a: Exam, b: Exam) => a.branch_name.localeCompare(b.branch_name), ender: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Zone",
            dataIndex: "zone_name",
            sorter: (a: Exam, b: Exam) => a.branch_name.localeCompare(b.branch_name), ender: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Branch Name",
            dataIndex: "branch_name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Caller",
            dataIndex: "caller",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },

        {
            title: "Channel",
            dataIndex: "channel_name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Service Type",
            dataIndex: "servicetype_name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Created By",
            dataIndex: "created_by",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,

            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        }, {
            title: "Assigned To",
            dataIndex: "AssignedTo_name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Category",
            dataIndex: "category_name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Sub Category",
            dataIndex: "subcategory_name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Short Note",
            dataIndex: "Short_description",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
            render: (text: string, record: Exam) => (
                <span style={{ color: `${record.color}` }}>{text}</span>
            ),
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
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
        <div style={{ backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)', minHeight: '100vh', overflowY: 'auto', overflowX: 'auto' }}>
            <div className="page-wrapper" >
                <div className="content" style={{ backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)', minHeight: '99%', margin: '5px', marginTop: '15px', position: 'relative', maxWidth: '99%', overflowY: 'auto', overflowX: 'auto' }}>
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
                                {camAddTicket && (<button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add_Connection" type="button" > <i className="ti ti-square-rounded-plus-filled me-2" /> Add Ticket</button>)}
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
                            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '70vh' }}>
                                <Table
                                    columns={columns}
                                    dataSource={exams}
                                    Selection={true}
                                    handleNextPage={handleNextPage}
                                    handlePreviousPage={handlePreviousPage}
                                    currentpage={currentPage}
                                    from = {from}
                                    to = {to}
                                />
                            </div>
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
                <div className="modal fade" id="add_Connection" tabIndex={-1} aria-hidden="true">
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
                            <form onSubmit={handleSubmit} onKeyPress={(e) => { if (e.key === 'Enter') { handleSubmit(e); } }}>
                                <div className="modal-body light-violet-bg">
                                    <div className="mb-3">
                                        <label className="form-label">State</label>
                                        <CommonSelect
                                            className="select"
                                            options={state}
                                            onChange={(option) => {
                                                handleSelectChange(option, "state", "state_name");
                                                handleStateChange(option);
                                            }}
                                            reset={resetSelect}
                                        />
                                    </div> <div className="mb-3">
                                        <label className="form-label">Zone</label>
                                        <CommonSelect
                                            className="select"
                                            options={zone} onChange={(option) => { handleSelectChange(option, "zone", "zone_name"); handleZoneChange(option); }}
                                            reset={resetSelect}
                                            disabled={!selectedState}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Branch Name</label>
                                        <CommonSelect
                                            className="select"
                                            options={branches} onChange={(option) => handleSelectChange(option, "branch", "branch_name")}
                                            reset={resetSelect}
                                            disabled={!selectedZone}
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
                                            options={channels} onChange={(option) => handleSelectChange(option, "channel", "channel_name")}
                                            reset={resetSelect}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Service Type</label>
                                        <CommonSelect
                                            className="select"
                                            options={serviceTypes} onChange={(option) => handleSelectChange(option, "servicetype", "servicetype_name")}
                                            reset={resetSelect}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Assigned To</label>
                                        <CommonSelect
                                            className="select"
                                            options={assignedTo} onChange={(option) => handleSelectChange(option, "AssignedTo", "AssignedTo_name")}
                                            reset={resetSelect}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Category</label>
                                        <CommonSelect
                                            className="select"
                                            options={category} onChange={(option) => { handleSelectChange(option, "category", "category_name"); handleCategoryChange(option); }}
                                            reset={resetSelect}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Sub Category</label>
                                        <CommonSelect
                                            className="select"
                                            options={subCategory} onChange={(option) => { handleSelectChange(option, "subcategory", "subcategory_name"); handleCategoryChange(option); }}
                                            reset={resetSelect}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Short Note</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            onChange={handleInputChange}
                                            name="Short_description"
                                            placeholder="Short Note"
                                            value={newExam.Short_description || ''}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            onChange={handleInputChange}
                                            name="description"
                                            placeholder="Description"
                                            value={newExam.description || ''}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary" type="submit">
                                        Add Ticket
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
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
                <div className="modal fade" id="solve_ticket" tabIndex={-1} aria-hidden="true">
                    <div className="modal-dialog custom-modal-size">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Solve Ticket</h4>
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
                                        <label className="form-label">Resolution Notes</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            onChange={handleInputChange}
                                            name="resolution_notes"
                                            placeholder="Resolution Notes"
                                            value={newExam.resolution_notes || ''}
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

                {/* Edit Payment Due */}
                {/* Delete Modal */}
                <div className="modal fade" id="delete-modal">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <form >
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
                                        <Link to="#" data-bs-dismiss="modal" className="btn btn-danger">
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