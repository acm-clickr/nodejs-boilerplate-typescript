# Node.js Boilerplate

This is a boilerplate for a Node.js application using Express and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### How to Use This Template

1.  **Create a new repository from this template:**
    Click the `Use this template` button at the top of the repository's page on GitHub. This will create a new repository in your own GitHub account with a copy of all the files.

2.  **Clone your new repository:**
    Replace `<your-new-repository-url>` with the URL of the repository you just created.
    ```bash
    git clone <your-new-repository-url>
    ```

3.  **Navigate to the project directory:**
    Replace `<your-new-repository-name>` with the name of your new repository.
    ```bash
    cd <your-new-repository-name>
    ```

4.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Project

-   **Development Mode:**
    This will start the server with `nodemon`, which automatically restarts the server on file changes.
    ```bash
    npm run dev
    ```
-   **Production Mode:**
    First, you need to build the TypeScript files into JavaScript.
    ```bash
    npm run build
    ```
    Then, start the server.
    ```bash
    npm start
    ```
    The server will be running on the port specified in your `.env` file or on port 3000 by default.

## Security

This boilerplate includes several security middleware packages to protect your application:

-   **`helmet`**: Sets various HTTP headers to help secure your Express apps.
-   **`cors`**: Enables Cross-Origin Resource Sharing with various options.
-   **`express-mongo-sanitize`**: Sanitizes user-supplied data to prevent MongoDB operator injection.
-   **`xss-clean`**: Sanitizes user input to prevent Cross-Site Scripting (XSS) attacks.

These are enabled by default in `src/app.ts`.

## How to Add a New Route

Follow these steps to add a new feature endpoint. The project includes a complete CRUD example for a `/products` endpoint which you can use as a reference.

### 1. Define the Type

If you are adding a new data model, define its structure in a new file inside `src/types/`.

**`src/types/product.ts`**
```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
}
```

### 2. Create a New Controller

Create a file in `src/api/controllers/` to house the logic for your endpoints. See `src/api/controllers/products.ts` for a full CRUD implementation.

**`src/api/controllers/products.ts` (Excerpt)**
```typescript
import { Request, Response } from 'express';
import { ApiResponse } from '../../types/api';
import { Product } from '../../types/product';

// ... in-memory database setup ...

// @desc    Get all products
// @route   GET /api/products
export const getProducts = (req: Request, res: Response<ApiResponse<Product[]>>) => {
  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully.',
    data: products,
  });
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = (req: Request, res: Response<ApiResponse<Product | null>>) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input. Name and price are required.',
      data: null,
    });
  }
  // ... creation logic
};
```

### 3. Create a New Route File

Create a file in `src/api/routes/` to define the endpoints and connect them to your controller functions.

**`src/api/routes/products.ts`**
```typescript
import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products';

const router = Router();

router.route('/').get(getProducts).post(createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
```

### 4. Register the New Route

Finally, open `src/api/routes/index.ts` and import and use your new route module.

**`src/api/routes/index.ts`**
```typescript
import { Router } from 'express';
import products from './products';

const router = Router();

router.use('/products', products);

export default router;
```

## Standard API Response Format

To ensure consistency, all API responses (both success and error) should follow a standardized format. This is enforced using a generic `ApiResponse<T>` interface.

**Location:** `src/types/api.ts`

```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T; // For errors, this is typically null
}
```

### Example Usage

When creating a controller, use this interface as the type for the `Response` object from Express. The generic `T` should be replaced with the specific type of the `data` you are returning.

#### Success Response

For a successful request, set `success` to `true`, provide a relevant message, and include the payload in the `data` property.

**Example: `GET /api/products`**

```typescript
// From src/api/controllers/products.ts
export const getProducts = (req: Request, res: Response<ApiResponse<Product[]>>) => {
  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully.',
    data: products, // where products is of type Product[]
  });
};
```

#### Error Response

For a failed request, set `success` to `false`, provide a clear error message, and set `data` to `null`. Always return an appropriate HTTP status code (e.g., 400, 404, 500).

**Example: `GET /api/products/:id` (Not Found)**

```typescript
// From src/api/controllers/products.ts
export const getProductById = (req: Request, res: Response<ApiResponse<Product | null>>) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found.`,
      data: null,
    });
  }
  // ... success case
};
```

## Database Integration

The project is set up to use environment variables for database configurations. Add your database connection strings to the `.env` file.

### Connecting to MongoDB

1.  **Install Mongoose:**
    ```bash
    npm install mongoose
    ```
2.  **Add Connection String to `.env`:**
    ```
    MONGO_URI=mongodb://localhost:27017/mydatabase
    ```
3.  **Create a Database Config File:**
    Create a file like `src/config/database.ts` to handle the connection.

    **`src/config/database.ts`**
    ```typescript
    import mongoose from 'mongoose';

    const connectDB = async () => {
      try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB connected successfully.');
      } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure
      }
    };

    export default connectDB;
    ```
4.  **Initialize the Connection:**
    Call the `connectDB` function in your main application file, `src/app.ts`.

    **`src/app.ts`**
    ```typescript
    // ... other imports
    import connectDB from './config/database';

    // Connect to the database
    connectDB();

    const app = express();
    // ... rest of the file
    ```

### Connecting to PostgreSQL

1.  **Install `pg` driver:**
    ```bash
    npm install pg
    npm install -D @types/pg
    ```
2.  **Add Connection String to `.env`:**
    ```
    PG_URI=postgres://user:password@host:port/database
    ```
3.  **Create a Database Config File:**
    Create a file like `src/config/database.ts` (or modify the existing one).

    **`src/config/database.ts`**
    ```typescript
    import { Pool } from 'pg';

    const pool = new Pool({
      connectionString: process.env.PG_URI,
    });

    pool.on('connect', () => {
      console.log('PostgreSQL connected successfully.');
    });

    pool.on('error', (err) => {
      console.error('PostgreSQL connection error:', err);
      process.exit(1);
    });

    export default pool;
    ```
4.  **Use the Connection Pool:**
    You can now import the `pool` object in your controllers or services to query the database.

    **Example Query in a Controller:**
    ```typescript
    import pool from '../../config/database';

    export const getProducts = async (req: Request, res: Response) => {
      try {
        const result = await pool.query('SELECT * FROM products');
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
      }
    };
    ```