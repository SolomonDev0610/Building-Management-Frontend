import React from "react";
import {
  Code,
  Folder,
  LocationCity,
  Business,
  Domain,
  AccountBalance,
  Build,
  Home,
  Work,
  AccountCircle,
  SupervisorAccount,
  PersonOutline,
  People,
  Dashboard,
  Today,
  Forum,
  Message,
  Mail,
  Edit,
  Apps
} from "@material-ui/icons";

/**export default [
  {
    name: "General",
    children: [
      {
        name: "Dashboard",
        icon: <Dashboard />,
        link: "dashboard"
      },
      {
        name: "Calendar",
        icon: <Forum />,
        link: "calendar"
      },
      {
        name: "Messages",
        icon: <Message />,
        link: "messages"
      },
      {
        name: "Email Templates",
        icon: <Mail />,
        link: "buildings.view.emailtemplates"
      }
    ]
  },
  // {
  //   name: 'Establishments',
  //   children: [
  //     {
  //       name: 'Buildings',
  //       icon: <LocationCity />,
  //       link: 'buildingManager.buildings',
  //     },
  //     {
  //       name: 'Properties',
  //       icon: <Home />,
  //       link: 'buildingManager.properties',
  //     },
  //   ],
  // },
  {
    name: "Staff",
    children: [
      {
        name: "Property Manager Staff",
        icon: <SupervisorAccount />,
        link: "buildings.view.propertyManagers"
      }
    ]
  },
  {
    name: "Clients",
    children: [
      {
        name: "Owner",
        icon: <AccountCircle />,
        link: "buildings.view.owners"
      },
      {
        name: "Tenants",
        icon: <AccountCircle />,
        link: "buildings.view.tenants"
      }
    ]
  },
  {
    name: "Upkeep",
    children: [
      {
        name: "Assets",
        icon: <Work />,
        link: "buildings.view.assets"
      },
      {
        name: "Jobs",
        icon: <Build />,
        link: "buildings.view.services"
      },
      // {
      //   name: "Contractors",
      //   icon: <Business />,
      //   link: "buildings.view.contractors"
      // },
      {
        name: "Files",
        icon: <Folder />,
        link: "buildings.view.files"
      },
      {
        name: "Compliance",
        icon: <Today />,
        link: "buildings.view.compliance"
      }
    ]
  }
];


 */


 export default [
  {
    name: "",
    children: [
      

      {
        name: "Owners",
        icon: <AccountCircle />,
        link: "buildings.view.owners"
      },
      {
        name: "Tenants",
        icon: <AccountCircle />,
        link: "buildings.view.tenants"
      },
      {
        name: "Send Message(s)",
        icon: <Message />,
        link: "messages"
      },
      {
        name: "Files",
        icon: <Folder />,
        link: "buildings.view.files"
      },
      {
        name: "Edit/Delete Building",
        icon: <Edit />,
        link: "buildings.view.edit"
      }
    ]
  }
 ]