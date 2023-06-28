import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/index.css";
import useAPI from "../../api/useAPI";

function SectionUpdate() {
  const { id } = useParams();
  const api = useAPI();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [getSections, setGetSections] = useState([]);
  const [orderInput, setOrderInput] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [sectionOrder, setSectionOrder] = useState([]);
  const [sectionData, setSectionData] = useState({
    id: "",
    name: "",
    section_type: "",
    order: 0,
  });
  const options = [
    "",
    "section avec catégorie",
    "section sans catégorie",
    "section teasers",
    "section hero",
    "section grande hauteur",
  ];

  useEffect(() => {
    const getSectionsData = async () => {
      await api.get(`sections/${id}`).then((res) => {
        setSectionData(res.data);
      });
    };
    getSectionsData();
  }, [id]);

  useEffect(() => {
    const getSectionsOrder = async () => {
      await api.get(`sections`).then((res) => {
        setGetSections(res.data);
        const orders = [];
        for (let i = 0; i < res.data.length; i += 1) {
          orders.push(res.data[i].order);
        }
        setSectionOrder(orders);
      });
    };
    getSectionsOrder();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "order") {
      // Pour récupérer l'order qui est sélectionné par l'utilisateur dans le select
      const newOrder = Number(value);
      setOrderInput(newOrder);
    }

    setSectionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function updateSectionData() {
    console.info("valeur entrante update", orderInput);
    if (sectionOrder.includes(orderInput)) {
      const duplicateSection = getSections.filter(
        (section) => section.order === orderInput
      );
      console.info("la section dupliquée est : ", duplicateSection);
      console.info(
        "l'ordre de la section dupliquée est : ",
        duplicateSection[0].order
      );
      if (orderInput === duplicateSection[0].order)
        console.info("condition validée");
      try {
        api.put(`sections/${duplicateSection[0].id}`, {
          name: duplicateSection[0].name,
          order:
            duplicateSection[0].order +
            (duplicateSection[0].order - orderInput),
          section_type: duplicateSection[0].section_type,
        });

        await api.put(`sections/${sectionData.id}`, {
          name: sectionData.name,
          order: orderInput,
          section_type: sectionData.section_type,
        });

        navigate("/adminPanel/sectionsTable");
      } catch (err) {
        setError(true);
        if (err.response.status === 409) {
          setErrorMessage("Cette entrée existe déjà");
        } else {
          setErrorMessage("Une erreur est survenue");
        }
      }
    } else {
      api
        .put(`sections/${sectionData.id}`, {
          name: sectionData.name,
          order: sectionData.order,
          section_type: sectionData.section_type,
        })
        .then(() => {
          navigate("/adminPanel/sectionsTable");
        })
        .catch((err) => {
          setError(true);
          if (err.response.status === 409) {
            setErrorMessage("Cette entrée existe déjà");
          } else {
            setErrorMessage("Une erreur est survenue");
          }
        });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(false);
    updateSectionData();
  }

  return (
    <div className="sectionUpdate">
      <h2 className="sectionUpdateTitle">Page de section</h2>
      <form className="sectionUpdateForm" onSubmit={handleSubmit}>
        <div className="sectionUpdateId">
          <label htmlFor="id">Identifiant de la section :</label>
          <input
            type="text"
            placeholder="id"
            value={sectionData.id}
            className="sectionUpdateInput"
            onChange={handleChange}
            name="id"
            disabled
          />
        </div>
        <div className="sectionUpdateName">
          <label htmlFor="name">Nom de la section :</label>
          <input
            type="text"
            placeholder="Section Name"
            className="sectionUpdateInput"
            value={sectionData.name}
            onChange={handleChange}
            name="name"
          />
          <div className="sectionUpdateOrder">
            <label htmlFor="name">Ordre :</label>
            <input
              type="number"
              placeholder="Ordre"
              className="sectionUpdateInput"
              value={sectionData.order}
              onChange={handleChange}
              name="order"
              min="1"
              max="10"
              style={{ border: error ? "1px solid red" : "" }}
            />
          </div>

          {error && <p>{errorMessage}</p>}

          <div className="sectionUpdateSectionType">
            <label htmlFor="name">Type de la section :</label>
            <select
              id="section_type"
              value={sectionData.section_type}
              onChange={handleChange}
              name="section_type"
            >
              {options.map((option, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="sectionUpdateButton">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}

export default SectionUpdate;
