"use client";

import { IVinyl } from "@/lib/models/vinyl";
import React from "react";
import { ICellRendererParams, RowStyle } from "ag-grid-community";
import AddVinyl from "./AddVinyl";
import Loading from "../shared/Loading";
import List from "../shared/List";

export default function VinylList(props: { vinyls: IVinyl[] }) {
  const [loading, setLoading] = React.useState(false);

  const newVinyl = {
    _id: "",
    name: "",
    artistName: "",
    purchased: false,
    archive: false,
    addedByID: "",
    userGroupID: "",
  };

  const formatter = (params: { data: IVinyl }): any => {
    return params.data.purchased ? {backgroundColor: '#5865F2', color: 'white'} : {backgroundColor: '#FDFD96', color: 'black'};
  };

  return loading ? (
    <Loading />
  ) : (
    <List
      records={props.vinyls}
      potName="Vinyl"
      rowFormatter={formatter}
      columns={[
        {
          headerName: "Name",
          field: "name",
          resizable: false,
          minWidth: 200,
        },
        {
          headerName: "Artist",
          field: "artistName",
          cellClass: "justify-center",
          resizable: false,
          minWidth: 200,
        },
        {
          headerName: "Purchased",
          field: "purchased",
          cellClass: "justify-center",
          resizable: false,
          minWidth: 200,
          cellRenderer: ((params: ICellRendererParams) => {
            return params.value === true ? "Yes" : "No";
          }),
        },
      ]}
      filterColumns={["name", "artistName"]}
      addRecordComp={<AddVinyl vinyl={newVinyl} />}
    />
  );
}
