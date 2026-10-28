import React from "react";
import ShopPage from "./Shoppage.js";

// The cart page. All the work happens in ShopPage (mode="cart").
export default function Cart({ user, shop }) {
  return <ShopPage mode="cart" user={user} shop={shop} />;
}