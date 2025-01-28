 import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { DatatableProps } from "../../data/interface";

const Datatable: React.FC<DatatableProps> = ({
  columns,
  dataSource,
  Selection,
  handlePreviousPage,
  handleNextPage,
  currentpage,
  from,
  to,
  totalCount
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [Selections, setSelections] = useState<any>(true);
  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);

  useEffect(() => {
    setFilteredDataSource(dataSource);
  }, [dataSource]);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = dataSource.filter((record) =>
      Object.values(record).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredDataSource(filteredData);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    setSelections(Selection);
  }, [Selection]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#FFFFFC",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <div
          className="table-top-data d-flex px-3 justify-content-between"
          style={{ marginBottom: "8px" }} // Reduced padding
        >
          {/* <div className="search-global text-right">
            <input
              type="search"
              className="form-control form-control-sm mb-3 w-auto float-end table datanew dataTable no-footer"
              value={searchText}
              placeholder="Search"
              onChange={(e) => handleSearch(e.target.value)}
              aria-controls="DataTables_Table_0"
              style={{ borderRadius: "4px" }}
            />
          </div> */}
        </div>
        <div className="table-wrapper" style={{ overflowX: "auto", width: "100%" }}>
          <Table
            className="table datanew dataTable no-footer mb-3"
            rowSelection={!Selections ? undefined : rowSelection}
            columns={columns}
            rowHoverable={false}
            dataSource={filteredDataSource}
            pagination={false} // Disable the default pagination
            scroll={{ x: "max-content" }}
            style={{
              backgroundColor: "#FFFFFC",
              borderRadius: "8px",
            }}
            tableLayout="fixed"
            bordered
          />
        </div>
        <div className="col-xl-12">
          <div
            className="pagination-style-3 d-flex justify-content-between align-items-center"
            style={{ marginTop: "16px" }}
          >
            <div className="pagination-info p-2">
              Showing {from} to {to} of {totalCount}
            </div>
            <ul className="pagination mb-0 flex-wrap">
              <li className="page-item">
                <Button
                  className="page-link"
                  onClick={handlePreviousPage}
                  disabled={currentpage === 1}
                  style={{
                    backgroundColor: "#e0e0e0",
                    border: "none",
                    borderRadius: "4px",
                    margin: "0 5px",
                  }}
                >
                  Prev
                </Button>
              </li>
              <li className="page-item">{currentpage}</li>
              <li className="page-item">
                <Button
                  className="page-link"
                  onClick={handleNextPage}
                  disabled={filteredDataSource.length < 10}
                  style={{
                    backgroundColor: "#e0e0e0",
                    border: "none",
                    borderRadius: "4px",
                    margin: "0 5px",
                  }}
                >
                  Next
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Datatable;
