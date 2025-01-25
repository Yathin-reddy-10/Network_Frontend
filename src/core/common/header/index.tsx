import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setExpandMenu, setMobileSidebar } from "../../data/redux/sidebarSlice";
import { useState } from "react";
import Cookies from "js-cookie";
import { Toast } from "react-bootstrap";
import { useUserPermissions } from "../../../feature-module/UserPermissionsContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // This includes Popper.js
const Header = () => {
  // const routes = all_routes;
  const dispatch = useDispatch();
  // const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  // const dataLayout = useSelector((state: any) => state.themeSetting.dataLayout);
  // const [notificationVisible, setNotificationVisible] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  const { userData } = useUserPermissions(); // Use the custom hook to get user data if (!userData) { return null; // Render nothing if userData is null }

  const navigate = useNavigate();

  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };

  const onMouseEnter = () => {
    dispatch(setExpandMenu(true));
  };
  const onMouseLeave = () => {
    dispatch(setExpandMenu(false));
  };
  // const handleToggleMiniSidebar = () => {
  //   if (dataLayout === "mini_layout") {
  //     dispatch(setDataLayout("default_layout"));
  //     localStorage.setItem("dataLayout", "default_layout");
  //   } else {
  //     dispatch(toggleMiniSidebar());
  //   }
  // };

  // const handleToggleClick = () => {
  //   if (dataTheme === "default_data_theme") {
  //     dispatch(setDataTheme("dark_data_theme"));
  //     localStorage.setItem(dataTheme, "dark_data_theme");
  //   } else {
  //     dispatch(setDataTheme("default_data_theme"));
  //     localStorage.removeItem(dataTheme);
  //   }
  // };
  // const location = useLocation();
  // // const toggleNotification = () => {
  // //   setNotificationVisible(!notificationVisible);
  // // };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {});
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => {});
        }
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove("authToken"); // Remove the cookie
    setShowLogoutToast(true);
    setTimeout(() => {
      navigate("/"); // Redirect to login or home page
    }, 1000); // Show toast for 3 seconds before redirect
  };

  return (
    <>
      {/* Header */}
      <style>
        {`
          .header-card {
            background-color: #FFFFFF;
            padding: 10px 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            width: 60%;
            margin: 0 auto;
            position: fixed;
            top: 10px;
            left: 60%;
            transform: translateX(-50%);
            z-index: 1000;
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
          }
          .header-left.active {
            display: flex;
            align-items: center;
          }
          .mobile_btn {
            display: none;
          }
          .header-user {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .header-user .nav.user-menu {
            display: flex;
            align-items: center;
          }
          .header-user .nav.user-menu .dropdown-menu {
            right: 0;
            left: auto;
          }
          .header-user .nav.user-menu .dropdown-menu .dropdown-item {
            display: flex;
            align-items: center;
          }
          .header-user .nav.user-menu .dropdown-menu .dropdown-item i {
            margin-right: 10px;
          }
          .colored-toast {
            background-color: #28a745;
            color: #fff;
          }
          .mobile-user-menu {
            display: none;
          }
          @media (max-width: 768px) {
            .mobile_btn {
              display: block;
            }
            .header-user {
              display: none;
            }
            .mobile-user-menu {
              display: block;
            }
          }
        `}
      </style>
      <div className="header-card">
        <div
          className="header-left active"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        ></div>
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        <div className="header-user">
          <div className="nav user-menu">
            <div className="d-flex align-items-center">
              <div className="dropdown ms-1">
                <div className="header-user">
                  <div className="nav user-menu">
                    <div className="d-flex align-items-center">
                      <div className="pe-1">
                        <Link
                          onClick={toggleFullscreen}
                          to="#"
                          className="btn btn-outline-light bg-white btn-icon me-1"
                          id="btnFullscreen"
                        >
                          <i className="ti ti-maximize" />
                        </Link>
                      </div>
                      <div
                        className="dropdown ms-1"
                        style={{ position: "relative" }}
                      >
                        <Link
                          to="#"
                          className="d-flex align-items-center"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ cursor: "pointer" }}
                        >
                          <span className="avatar avatar-md rounded">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/11918/11918393.png"
                              alt="Img"
                              className="img-fluid"
                            />
                          </span>
                          <div className="ms-2">
                            <h6 className="mb-0">{userData.username}</h6>
                          </div>
                        </Link>
                        <ul className="dropdown-menu" style={{ zIndex: 1050 }}>
                          <li>
                            <button
                              className="dropdown-item d-inline-flex align-items-center p-2"
                              type="button"
                              onClick={handleLogout}
                            >
                              <i className="ti ti-login me-2" /> Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                      <button
                        className="d-inline-flex align-items-center p-2"
                        type="button"
                        onClick={handleLogout}
                        style={{
                          color: "red",
                          border: "none",
                          marginLeft: "13px",
                        }}
                      >
                        {" "}
                        Logout{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Toast
            show={showLogoutToast}
            onClose={() => setShowLogoutToast(false)}
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
            <Toast.Body>Logout successful!</Toast.Body>
          </Toast>
        </div>
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <div className="d-flex align-items-center">
            <span className="avatar avatar-md rounded">
              <img
                src="https://cdn-icons-png.flaticon.com/128/11918/11918393.png"
                alt="Img"
                className="img-fluid"
              />
            </span>
            <h6 className="ml-1" style={{ marginLeft: "8px" }}>
              {userData.username}
            </h6>{" "}
            {/* Added marginLeft here */}
            <button
              className="d-inline-flex align-items-center p-2"
              type="button"
              onClick={handleLogout}
              style={{ color: "red", border: "none", marginLeft: "13px" }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* /Mobile Menu */}
      </div>
      {/* /Header */}
    </>
  );
};

export default Header;
