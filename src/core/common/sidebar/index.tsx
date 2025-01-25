import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";
import { SidebarData } from "../../data/json/sidebarData";
import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";
import { setExpandMenu } from "../../data/redux/sidebarSlice";
import { useDispatch } from "react-redux";
import {
  resetAllMode,
  setDataLayout,
} from "../../data/redux/themeSettingSlice";
import usePreviousRoute from "./usePreviousRoute";

const Sidebar = () => {
  const Location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [subOpen, setSubopen] = useState<any>("");
  const [subsidebar, setSubsidebar] = useState("");

  const toggleSidebar = (title: any) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem: any) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  const handleLayoutChange = (layout: string) => {
    dispatch(setDataLayout(layout));
  };

  const handleClick = (label: any, themeSetting: any, layout: any) => {
    toggleSidebar(label);
    if (themeSetting) {
      handleLayoutChange(layout);
    }
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const getLayoutClass = (label: any) => {
    switch (label) {
      case "Default":
        return "default_layout";
      case "Mini":
        return "mini_layout";
      case "Box":
        return "boxed_layout";
      case "Dark":
        return "dark_data_theme";
      case "RTL":
        return "rtl";
      default:
        return "";
    }
  };
  const location = useLocation();
  const dispatch = useDispatch();
  const previousLocation = usePreviousRoute();

  useEffect(() => {
    const layoutPages = [
      "/layout-dark",
      "/layout-rtl",
      "/layout-mini",
      "/layout-box",
      "/layout-default",
    ];

    const isCurrentLayoutPage = layoutPages.some((path) =>
      location.pathname.includes(path)
    );
    const isPreviousLayoutPage =
      previousLocation &&
      layoutPages.some((path) => previousLocation.pathname.includes(path));

    if (isPreviousLayoutPage && !isCurrentLayoutPage) {
      dispatch(resetAllMode());
    }
  }, [location, previousLocation, dispatch]);

  useEffect(() => {
    setSubopen(localStorage.getItem("menuOpened"));
    // Select all 'submenu' elements
    const submenus = document.querySelectorAll(".submenu");
    // Loop through each 'submenu'
    submenus.forEach((submenu) => {
      // Find all 'li' elements within the 'submenu'
      const listItems = submenu.querySelectorAll("li");
      submenu.classList.remove("active");
      // Check if any 'li' has the 'active' class
      listItems.forEach((item) => {
        if (item.classList.contains("active")) {
          // Add 'active' class to the 'submenu'
          submenu.classList.add("active");
          return;
        }
      });
    });
  }, [Location.pathname]);

  const onMouseEnter = () => {
    dispatch(setExpandMenu(true));
  };
  const onMouseLeave = () => {
    dispatch(setExpandMenu(false));
  };
  return (
    <>
      <style>
        {`
          .sidebar-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #FFFFFF;
            min-height: 80%;
            margin: 15px;
            margin-top: 20px;
            position: fixed;
            top: 0;
            left: 0;
            width: 250px; /* Adjust the width as needed */x
            transition: transform 0.3s ease-in-out;
             z-index: 1000;
          }
            .toggle-button {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 1000;
            background-color: #06038D;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px;
            cursor: pointer;
            display: none; /* Hide by default */
             z-index: 1001;
          }
             @media (max-width: 975px) {
            .toggle-button {
              display: block; /* Show on mobile */
            }
          
          }
        `}
      </style>
      <button className="toggle-button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
      <i className="fas fa-bars" />
      </button>
      <div
        className="sidebar sidebar-card"
        id="sidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ display: isSidebarOpen ? 'block' : 'none' }}
      >
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <div
                className="d-flex align-items-center mb-4"
                style={{ marginBottom: "20px" }}
              >
                <img
                  src="https://cmstage.s3.ap-south-1.amazonaws.com/stage/assets/logo.png"
                  alt="Logo"
                  style={{
                    width: "50px",
                    height: "50px",
                    marginRight: "10px",
                  }}
                />
                <h2 className="m-0" style={{ fontSize: "", color: "#06038D" }}>
                  Sri Chaitanya
                </h2>
              </div>
              <ul>
                {SidebarData().map((mainLabel: any, index: number) => (
                  <li key={index}>
                    <h6 className="submenu-hdr">
                      <span>{mainLabel?.label}</span>
                    </h6>
                    <ul>
                      {mainLabel?.submenuItems?.map((title: any, i: number) => {
                        let link_array: any = [];
                        if ("submenuItems" in title) {
                          title.submenuItems?.forEach((link: any) => {
                            link_array.push(link?.link);
                            if (link?.submenu && "submenuItems" in link) {
                              link.submenuItems?.forEach((item: any) => {
                                link_array.push(item?.link);
                              });
                            }
                          });
                        }
                        title.links = link_array;
                        return (
                          <>
                            <style>
                              {`
                                .sidebar-card {
                                  border: 1px solid #ddd;
                                  border-radius: 8px;
                                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                  background-color: #FFFFFF;
                                  min-height: 80%;
                                  margin: 15px;
                                  margin-top: 20px;
                                  position: fixed;
                                  top: 0;
                                  left: 0;
                                  width: 250px; /* Adjust the width as needed */
                                  transition: transform 0.3s ease-in-out;
                                }
                              `}
                            </style>
                            <div
                              className="sidebar sidebar-card"
                              id="sidebar"
                              onMouseEnter={onMouseEnter}
                              onMouseLeave={onMouseLeave}
                            >
                              <Scrollbars>
                                <div className="sidebar-inner slimscroll">
                                  <div
                                    id="sidebar-menu"
                                    className="sidebar-menu"
                                  >
                                    <div
                                      className="d-flex align-items-center mb-4"
                                      style={{ marginBottom: "20px" }}
                                    >
                                      <img
                                        src="https://cmstage.s3.ap-south-1.amazonaws.com/stage/assets/logo.png"
                                        alt="Logo"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          marginRight: "10px",
                                        }}
                                      />
                                      <h2
                                        className="m-0"
                                        style={{
                                          fontSize: "",
                                          color: "#06038D",
                                        }}
                                      >
                                        Sri Chaitanya
                                      </h2>
                                    </div>
                                    <ul>
                                      {SidebarData().map(
                                        (mainLabel: any, index: number) => (
                                          <li key={index}>
                                            <h6 className="submenu-hdr">
                                              <span>{mainLabel?.label}</span>
                                            </h6>
                                            <ul>
                                              {mainLabel?.submenuItems?.map(
                                                (title: any, i: number) => {
                                                  let link_array: any = [];
                                                  if ("submenuItems" in title) {
                                                    title.submenuItems?.forEach(
                                                      (link: any) => {
                                                        link_array.push(
                                                          link?.link
                                                        );
                                                        if (
                                                          link?.submenu &&
                                                          "submenuItems" in link
                                                        ) {
                                                          link.submenuItems?.forEach(
                                                            (item: any) => {
                                                              link_array.push(
                                                                item?.link
                                                              );
                                                            }
                                                          );
                                                        }
                                                      }
                                                    );
                                                  }
                                                  title.links = link_array;

                                                  return (
                                                    <li
                                                      className="submenu"
                                                      key={title.label}
                                                    >
                                                      <Link
                                                        to={
                                                          title?.submenu
                                                            ? "#"
                                                            : title?.link
                                                        }
                                                        onClick={() =>
                                                          handleClick(
                                                            title?.label,
                                                            title?.themeSetting,
                                                            getLayoutClass(
                                                              title?.label
                                                            )
                                                          )
                                                        }
                                                        className={`
                                                      ${
                                                        subOpen === title?.label
                                                          ? "subdrop"
                                                          : ""
                                                      }
                                                      ${
                                                        title?.links?.includes(
                                                          Location.pathname
                                                        )
                                                          ? "active"
                                                          : ""
                                                      }
                                                      ${
                                                        title?.submenuItems?.some(
                                                          (link: any) =>
                                                            link?.link ===
                                                            Location.pathname
                                                        )
                                                          ? "active"
                                                          : ""
                                                      }
                                                      ${
                                                        [
                                                          title?.subLink1,
                                                          title?.subLink2,
                                                          title?.subLink3,
                                                          title?.subLink4,
                                                          title?.subLink5,
                                                          title?.subLink6,
                                                          title?.subLink7,
                                                        ].includes(
                                                          Location.pathname
                                                        )
                                                          ? "active"
                                                          : ""
                                                      }
                                                    `}
                                                      >
                                                        <i
                                                          className={title.icon}
                                                        ></i>
                                                        <span>
                                                          {title?.label}
                                                        </span>
                                                        <span className="badge badge-primary badge-xs text-white fs-10 ms-auto">
                                                          {title?.version}
                                                        </span>
                                                        <span
                                                          className={
                                                            title?.submenu
                                                              ? "menu-arrow"
                                                              : ""
                                                          }
                                                        />
                                                      </Link>
                                                      {title?.submenu !==
                                                        false &&
                                                        subOpen ===
                                                          title?.label && (
                                                          <ul
                                                            style={{
                                                              display:
                                                                subOpen ===
                                                                title?.label
                                                                  ? "block"
                                                                  : "none",
                                                            }}
                                                          >
                                                            {title?.submenuItems?.map(
                                                              (item: any) => (
                                                                <li
                                                                  className={
                                                                    item?.submenuItems
                                                                      ? "submenu submenu-two "
                                                                      : ""
                                                                  }
                                                                  key={
                                                                    item.label
                                                                  }
                                                                >
                                                                  <Link
                                                                    to={
                                                                      item?.link
                                                                    }
                                                                    className={`
                                                                ${
                                                                  item?.submenuItems?.some(
                                                                    (
                                                                      link: any
                                                                    ) =>
                                                                      link?.link ===
                                                                      Location.pathname
                                                                  )
                                                                    ? "active"
                                                                    : ""
                                                                }
                                                                ${
                                                                  item?.link ===
                                                                  Location.pathname
                                                                    ? "active"
                                                                    : ""
                                                                }
                                                                ${
                                                                  [
                                                                    item?.subLink1,
                                                                    item?.subLink2,
                                                                    item?.subLink3,
                                                                    item?.subLink4,
                                                                    item?.subLink5,
                                                                    item?.subLink6,
                                                                  ].includes(
                                                                    Location.pathname
                                                                  )
                                                                    ? "active"
                                                                    : ""
                                                                }
                                                                ${
                                                                  subsidebar ===
                                                                  item?.label
                                                                    ? "subdrop"
                                                                    : ""
                                                                }
                                                              `}
                                                                    onClick={() => {
                                                                      toggleSubsidebar(
                                                                        item?.label
                                                                      );
                                                                    }}
                                                                  >
                                                                    {
                                                                      item?.label
                                                                    }
                                                                    <span
                                                                      className={
                                                                        item?.submenu
                                                                          ? "menu-arrow"
                                                                          : ""
                                                                      }
                                                                    />
                                                                  </Link>
                                                                  {item?.submenuItems ? (
                                                                    <ul
                                                                      style={{
                                                                        display:
                                                                          subsidebar ===
                                                                          item?.label
                                                                            ? "block"
                                                                            : "none",
                                                                      }}
                                                                    >
                                                                      {item?.submenuItems?.map(
                                                                        (
                                                                          items: any
                                                                        ) => (
                                                                          <li
                                                                            key={
                                                                              items.label
                                                                            }
                                                                          >
                                                                            <Link
                                                                              to={
                                                                                items?.link
                                                                              }
                                                                              className={`${
                                                                                subsidebar ===
                                                                                items?.label
                                                                                  ? "submenu-two subdrop"
                                                                                  : "submenu-two"
                                                                              } ${
                                                                                items?.submenuItems
                                                                                  ?.map(
                                                                                    (
                                                                                      link: any
                                                                                    ) =>
                                                                                      link.link
                                                                                  )
                                                                                  .includes(
                                                                                    Location.pathname
                                                                                  ) ||
                                                                                items?.link ===
                                                                                  Location.pathname
                                                                                  ? "active"
                                                                                  : ""
                                                                              }`}
                                                                            >
                                                                              {
                                                                                items?.label
                                                                              }
                                                                            </Link>
                                                                          </li>
                                                                        )
                                                                      )}
                                                                    </ul>
                                                                  ) : (
                                                                    <></>
                                                                  )}
                                                                </li>
                                                              )
                                                            )}
                                                          </ul>
                                                        )}
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              </Scrollbars>
                            </div>
                          </>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default Sidebar;
