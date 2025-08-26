import { Request, Response } from 'express';
import { ApiResponse } from '../../types/api';
import { Product } from '../../types/product';

// In-memory "database" for demonstration purposes
let products: Product[] = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Keyboard', price: 75 },
  { id: 3, name: 'Mouse', price: 25 },
];
let nextId = 4;

// @desc    Get all products
// @route   GET /api/products
export const getProducts = (req: Request, res: Response<ApiResponse<Product[]>>) => {
  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully.',
    data: products,
  });
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
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

  res.status(200).json({
    success: true,
    message: 'Product retrieved successfully.',
    data: product,
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

  const newProduct: Product = { id: nextId++, name, price };
  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product created successfully.',
    data: newProduct,
  });
};

// @desc    Update a product by ID
// @route   PUT /api/products/:id
export const updateProduct = (req: Request, res: Response<ApiResponse<Product | null>>) => {
  const id = parseInt(req.params.id, 10);
  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found.`,
      data: null,
    });
  }

  const { name, price } = req.body;
  const updatedProduct = { ...products[productIndex], name, price };
  products[productIndex] = updatedProduct;

  res.status(200).json({
    success: true,
    message: 'Product updated successfully.',
    data: updatedProduct,
  });
};

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
export const deleteProduct = (req: Request, res: Response<ApiResponse<null>>) => {
  const id = parseInt(req.params.id, 10);
  const initialLength = products.length;
  products = products.filter((p) => p.id !== id);

  if (products.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found.`,
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully.',
    data: null,
  });
};
