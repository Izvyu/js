import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Layout from "./Layout";

export default function LayoutOrPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const solo = params.get("solo") === "true";

  return solo ? <Outlet /> : <Layout />;
}