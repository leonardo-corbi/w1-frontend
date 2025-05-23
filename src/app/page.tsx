"use client";

import React from "react";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    window.location.href = "/login";
  }, []);
  return <div className="bg-black min-h-screen w-full"></div>;
}
