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
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import * as bootstrap from 'bootstrap';

type Exam = {
  exam_id: number;
  exam_name: string;
  academic_year_name: string;
  name: any;
  subject_name: string
  start_date: string;
  end_date: string;
  exam: number;
  subject: number;
  date: string;
  exam_start_time: string;
  exam_end_time: string;
  maximum_marks_external: number;
  exam_instance_id: number
  maximum_marks_internal: number
};
const ExamInstance = () => {
  const routes = all_routes;
  const [exams, setExams] = useState<Exam[]>([]);
  const [examNamesDropdown, setExamNamesDropdown] = useState<any>([]);
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
  const [newExam, setNewExam] = useState({ exam_id: 0, exam_name: '', academic_year_name: '', name: '', start_date: '', end_date: '', exam: 1, subject: 1, date: '', exam_start_time: '09:00:00', exam_end_time: '09:00:00', maximum_marks_external: 0, exam_instance_id: 0, maximum_marks_internal: 0, subject_name:'' })
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [orientationSelected, setOrientationSelected] = useState([]);
  const [classesSelected, setClassesSelected] = useState([]);
  const [resetSelect, setResetSelect] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [startTime, setStartTime] = useState<string | null>('10:00');
  const [endTime, setEndTime] = useState<string | null>('12:00');
  const [subjectsDropdown, setSubjectsDropdown] = useState([]);
  const [time, setTime] = useState('09:00:00');
  

  useEffect(() => {
    const fetchData = async (_page: number) => {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const examsResponse = await fetch(`http://10.10.8.14/exams/exam_examinstance/?page=${_page}`, options);
      const examNames = await fetch('http://10.10.8.14/exams/exam_exam_dropdown/', options);
      const subjects = await fetch('http://10.10.8.14/exams/exam_subject_dropdown/', options);

      const subjectsDropdownData = await subjects.json();
      setSubjectsDropdown(subjectsDropdownData.results.map((item: { subject_id: number, name: any; label: any; }) => ({ value: item.name, label: item.label, id: item.subject_id, idName: 'subject', name: 'subject_name' })));
      const examTypesDropdownData = await examNames.json();
      console.log(examTypesDropdownData)
      setExamNamesDropdown(examTypesDropdownData.results.map((item: { exam_id: number, name: any; label: any; }) => ({ value: item.name, label: item.label, id: item.exam_id, idName: 'exam', name: 'exam_name' })));

      const examsData = await examsResponse.json();
      setTotalPages(examsData.total_pages);
      console.log(examsData);
      setExams(examsData.results);

    };
    fetchData(currentPage);
  }, [currentPage, newExam]);




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Define the required fields
    const requiredFields: (keyof Exam)[] = ['exam', 'subject', 'date'];

    // Check if all required fields are filled
    let isFormValid = requiredFields.every(field => newExam[field]);
    if (!isFormValid) {
      alert('Please fill in all required fields.');
      return;
    }

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
        ? `http://10.10.8.14/exams/exam_examinstance/${newExam.exam_instance_id}/`
        : 'http://10.10.8.14/exams/exam_examinstance/';
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Success:', data);
      setExams(updatedExams);
      resetForm();
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn && isFormValid) {
        submitBtn.setAttribute('data-bs-dismiss', 'modal');
        submitBtn.click(); // Trigger the click to close the modal
      }
      const submitBtn1 = document.getElementById('submit-btn1');
      if (submitBtn1 && isFormValid) {
        submitBtn1.setAttribute('data-bs-dismiss', 'modal');
        submitBtn1.click(); // Trigger the click to close the modal
      }

    }
    catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  const editExam = (record: Exam) => {
    setNewExam({
      exam_name: record.exam_name,
      academic_year_name: record.academic_year_name,
      name: record.name,
      start_date: record.start_date,
      end_date: record.end_date,
      exam_id: exams.length + 1,
      subject_name: record.subject_name,
      exam: 1,
      subject: 1, date: record.date, exam_start_time: record.exam_start_time, exam_end_time: record.exam_end_time, maximum_marks_external: record.maximum_marks_external, exam_instance_id: record.exam_instance_id, maximum_marks_internal: record.maximum_marks_internal
    });
    setEditingIndex(record.exam_instance_id);
  };


  const resetForm = () => {
    setNewExam({
      exam_name: '',
      academic_year_name: '',
      name: '',
      start_date: '',
      end_date: '',
      exam_id: 0,
      exam: 1,
      subject_name:'',
      subject: 1, date: '', exam_start_time: '09:00:00', exam_end_time: '09:00:00', maximum_marks_external: 0, exam_instance_id: 0, maximum_marks_internal: 0
    });
    setOrientationSelected([]);
    setClassesSelected([]);
    setEditingIndex(null);
    setResetSelect((prev) => !prev)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExam({ ...newExam, [name]: value });
  };

  const handleSelectChange = (option: Option | null, idName: string, name: string) => {
    setNewExam((prev) => ({
      ...prev,
      [idName]: option ? option.id : "",
      [name]: option ? option.value : "",
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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExam({ ...newExam, [name]: value });
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
    // {
    //   title: "ID",
    //   dataIndex: "exam_id",
    //   render: (_text: string, record: any) => (
    //     <>
    //       <Link to="#" className="link-primary">
    //         {record.exam_id}
    //       </Link>
    //     </>
    //   ),
    //   sorter: (a: any, b: any) => a.id.length - b.id.length,
    // },
    {
      title: "Exam Name",
      dataIndex: "exam_name",
      sorter: (a: TableData, b: TableData) =>
        a.examName.length - b.examName.length,
    },
    {
      title: "Subject Name",
      dataIndex: "subject_name",
      sorter: (a: TableData, b: TableData) =>
        a.examName.length - b.examName.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a: TableData, b: TableData) =>
        a.examDate.length - b.examDate.length,
    },
    {
      title: "Start Time",
      dataIndex: "exam_start_time",
      sorter: (a: TableData, b: TableData) =>
        a.examName.length - b.examName.length,
    },
    {
      title: "End Time",
      dataIndex: "exam_end_time",
      sorter: (a: TableData, b: TableData) =>
        a.examName.length - b.examName.length,
    },
    {
      title: "External Marks",
      dataIndex: "maximum_marks_external",
      sorter: (a: TableData, b: TableData) =>
        a.examName.length - b.examName.length,
    },
    {
      title: "Internal Marks",
      dataIndex: "maximum_marks_internal",
      sorter: (a: TableData, b: TableData) =>
        a.examName.length - b.examName.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_text: string, record: Exam, index: number) => (
        <div className="d-flex align-items-center">
          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => editExam(record)}
            data-bs-toggle="modal"
            data-bs-target="#edit_exam"
          >
            <i className="ti ti-edit-circle me-1" /> Edit
          </button>
          {/* <button
            className="btn btn-danger btn-sm me-2"
            // onClick={() => setExamToDelete(record)}
            data-bs-toggle="modal"
            data-bs-target="#delete-modal"
          >
            <i className="ti ti-trash-x me-1" /> Delete
          </button> */}
        </div>
      ),
    }
  ];
  return (

    <div style={{ backgroundColor: '#E4F3F7', minHeight: '100vh' }}>
      <div className="page-wrapper" >
        <div className="content" style={{ backgroundColor: '#E4F3F7', minHeight: '85%', margin: '5px', marginTop: '15px', position: 'fixed', minWidth: '85%' }}>
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam Instance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam Instance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="mb-2">
                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_exam"
                  type="button"
                >
                  <i className="ti ti-square-rounded-plus-filled me-2" />
                  Add Exam Instance
                </button>
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
          <div className=" styled-card">
            <div className="card-body p-0 py-3">
              {/* Guardians List */}
              <Table
                columns={columns}
                dataSource={exams}
                Selection={true}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                currentpage={currentPage}
              />
              {/* /Guardians List */}
            </div>
          </div>
          {/* /Guardians List */}
        </div>
      </div>
      <>
        {/* Add Exam */}
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
            min-height: 50vh;
          }
          .dual-list-box-container {
            grid-column: span 2;
            width: 100%;
          }
        `}
        </style>
        <div className="modal fade" id="add_exam">
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Instance</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="submit-btn"
                  onClick={resetForm}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmit} onKeyPress={(e) => { if (e.key === 'Enter') { handleSubmit(e); } }}>
                <div className="modal-body light-violet-bg">
                  <div className="mb-3">
                    <label className="form-label">Exam Name</label>
                    <CommonSelect
                      className="select"
                      options={examNamesDropdown}
                      onChange={(option) => handleSelectChange(option, "exam", "exam_name")}
                      reset={resetSelect}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject Name</label>
                    <CommonSelect
                      className="select"
                      options={subjectsDropdown}
                      onChange={(option) => handleSelectChange(option, "subject", "subject_name")}
                      reset={resetSelect}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <div className="date-pic">
                      <DatePicker
                        className="form-control datetimepicker"
                        format="YYYY-MM-DD"
                        getPopupContainer={getModalContainer}
                        defaultValue={defaultValue}
                        onChange={(date) => handleDateChange(date, "date")}
                        value={newExam.date ? dayjs(newExam.date, "YYYY-MM-DD") : null}
                        required
                      />
                      <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">External Marks</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputChange}
                      value={newExam.maximum_marks_external}
                      name="maximum_marks_external"
                      required
                      placeholder="Maximum External"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Internal Marks</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputChange}
                      value={newExam.maximum_marks_internal}
                      name="maximum_marks_internal"
                      required
                      placeholder="Maximum Internal"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      id="time"
                      value={newExam.exam_start_time}
                      onChange={handleTimeChange}
                      name="exam_start_time"
                      step="1" // Allows to input seconds
                      pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" // Ensures the format is HH:MM:SS
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      id="time"
                      value={newExam.exam_end_time}
                      onChange={handleTimeChange}
                      name="exam_end_time"
                      step="1" // Allows to input seconds
                      pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" // Ensures the format is HH:MM:SS
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Add Instance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Add Exam */}
        {/* Edit Exam */}
        <div className="modal fade" id="edit_exam">
          <div className="modal-dialog custom-modal-size">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Instance</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="submit-btn"
                  onClick={resetForm}
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmit} onKeyPress={(e) => { if (e.key === 'Enter') { handleSubmit(e); } }}>
                <div className="modal-body light-violet-bg">
                  <div className="mb-3">
                    <label className="form-label">Exam Name</label>
                    <CommonSelect
                      className="select"
                      options={examNamesDropdown}
                      onChange={(option) => handleSelectChange(option, "exam", "exam_name")}
                      reset={resetSelect}
                      defaultValue={examNamesDropdown.find((option: { value: string; }) => option.value === newExam.exam_name)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject Name</label>
                    <CommonSelect
                      className="select"
                      options={subjectsDropdown}
                      onChange={(option) => handleSelectChange(option, "subject", "subject_name")}
                      reset={resetSelect}
                      defaultValue={subjectsDropdown.find((option: { value: string; }) => option.value === newExam.subject_name)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <div className="date-pic">
                      <DatePicker
                        className="form-control datetimepicker"
                        format="YYYY-MM-DD"
                        getPopupContainer={getModalContainer}
                        defaultValue={defaultValue}
                        onChange={(date) => handleDateChange(date, "date")}
                        value={newExam.date ? dayjs(newExam.date, "YYYY-MM-DD") : null}
                        required
                      />
                      <span className="cal-icon">
                        <i className="ti ti-calendar" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">External Marks</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputChange}
                      value={newExam.maximum_marks_external}
                      name="maximum_marks_external"
                      required
                      placeholder="Maximum External"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Internal Marks</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={handleInputChange}
                      value={newExam.maximum_marks_internal}
                      name="maximum_marks_internal"
                      required
                      placeholder="Maximum Internal"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      id="time"
                      value={newExam.exam_start_time}
                      onChange={handleTimeChange}
                      name="exam_start_time"
                      step="1" // Allows to input seconds
                      pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" // Ensures the format is HH:MM:SS
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Time</label>
                    <input
                      type="time"
                      id="time"
                      value={newExam.exam_end_time}
                      onChange={handleTimeChange}
                      name="exam_end_time"
                      step="1" // Allows to input seconds
                      pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}" // Ensures the format is HH:MM:SS
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Add Instance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
export default ExamInstance;