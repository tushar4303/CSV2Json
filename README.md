# CSV to JSON Converter API

This project provides an API for converting CSV files to JSON format. The converted JSON data is then uploaded to a PostgreSQL database.

## Endpoints

### `/upload-csv`
- **Method:** `POST`
- **Description:** Upload a CSV file and convert it to JSON.
- **Request:** 
  - Form-data with a file field named `csvFile`

### `/process-local-csv`
- **Method:** `GET`
- **Description:** Process a CSV file from a predefined local location specified in the `.env` file and convert it to JSON.

## Database Structure

The API uploads the converted JSON data to a PostgreSQL database table with the following structure:

```sql
CREATE TABLE public.users (
  id serial PRIMARY KEY,  
  name varchar NOT NULL, 
  age int NOT NULL, 
  address jsonb NULL,  
  additional_info jsonb NULL
);
```

## Environment Variables

The following environment variables are used to configure the application:

- `PORT`: The port on which the server will run (default is `3001`).
- `CSV_FILE_PATH`: The path to the CSV file for the `/process-local-csv` endpoint.

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd <project-directory>
   ```
3. Install dependencies:
   ```sh
   yarn install
   ```

## Running the Application

To start the server, use the following command:

```sh
yarn run
```

By default, the server will run on port `3001`. You can change this by setting the `PORT` environment variable in your `.env` file.

## Example Usage

1. **Upload CSV via `/upload-csv`:**

   ```sh
   curl -X POST http://localhost:3001/upload-csv -F "file=@path/to/your/file.csv"
   ```

2. **Process local CSV via `/process-local-csv`:**

   ```sh
   curl http://localhost:3001/process-local-csv
   ```