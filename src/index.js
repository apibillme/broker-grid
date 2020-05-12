import React from 'react';
import { useSSE, SSEProvider } from 'broker-hook';
import MaterialTable from "material-table";
import uuid from 'uuid/v4';
import omit from 'lodash/omit';

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

// insertEndpoint, eventListen, token
const Grid = (props) => {
  const state = useSSE(props.eventListen, {
    initialState: {
      data: {
        events: null,
        rows: null,
        columns: null
      },
    },
    stateReducer(state, changes) {
      return changes;
    },
    parser(input) {
      return JSON.parse(input)
    },
  });

  return <div>{state.data.events != null && 
    <MaterialTable
          icons={tableIcons}
          columns={state.data.columns}
          data={state.data.rows}
          title={props.title}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const id = uuid();
                    const ts = Math.round((new Date()).getTime() / 1000);
                    omit(newData, ['timestamp', 'collection_id']);
                    newData['tenant_id'] = props.tenantID; 
                    const j = JSON.stringify(newData);
                    const v = `{"event": "${props.eventListen}", "collection_id": "${id}", "timestamp": ${ts}, "data": ${j}}`;
                    fetch(props.insertEndpoint, {
                      method: 'post',
                      mode: 'cors',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${props.token}`
                      },
                      body: v
                    }).then(response => {
                      return response.json();
                    }, err => {
                      console.log(err);
                    });
                  };
                  resolve()
                }, 1000)
              }),
            onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  const ts = Math.round((new Date()).getTime() / 1000);
                  omit(newData, ['timestamp', 'collection_id']);
                  const j = JSON.stringify(newData);
                  const v = `{"event": "${props.eventListen}", "tenant_id": "${props.tenantID}", "collection_id": "${oldData.collection_id}", "timestamp": ${ts}, "data": ${j}}`;
                  fetch(props.insertEndpoint, {
                    method: 'post',
                    mode: 'cors',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${props.token}`
                    },
                    body: v
                  }).then(response => {
                    return response.json();
                  }, err => {
                    console.log(err);
                  });
                };
                resolve()
              }, 1000)
            }),
          }}
        />}</div>;
};

// apiEndpoint, eventListen, token
function DataGrid(props) {
  const insertEndpoint = props.insertEndpoint;
  const sseEndpoint = props.sseEndpoint;
  const tenantID = props.tenantID;

  return (
    <div>
      <SSEProvider endpoint={sseEndpoint} options={{headers: {authorization: `Bearer ${props.token}`}}}>
        <Grid insertEndpoint={insertEndpoint} tenantID={tenantID} eventListen={props.eventListen} token={props.token} title={props.title} />
      </SSEProvider>
    </div>
  );
}

export default DataGrid;
