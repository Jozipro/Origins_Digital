import React, { useState, useEffect } from "react";
import "../styles/index.css";
import Featured from "../components/Sections/Featured";
import SectionTeasers from "../components/Sections/SectionTeasers";
import Section1 from "../components/Sections/Section1";
import SectionVideosHautes from "../components/Sections/SectionVideosHautes";
import SectionCategory from "../components/Sections/SectionCategory";
import useApi from "../api/useAPI";

const sectionType = (data) => {
  switch (data.section_type) {
    case "section avec catégorie":
      return <SectionCategory sectionInfo={data} />;
    case "section sans catégorie":
      return <Section1 sectionInfo={data} />;
    case "section teasers":
      return <SectionTeasers sectionInfo={data} />;
    case "section hero":
      return <Featured sectionInfo={data} />;
    case "section grande hauteur":
      return <SectionVideosHautes sectionInfo={data} />;
    default:
      return null;
  }
};

function Homepage2() {
  const [data, setData] = useState([]);
  const api = useApi();

  const getSectionData = async () => {
    await api
      .get("sections")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getSectionData();
  }, []);

  return (
    <div>
      {data.map((section) => {
        return <div key={section.id}>{sectionType(section)}</div>;
      })}
    </div>
  );
}

export default Homepage2;
