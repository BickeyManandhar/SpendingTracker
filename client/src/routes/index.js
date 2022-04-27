import React from "react";
import { Routes, Route } from "react-router-dom";

import MainIndex from "../screens/MainIndex";
import ShopScreen from "../screens/Shop/ShopScreen";

function Index() {
  return (
    <Routes>
      <Route path="/" element={<MainIndex />} />
      <Route path="/shop" element={<ShopScreen />} />
    </Routes>
  );
}
export default Index;
