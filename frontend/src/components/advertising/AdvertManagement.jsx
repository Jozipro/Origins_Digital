import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid/node";

import { Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import { Link } from "react-router-dom";
import dataTableStyle from "../adminPannel/DataTableStyle";
import useAPI from "../../api/useAPI";
import "../../styles/index.css";

function AdvertManagement() {
  const api = useAPI();
  const [advertInfo, setAdvertInfo] = useState();
  const [advertChanging, setAdvertChanging] = useState(true);

  useEffect(() => {
    api.get("adverts").then((res) => setAdvertInfo(res.data));
  }, [advertChanging]);

  const handleDeleteAdvert = (advert) => {
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer la publicité${advert} ?`
    );

    if (confirmDelete) {
      api
        .delete(`adverts/${advert}`)
        .then(() => {
          // eslint-disable-next-line no-alert
          window.alert(`La publicité ${advert} a été supprimée avec succès`);
        })
        .catch((error) => console.error(error));
      setAdvertChanging(!advertChanging);
    }
  };

  const outputFormatMoment = "DD-MM-YYYY HH:MM:SS";

  const columns = [
    { field: "id", headerName: "advertID", width: 150 },
    { field: "pictures", headerName: "Nom de l'image", width: 350 },
    { field: "picture_link", headerName: "Lien de l'image", width: 350 },
    {
      field: "date_publication",
      headerName: "Date",
      width: 350,
      editable: true,
      renderCell: (params) =>
        moment(params.row.date).format(outputFormatMoment),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 130,
      renderCell: (params) => (
        <button
          type="button"
          style={{
            fontFamily: "PT Sans",
            backgroundColor: "red",
            height: "90%",
            margin: "1em",
            padding: "0.9em",
            borderRadius: "20%",
            border: "none",
          }}
          onClick={() => handleDeleteAdvert(params.row.id)}
        >
          <DeleteIcon style={{ width: "100%" }} />
        </button>
      ),
    },
  ];

  const advertRow = advertInfo?.map((advert) => {
    return {
      id: advert.id,
      pictures: advert.pictures,
      picture_link: advert.picture_link,
    };
  });
  return (
    <div>
      <h1>Publicités</h1>
      <Link to="/advertManagementWindow">
        <PostAddRoundedIcon
          style={{ fontSize: 48, color: "#10bcdd" }}
          className="addButton"
        />
      </Link>
      <div className="user-management">
        <Box
          sx={{
            height: 800,
            width: "100%",
            backgroundColor: "black",
          }}
        >
          {advertInfo && (
            <DataGrid
              rows={advertRow}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              pageSizeOptions={[10, 15, 25]}
              style={dataTableStyle}
              autoHeight
            />
          )}
        </Box>
      </div>
    </div>
  );
}

export default AdvertManagement;
