import PropTypes from "prop-types";
import React from "react";
import { Navbar, Nav, Form  } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NavbarComponent = ({ onLogout, useGraphQL, toggleFeatureFlag }) => {
  const navigate = useNavigate();

  const onNavigate = (route) => {
    console.log("Navigating to:", route);
    switch (route) {
      case "TrackExercise":
        navigate("/trackExercise");
        break;
      case "Statistics":
        navigate("/statistics");
        break;
      case "Journal":
        navigate("/journal");
        break;
      default:
        console.error("Invalid route:", route);
    }
  };

  return (
    <Navbar className="nav-back custom-navbar" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav>
            <Nav.Link
              className="custom-nav-link"
              onClick={() => onNavigate("TrackExercise")}
            >
              Track New Exercise
            </Nav.Link>
            <Nav.Link
              className="custom-nav-link"
              onClick={() => onNavigate("Statistics")}
            >
              Statistics
            </Nav.Link>
            <Nav.Link
              className="custom-nav-link"
              onClick={() => onNavigate("Journal")}
            >
              Weekly Journal
            </Nav.Link>
            <Nav.Link className="custom-nav-link" onClick={onLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Nav>
        <Form inline>
          <Form.Check
            type="switch"
            id="feature-flag-switch"
            label="Use GraphQL"
            checked={useGraphQL}
            onChange={toggleFeatureFlag}
          />
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

NavbarComponent.propTypes = {
  onLogout: PropTypes.func.isRequired,
  useGraphQL: PropTypes.bool.isRequired,
  toggleFeatureFlag: PropTypes.func.isRequired,
};


export default NavbarComponent;