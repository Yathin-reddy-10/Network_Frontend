import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast } from "react-bootstrap";
import { useUserPermissions } from "../../UserPermissionsContext";
import { Modal } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface ErrorMessage {
  username_or_email?: string[];
  password?: string[];
  error?: string[]
}

const Login = () => {
  const routes = all_routes;
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState();
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({});
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUserPermissions, setUserData, webApi, setUserProfile } = useUserPermissions();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (isFirstLogin) {
        // Show the update password modal
        const modalElement = document.getElementById("updatepassword");
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.show();
        }
      } else {
        setShowLoginToast(true);
        setTimeout(() => {
          navigate(routes.adminDashboard);
        }, 1000);
      }
    }
  }, [isLoggedIn, isFirstLogin, navigate, routes]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${webApi}/usermgmt/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData);
        throw new Error(errorData.detail || "Invalid email or password");
      }

      const data = await response.json();
      setUsername("");
      setPassword("");

      if (!data) {
        throw new Error("No data received from server");
      }

      Cookies.set("authToken", data.access, { expires: 7 }); // Expires in 7 days
      setIsLoggedIn(true);
      setUserPermissions(data.userAbilities);
      setUserData(data.userData);
      setIsFirstLogin(data.is_firstlogin);
      setUserProfile(data.userProfileData);
    } catch (err) {
      if (err instanceof Error) {
      } else {
      }
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    const jwtToken = Cookies.get("authToken");
    e.preventDefault();
    try {
      const response = await fetch(
        `${webApi}/usermgmt/change_password_first_login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData);
        throw new Error(errorData.detail || "Failed to update password");
      }
      const submitBtn1 = document.getElementById("submit-btn7");
      if (submitBtn1) {
        submitBtn1.setAttribute("data-bs-dismiss", "modal");
        submitBtn1.click();
      }
      navigate(routes.adminDashboard);
    } catch (err) {
      if (err instanceof Error) {
      } else {
      }
    }
  };

  return (
    <>
      <div
        className="container-fluid"
        style={{
          backgroundImage: "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="card d-flex flex-row"
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "auto",
            border: "none",
            borderRadius: "40px",
            overflow: "hidden",
            flexDirection: "column", // Default to column for mobile
          }}
        >
          <div
            className="card-body"
            style={{
              backgroundImage:
                "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
              flex: "1",
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
            }}
          >
            <div
              className="d-flex align-items-center mb-4"
              style={{ marginBottom: "20px" }}
            >
              <img
                src="https://cmstage.s3.ap-south-1.amazonaws.com/stage/assets/logo.png"
                alt="Logo"
                style={{
                  width: "70px",
                  height: "70px",
                  marginRight: "10px",
                }}
              />
              <h2 className="m-0" style={{ fontSize: "2rem" }}>
                Sri Chaitanya
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* <img
                src="https://cmstage.s3.ap-south-1.amazonaws.com/stage/assets/pay3.png"
                alt="Background"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "auto",
                  objectFit: "cover",
                  objectPosition: "center",
                  marginBottom: "20px",
                }}
              /> */}
              <form
                onSubmit={handleSubmit}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div className="mb-3" style={{ width: "100%" }}>
                  <label className="form-label">User Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errorMessage.username_or_email ? "is-invalid" : ""
                    }`}
                    style={{
                      height: "50px",
                      width: "100%",
                      border: errorMessage.username_or_email
                        ? "1px solid red"
                        : "1px solid black",
                      borderRadius: "15px",
                      transition: "border-color 0.3s",
                    }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#0056b3")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#007bff")
                    }
                  />
                  {errorMessage.username_or_email && (
                    <div className="invalid-feedback">
                      {errorMessage.username_or_email[0]}
                    </div>
                  )}
                </div>
                <div className="mb-3" style={{ width: "100%" }}>
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className={`form-control ${
                        errorMessage.password ? "is-invalid" : ""
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        height: "50px",
                        width: "100%",
                        border: errorMessage.password
                          ? "1px solid red"
                          : "1px solid black",
                        borderRadius: "15px",
                        transition: "border-color 0.3s",
                      }}
                      placeholder="Enter your password"
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#0056b3")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#007bff")
                      }
                    />
                    {errorMessage.password && (
                      <div className="invalid-feedback">
                        {errorMessage.password[0]}
                      </div>
                    )}
                    <span
                      className={`ti toggle-password ${
                        isPasswordVisible ? "ti-eye" : "ti-eye-off"
                      }`}
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                </div>
                <div className="mt-4 mb-3" style={{ width: "100%" }}>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{
                      height: "50px",
                      borderRadius: "35px",
                    }}
                  >
                    Sign In
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
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="modal-content"
              style={{
                maxWidth: "90%", // Set max width to 90% for mobile
                width: "600px", // Set a fixed width for larger screens
                padding: "20px",
                borderRadius: "10px",
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
                      className={`form-control ${
                        errorMessage.error ? "is-invalid" : ""
                      }`}
                      name="new_password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        minHeight: "55px",
                        marginBottom: "25px",
                      }}
                    />
                    {errorMessage.error && (
                      <div className="invalid-feedback">
                        {errorMessage.error[0]}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${
                        errorMessage.error ? "is-invalid" : ""
                      }`}
                      name="confirm_password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        minHeight: "55px",
                      }}
                    />
                    {errorMessage.error && (
                      <div className="invalid-feedback">
                        {errorMessage.error[0]}
                      </div>
                    )}
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
        <style>{`
        @media (min-width: 768px) {
          .card {
            flex-direction: row;
          }
          .card-body {
            flex-direction: row;
          }
          .card-body > div {
            flex: 1;
          }
          .card-body > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          img {
            width: 50%;
            height: auto;
            margin-left: 0;
            margin-top: 0;
          }
          form {
            margin-left: 20px;
            margin-right: 20px;
          }
        }
      `}</style>

        {/* Toast Notification */}
        <Toast
          show={showLoginToast}
          onClose={() => setShowLoginToast(false)}
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
          <Toast.Body>Login successful!</Toast.Body>
        </Toast>
      </div>
    </>
  );
};

export default Login;
