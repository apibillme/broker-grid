# Broker Grid

Check out broker - your Real-time Zero-Code API Server - [https://crates.io/crates/broker](https://crates.io/crates/broker)

Broker Grid uses Material Table for React and is a real-time insert-only data-grid for Broker & React.

## API

#### Options

| Name     | Type     | Required | Default                      | Description                                                                                                             |
| -------- | -------- | -------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| endpoint | `string` | `true`   | -                            | The endpoint on the server.                                                                                             |
| event    | `string` | `true`   | -                            | The event to listen for from the SSE.                                                                                   |
| token    | `string` | `true`   | -                            | The JWT token.                                                                                                          |

#### Usage

```jsx
import React from 'react';
import Grid from 'broker-grid';

const App = () => (
  <Grid endpoint={'http://localhost:8000'}, eventListen={'user'}, token={'123'} />
);
```