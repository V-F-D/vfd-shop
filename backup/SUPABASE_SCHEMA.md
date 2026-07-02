# Victory Fashion Designers - Supabase Database Schema

This document contains the SQL schema for the VFD e-commerce database.

## 📋 Database Tables

### 1. Products Table

Stores all available products in the shop.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    badge VARCHAR(50),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- Sample data
INSERT INTO products (name, category, price, description, image_url, badge, stock_quantity) VALUES
('Elegant Evening Dress', 'dresses', 5500, 'Stunning evening dress with modern cut', 'assets/images/A.webp', 'New', 10),
('African Print Maxi', 'african', 4200, 'Beautiful African print maxi dress', 'assets/images/B.webp', NULL, 15),
('Custom Tailored Suit', 'suits', 12000, 'Premium tailored suit for men', 'assets/images/C.webp', 'Popular', 5),
('Ankara Dress', 'african', 3800, 'Vibrant Ankara print dress', 'assets/images/D.webp', NULL, 20);
```

### 2. Orders Table

Stores customer orders.

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    delivery_address TEXT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    checkout_request_id VARCHAR(100),
    mpesa_transaction_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_checkout_id ON orders(checkout_request_id);
```

### 3. Order Items Table

Stores individual items within each order.

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### 4. Payments Table

Stores M-Pesa payment transactions.

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    merchant_request_id VARCHAR(100),
    checkout_request_id VARCHAR(100) UNIQUE,
    mpesa_receipt_number VARCHAR(100),
    phone_number VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE,
    result_code INTEGER,
    result_desc TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    payment_type VARCHAR(50) DEFAULT 'stk_push',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_payments_checkout_id ON payments(checkout_request_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_phone ON payments(phone_number);
```

### 5. C2B Payments Table

Stores manual PayBill payments.

```sql
CREATE TABLE c2b_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    transaction_type VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    phone_number VARCHAR(20),
    bill_ref_number VARCHAR(100),
    customer_name VARCHAR(255),
    transaction_time VARCHAR(50),
    status VARCHAR(50) DEFAULT 'completed',
    matched_order_id UUID REFERENCES orders(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_c2b_transaction_id ON c2b_payments(transaction_id);
CREATE INDEX idx_c2b_bill_ref ON c2b_payments(bill_ref_number);
```

### 6. Enrollments Table (Training)

Stores course enrollment data.

```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    id_number VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    county VARCHAR(100),
    education_level VARCHAR(100),
    has_experience VARCHAR(10),
    emergency_name VARCHAR(255),
    emergency_relationship VARCHAR(100),
    emergency_phone VARCHAR(20),
    intake_month VARCHAR(50),
    study_mode VARCHAR(50),
    additional_info TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_enrollments_email ON enrollments(email);
CREATE INDEX idx_enrollments_phone ON enrollments(phone);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

## 🔒 Row Level Security (RLS)

Enable RLS for secure data access:

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE c2b_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Public can view active products"
    ON products FOR SELECT
    USING (is_active = true);

-- Customers can view their own orders
CREATE POLICY "Customers can view own orders"
    ON orders FOR SELECT
    USING (customer_phone = current_setting('request.jwt.claims')::json->>'phone');

-- Service role can do everything (for API calls)
CREATE POLICY "Service role full access products"
    ON products FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access orders"
    ON orders FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access payments"
    ON payments FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access c2b"
    ON c2b_payments FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access enrollments"
    ON enrollments FOR ALL
    USING (auth.role() = 'service_role');
```

## 📊 Useful Views

### Order Summary View

```sql
CREATE VIEW order_summary AS
SELECT
    o.id,
    o.order_number,
    o.customer_name,
    o.customer_phone,
    o.total,
    o.status,
    o.payment_status,
    o.created_at,
    COUNT(oi.id) as item_count,
    p.mpesa_receipt_number
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN payments p ON o.id = p.order_id
GROUP BY o.id, p.mpesa_receipt_number;
```

## 🔧 Functions

### Update timestamp trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🚀 Setup Instructions

1. **Create Supabase Project**

   - Go to https://supabase.com
   - Create new project
   - Wait for setup to complete

2. **Run SQL Schema**

   - Go to SQL Editor in Supabase Dashboard
   - Copy and paste the SQL above
   - Run each section in order

3. **Get API Keys**

   - Go to Project Settings → API
   - Copy `Project URL` and `anon public` key
   - Copy `service_role` key (keep secret!)

4. **Add to Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 📝 Notes

- All monetary values use DECIMAL(10, 2) for precision
- Timestamps use TIMESTAMP WITH TIME ZONE for proper timezone handling
- UUIDs are used for primary keys for better scalability
- Indexes are created on frequently queried columns
- RLS ensures data security
