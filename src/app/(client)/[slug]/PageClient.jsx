"use client";
import React from "react";

const PageClient = ({ dataContent }) => {
  return (
    <>
      {dataContent.html && (
        <div dangerouslySetInnerHTML={{ __html: dataContent.html }} />
      )}
      {dataContent.css && (
        <style dangerouslySetInnerHTML={{ __html: dataContent.css }} />
      )}
    </>
  );
};

export default PageClient;
