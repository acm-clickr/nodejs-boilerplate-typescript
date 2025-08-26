# Node.js Boilerplate

This is a boilerplate for a Node.js application using Express and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone git@github.com:acm-clickr/nodejs-boilerplate-typescript.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd node-js-boilerplate
    ```
3.  Install dependencies:
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

## How to Add a New Route

Follow these steps to add a new feature endpoint (e.g., `/products`).

### 1. Create a New Controller

Create a new file in `src/api/controllers/`. For this example, let's call it `product.ts`.

**`src/api/controllers/product.ts`**
```typescript
import { Request, Response } from 'express';

// Handler for GET /api/products
export const getProducts = (req: Request, res: Response) => {
  // Your logic to fetch products
  res.status(200).json([{ id: 1, name: 'Laptop' }, { id: 2, name: 'Keyboard' }]);
};

// Handler for POST /api/products
export const createProduct = (req: Request, res: Response) => {
  const { name, price } = req.body;
  // Your logic to create a new product
  res.status(201).json({ message: 'Product created', product: { name, price } });
};
```

### 2. Create a New Route File

Create a new file in `src/api/routes/` to define the endpoints for your new feature. Let's call it `product.ts`.

**`src/api/routes/product.ts`**
```typescript
import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/product';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);

export default router;
```

### 3. Register the New Route

Finally, open `src/api/routes/index.ts` and import and use your new route module.

**`src/api/routes/index.ts`**
```typescript
import { Router } from 'express';
import sample from './sample';
import product from './product'; // 1. Import the new route

const router = Router();

router.use('/sample', sample);
router.use('/products', product); // 2. Use the new route with a base path

export default router;
```
Your new endpoints `GET /api/products` and `POST /api/products` are now active.

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
