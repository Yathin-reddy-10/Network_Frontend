import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Table from "../../../../core/common/dataTable/index";
import {
    examOne,
    examtwo,
} from "../../../../core/common/selectoption/selectoption";
import PredefinedDateRanges from "../../../../core/common/datePicker";
import { TableData } from "../../../../core/data/interface";
import CommonSelect, { Option } from "../../../../core/common/commonSelect";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import { all_routes } from "../../../router/all_routes";
import TooltipOption from "../../../../core/common/tooltipOption";
import Cookies from "js-cookie";
import 'react-dual-listbox/lib/react-dual-listbox.css'
import DualListBox from 'react-dual-listbox';
type Exam = {
    name: string,
    description: string,
};

const Branches = () => {
    const routes = all_routes;
    const [examTypes, setExamTypes] = useState<Exam[]>([]);
    const [examTypesDropdown, setExamTypesDropdown] = useState<any>([]);
    const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
    const [orientationsDropdown, setOrientationsDropdown] = useState<any>([]);
    const [classesDropdown, setClassesDropdown] = useState([]);
    const jwtToken = Cookies.get('authToken');
    const dropdownMenuRef = useRef<HTMLDivElement | null>(null);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const defaultValue = dayjs(formattedDate); // Updated to the desired date
    const [newExam, setNewExam] = useState({ name: '', description: '' })
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [orientationSelected, setOrientationSelected] = useState([]);
    const [classesSelected, setClassesSelected] = useState([]);
    const [resetSelect, setResetSelect] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sectionsDropdown, setSectionsDropdown] = useState([]);
    const [statesDropdown, setStatesDropdown] = useState([]);
    const [zonesDropdown, setZonesDropdown] = useState([]);
    const [branchesDropdown, setBranchesDropdown] = useState([]);

    useEffect(() => {
        const fetchData = async (_page: number) => {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
            };
            const examsResponse = await fetch(`http://10.10.8.14/branch/branches_branches/`, options);
            const academicYear = await fetch(`http://10.10.8.14/branch/branches_academic_year_dropdown/`, options);
            const classes = await fetch(`http://10.10.8.14/branch/branches_class_name_dropdown/`, options);
            const sections = await fetch(`http://10.10.8.14/branch/branches_section_dropdown/`, options);
            const orientations = await fetch(`http://10.10.8.14/branch/branches_orientation_dropdown/`, options);
            const states = await fetch(`http://10.10.8.14/branch/branches_state_dropdown/`, options);
            const zones = await fetch(`http://10.10.8.14/branch/branches_zone_dropdown/1/`, options);
            const branches = await fetch(`http://10.10.8.14/branch/branches_branches_dropdown/1/1/`, options);
            const examsData = await examsResponse.json();
            const academicYearData = await academicYear.json();
            const classesData = await classes.json();
            const sectionsData = await sections.json();
            const orientationsData = await orientations.json();
            const statesData = await states.json();
            const zonesData = await zones.json();
            const branchesData = await branches.json();
            setTotalPages(examsData.total_pages);
            console.log(examsData);
            setExamTypes(examsData.results);
            setAcademicYearDropdown(academicYearData.results.map((item: { name: any; label: any; }) => ({ value: item.name, label: item.label })));
            setClassesDropdown(classesData.results.map((item: { name: any; label: any; }) => ({ value: item.name, label: item.label })));
            setSectionsDropdown(sectionsData.results.map((item: { name: any; label: any; }) => ({ value: item.name, label: item.label })));
            setOrientationsDropdown(orientationsData.results.map((item: { name: any; label: any; }) => ({ value: item.name, label: item.label })));
            setStatesDropdown(statesData.results.map((item: { name: any; label: any; }) => ({ value: item.name, label: item.label })));
            setZonesDropdown(zonesData.results.map((item: { name: any; label: any; }) => ({ value: item.name, label: item.label })));
            setBranchesDropdown(branchesData.results.map((item: { name: any; label: any; }) => ({ value: item.name, label: item.label })));
        };
        fetchData(currentPage);
    }, [currentPage, jwtToken]);



    const openModal = () => setModalIsOpen(true);

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedExams = editingIndex !== null
            ? examTypes.map((exam, index) =>
                index === editingIndex
                    ? { ...newExam } // Update the existing exam
                    : exam
            )
            : [...examTypes, { ...newExam }]; // Add new exam

        setExamTypes(updatedExams);
        resetForm();
        closeModal();
    };

    const editExam = (record: Exam, index: number) => {
        setNewExam({
            name: record.name,
            description: record.description,
        });
        setEditingIndex(index);
        openModal();
    };

    const resetForm = () => {
        setNewExam({
            name: '', description: ''
        });
        setOrientationSelected([]);
        setClassesSelected([]);
        setEditingIndex(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewExam({ ...newExam, [name]: value });
    };

    const handleSelectChange = (option: Option | null, label: any) => {
        setNewExam((prev) => ({
            ...prev,
            [label]: option ? option.value : "",
        }));
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
            [field]: date ? date.format("YYYY-MM-DD") : "", // Format the date to YYYY-MM-DD
        }));
    };


    const handleApplyClick = () => {
        if (dropdownMenuRef.current) {
            dropdownMenuRef.current.classList.remove("show");
        }
    };
    const getModalContainer = () => {
        const modalElement = document.getElementById("modal-datepicker");
        return modalElement ? modalElement : document.body; // Fallback to document.body if modalElement is null
    };
    const columns = [
        {
            title: "ID",
            dataIndex: "branch_id",
            render: (_text: string, record: any) => (
                <>
                    <Link to="#" className="link-primary">
                        {record.branch_id}
                    </Link>
                </>
            ),
            sorter: (a: any, b: any) => a.id.length - b.id.length,
        },
        {
            title: "State",
            dataIndex: "state_name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Zone",
            dataIndex: "zone_name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Devision",
            dataIndex: "academic_devision_names",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Class",
            dataIndex: "class_names",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Orientation",
            dataIndex: "orientation_names",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Branch",
            dataIndex: "name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Code",
            dataIndex: "building_code",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Incharge",
            dataIndex: "location_incharge",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Exam Types",
            dataIndex: "name",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "phone",
            dataIndex: "phonenumber",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "City",
            dataIndex: "city",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "address",
            dataIndex: "address",
            sorter: (a: TableData, b: TableData) =>
                a.examName.length - b.examName.length,
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (_text: string, record: Exam, index: number) => (
                <>
                    <div className="d-flex align-items-center">
                        <div className="dropdown">
                            <Link
                                to="#"
                                className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="ti ti-dots-vertical fs-14" />
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-right p-3">
                                <li>
                                    <button
                                        className="dropdown-item rounded-1"
                                        onClick={() => editExam(record, index)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#edit_exam"
                                    >
                                        <i className="ti ti-edit-circle me-2" />
                                        Edit
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item rounded-1"
                                        onClick={() => setExamToDelete(record)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#delete-modal"
                                    >
                                        <i className="ti ti-trash-x me-2" />
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            ),
        },
    ];
    return (
        <div>
            <div className="page-wrapper">
                <div className="content">
                    {/* Page Header */}
                    <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
                        <div className="my-auto mb-2">
                            <h3 className="page-title mb-1">Branches</h3>
                            <nav>
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        {/* <Link to={routes.adminDashboard}>Dashboard</Link> */}
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="#">Academic </Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Branch
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                            <TooltipOption />
                            <div className="mb-2">
                                <button
                                    className="btn btn-primary"
                                    // data-bs-toggle="modal"
                                    // data-bs-target="#add_exam"
                                    onClick={openModal}
                                    type="button"
                                >
                                    <i className="ti ti-square-rounded-plus-filled me-2" />
                                    Add Branch
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    {/* Guardians List */}
                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                            <h4 className="mb-3">Branches List</h4>
                            <div className="d-flex align-items-center flex-wrap">

                            </div>
                        </div>
                        <div className="card-body p-0 py-3">
                            {/* Guardians List */}
                            <Table columns={columns} dataSource={examTypes} Selection={true} handleNextPage={handleNextPage} handlePreviousPage={handlePreviousPage} currentpage={currentPage} />

                            {/* /Guardians List */}
                        </div>
                    </div>
                    {/* /Guardians List */}
                </div>
            </div>
            <>
                {modalIsOpen && (<div className={`modal fade ${modalIsOpen ? 'show' : ''}`} id="add_exam" style={{ display: modalIsOpen ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Add Exam Type</h4>
                                <button
                                    type="button"
                                    className="btn-close custom-btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={closeModal}
                                >
                                    <i className="ti ti-x" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-24">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Academic Year</label>
                                                        <CommonSelect
                                                            className="select"
                                                            options={academicYearDropdown}
                                                            onChange={(option) => handleSelectChange(option, "exam_type_name")}
                                                            reset={resetSelect}
                                                        />
                                                    </div>
                                                </div><div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Classes</label>
                                                        <CommonSelect
                                                            className="select"
                                                            options={classesDropdown}
                                                            onChange={(option) => handleSelectChange(option, "exam_type_name")}
                                                            reset={resetSelect}
                                                        />
                                                    </div>
                                                </div><div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Section</label>
                                                        <CommonSelect
                                                            className="select"
                                                            options={sectionsDropdown}
                                                            onChange={(option) => handleSelectChange(option, "exam_type_name")}
                                                            reset={resetSelect}
                                                        />
                                                    </div>
                                                </div><div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Orientation</label>
                                                        <CommonSelect
                                                            className="select"
                                                            options={orientationsDropdown}
                                                            onChange={(option) => handleSelectChange(option, "exam_type_name")}
                                                            reset={resetSelect}
                                                        />
                                                    </div>
                                                </div><div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">State</label>
                                                        <CommonSelect
                                                            className="select"
                                                            options={statesDropdown}
                                                            onChange={(option) => handleSelectChange(option, "exam_type_name")}
                                                            reset={resetSelect}
                                                        />
                                                    </div>
                                                </div><div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Zone</label>
                                                        <CommonSelect
                                                            className="select"
                                                            options={zonesDropdown}
                                                            onChange={(option) => handleSelectChange(option, "exam_type_name")}
                                                            reset={resetSelect}
                                                        />
                                                    </div>
                                                </div><div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Branch</label>
                                                        <CommonSelect
                                                            className="select"
                                                            options={branchesDropdown}
                                                            onChange={(option) => handleSelectChange(option, "exam_type_name")}
                                                            reset={resetSelect}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            onClick={closeModal}
                                            className="btn btn-light me-2"
                                            data-bs-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn btn-primary" type="submit">
                                            Add Exam
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>)}
                {/* Edit Exam */}
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

export default Branches;

function setExamToDelete(_record: Exam): void {
    throw new Error("Function not implemented.");
}

function setExams(updatedExams: (Exam | { name: string; description: string; })[]) {
    throw new Error("Function not implemented.");
}