import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload.jsx/AppDownload";

const Home = ({ user, setShowLogin }) => {  // ✅ Nhận props từ App
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      {/* ✅ Truyền xuống FoodDisplay */}
      <FoodDisplay category={category} user={user} setShowLogin={setShowLogin} />
      <AppDownload />
    </div>
  );
};

export default Home;
