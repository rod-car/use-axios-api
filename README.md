# @rod-car/use-api

An API utility based on axios for making REST API calls in React applications.

## Installation

```javascript
npm install @rod-car/use-api
```

## Usage

```javascript
import { useApi } from '@rod-car/use-api';

// Example usage
const api = useApi({
  baseUrl: 'https://example.com'
  url: '/resource',
  key: 'data',
});

// Perform API actions using api.Client methods
api.Client.get(); // Fetch data
api.Client.post({ name: 'John Doe' }); // Create a new record
api.Client.put(1, { name: 'Updated Name' }); // Update a record
api.Client.find(1); // Find a record by ID
api.Client.patch(1, { partialData: 'Updated Data' }); // Partially update a record
api.Client.destroy(1); // Delete a record
```

## API Reference

### `useApi(options: APIProps)`

Initialize the API utility.

- `options`:
  - `baseUrl` (string): Base URL of the resources. It is optional.
  - `url` (string): URL of the resource excluding the base URL.
  - `key` (string): Key containing the data returned by the server. It is optional.

Returns an object with the following properties:

- `resetError()`: Reset the error state.
- `datas` (array): Array of data fetched from the server.
- `data`: Single data object fetched from the server.
- `RequestState`: Object indicating the current request state.
  - `loading (boolean)`: Indicates if a request is in progress.
  - `creating (boolean)`: Indicates if a creation request is in progress.
  - `updating (boolean)`: Indicates if an update request is in progress.
  - `deleting (boolean)`: Indicates if a deletion request is in progress.
- `error`: APIError object representing the error state.
- `success`: Boolean indicating the success state.
- `Client`: Object with methods for performing API actions.

### Methods in `Client`

- `get(params?: Record<string, string | number>)`: Fetch a list of data.
- `find(id: string | number, params?: Record<string, string | number>)`: Find a record by ID.
- `post(data: Omit<T, "id">)`: Create a new record.
- `put(id: string | number, data: Omit<T, "id">)`: Update a record.
- `patch(id: string | number, data: Partial<Omit<T, "id">>)`: Partially update a record.
- `destroy(id: string | number)`: Delete a record.

## License

This package is released under the [MIT License](LICENSE).