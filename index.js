import React from 'react';
import { useSSE, SSEProvider } from 'broker-hook';
import MaterialTable from "material-table";
import uuid from 'uuid/v4';
import omit from 'lodash/omit';

// insertEndpoint, eventListen, token
const Grid = (props) => {
  const state = useSSE(eventListen, {
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
          title="Demo Title"
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const id = uuid();
                    const ts = Math.round((new Date()).getTime() / 1000);
                    omit(newData, ['timestamp', 'collection_id']);
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
                  const v = `{"event": "${props.eventListen}", "collection_id": "${oldData.collection_id}", "timestamp": ${ts}, "data": ${j}}`;
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
  const insertEndpoint = props.endpoint + '/insert';
  const sseEndpoint = props.endpoint + '/events';

  return (
    <div>
      <SSEProvider endpoint={sseEndpoint} options={{headers: {authorization: `Bearer ${props.token}`}}}>
        <Grid insertEndpoint={insertEndpoint} eventListen={props.eventListen} token={props.token} />
      </SSEProvider>
    </div>
  );
}

export default DataGrid;
