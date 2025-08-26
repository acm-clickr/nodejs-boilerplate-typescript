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

**Example: Returning a list of products**

```typescript
// ... imports and interface definitions
export const getProducts = (req: Request, res: Response<ApiResponse<Product[]>>) => {
  const products: Product[] = [{ id: 1, name: 'Laptop' }];

  return res.status(200).json({
    success: true,
    message: 'Products retrieved successfully.',
    data: products,
  });
};
```

#### Error Response

For a failed request, set `success` to `false`, provide a clear error message, and set `data` to `null`. Always return an appropriate HTTP status code (e.g., 400, 404, 500).

**Example: Handling a "Not Found" error**

```typescript
// ... imports and interface definitions
export const getProductById = (req: Request, res: Response<ApiResponse<Product | null>>) => {
  const { id } = req.params;
  const product = findProduct(id); // Your logic to find the product

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
