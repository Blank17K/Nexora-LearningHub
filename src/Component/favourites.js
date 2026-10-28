import React from "react";
import ShopPage from "./Shoppage.js";

// The favourites page. All the work happens in ShopPage (mode="favourites").
export default function Favourites({ user, shop }) {
  return <ShopPage mode="favourites" user={user} shop={shop} />;
}