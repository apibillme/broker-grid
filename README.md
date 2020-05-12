# Broker Grid

Check out broker - your Real-time Zero-Code API Server - [https://crates.io/crates/broker](https://crates.io/crates/broker)

Broker Grid uses Material Table for React and is a real-time insert-only data-grid for Broker & React.

## API

#### Options

| Name           | Type     | Required | Default                      | Description                                                                                                             |
| --------       | -------- | -------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| insertEndpoint | `string` | `true`   | -                            |                                                                                                                         |
| sseEndpoint    | `string` | `true`   | -                            | The endpoint on the server.                                                                                             |
| event          | `string` | `true`   | -                            | The event to listen for from the SSE.                                                                                   |
| token          | `string` | `true`   | -                            | The JWT token.                                                                                                          |
| title          | `string` | `true`   | -                            | The title for the data grid to display.                                                                                 |

#### Usage

```jsx
import React from 'react';
import Grid from 'broker-grid';

const App = () => (
  <Grid sseEndpoint={'http://localhost:8080/events/112718d1-a0be-4468-b902-0749c3d964ae'} insertEndpoint={'http://localhost:3000/insert'} eventListen={'user'} token={'123'} title={'Broker Demo'} />
);
```
