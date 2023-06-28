import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid/node";
import { Box } from "@mui/material";
import "../../styles/index.css";
import { DeleteOutline } from "@mui/icons-material";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import { Link } from "react-router-dom";
import dataTableStyle from "./DataTableStyle";
import useAPI from "../../api/useAPI";

function SectionsManagement() {
  const [data, setData] = useState([]);
  const api = useAPI();

  const getSectionsData = async () => {
    await api.get("sections").then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    getSectionsData();
  }, []);

  const sections = data.map((section) => ({
    id: section.id,
    name: section.name,
    section_type: section.section_type,
    order: section.order,
  }));

  const deleteSection = async (id) => {
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm(
      ` Êtes-vous sûr de vouloir supprimer la section ${id} `
    );

    if (confirmDelete) {
      await api.delete(`sections/${id}`);
      getSectionsData();
    }
  };

  const columns = [
    { field: "id", headerName: "Section id", width: 250 },
    {
      field: "name",
      headerName: "Section name",
      width: 350,
      editable: true,
      type: "string",
    },
    {
      field: "section_type",
      headerName: "Section type",
      width: 350,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        "section avec catégorie",
        "section sans catégorie",
        "section teasers",
        "section hero",
      ],
    },
    {
      field: "order",
      headerName: "Ordre",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/sections/${params.row.id}`}>
              <button className="sectionEditBtn" type="submit">
                Edit
              </button>
            </Link>
            <DeleteOutline
              className="sectionDeleteBtn"
              onClick={() => deleteSection(params.row.id)}
            />
          </>
        );
      },
    },
  ];
  return (
    <div style={{ maxWidth: "100%" }}>
      <h1>Sections</h1>
      <Link to="/newSection">
        <PostAddRoundedIcon
          style={{ fontSize: 48, color: "#10bcdd" }}
          className="addButton"
        />
      </Link>
      <Box
        sx={{
          height: 800,
          width: "100%",
          backgroundColor: "black",
        }}
      >
        <DataGrid
          rows={sections}
          columns={columns}
          rowsPerPageOptions={[5, 10, 20]}
          style={dataTableStyle}
        />
        <div style={{ backgroundColor: "black", height: "500px" }} />
      </Box>
    </div>
  );
}

export default SectionsManagement;
