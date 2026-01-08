# 📊 VFD Database - Current Schema Documentation

**Last Updated:** January 8, 2026  
**Database:** Supabase PostgreSQL  
**Project URL:** https://vjhrmxfsiwmbeuswdagb.supabase.co

> ⚠️ **WARNING:** This schema is for documentation and context only. Do not run this as SQL.
> Table order and constraints may not be valid for direct execution.

---

## 📋 Tables Overview

| Table              | Purpose                  | RLS Status | Public Access                 |
| ------------------ | ------------------------ | ---------- | ----------------------------- |
| `products`         | Store products           | Disabled   | Read-only for active products |
| `orders`           | Customer orders          | Disabled   | Customers can view own orders |
| `order_items`      | Order line items         | Disabled   | No policies                   |
| `payments`         | M-Pesa payments          | Enabled    | Service role only             |
| `c2b_payments`     | PayBill payments         | Enabled    | Service role only             |
| `contact_messages` | Contact form submissions | Disabled   | Anyone can insert             |
| `enrollments`      | Course enrollments       | Disabled   | Service role only             |

---

## 🗄️ Table Structures

### 1. Products Table

Stores all available products in the shop.

```sql
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  category character varying NOT NULL,
  price numeric NOT NULL,
  description text,
  image_url text,
  badge character varying,
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
```

**Columns:**

- `id` - UUID primary key
- `name` - Product name (required)
- `category` - Product category (e.g., 'dresses', 'tops', 'accessories')
- `price` - Product price in KSh
- `description` - Product description
- `image_url` - URL to product image
- `badge` - Optional badge text (e.g., 'New', 'Sale', 'Popular')
- `stock_quantity` - Available stock (default: 0)
- `is_active` - Whether product is visible in shop (default: true)
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated

---

### 2. Orders Table

Stores customer orders.

```sql
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_number character varying NOT NULL UNIQUE,
  customer_name character varying NOT NULL,
  customer_phone character varying NOT NULL,
  customer_email character varying,
  delivery_address text NOT NULL,
  subtotal numeric NOT NULL,
  delivery_fee numeric NOT NULL,
  total numeric NOT NULL,
  status character varying DEFAULT 'pending'::character varying,
  payment_status character varying DEFAULT 'pending'::character varying,
  checkout_request_id character varying,
  mpesa_transaction_id character varying,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
```

**Columns:**

- `id` - UUID primary key
- `order_number` - Unique order identifier (e.g., 'ORD1234567890')
- `customer_name` - Customer full name
- `customer_phone` - Customer phone number (M-Pesa format: 254XXXXXXXXX)
- `customer_email` - Customer email (optional)
- `delivery_address` - Delivery address
- `subtotal` - Order subtotal before delivery
- `delivery_fee` - Delivery fee (0 for orders >= KSh 5000)
- `total` - Total amount (subtotal + delivery_fee)
- `status` - Order status ('pending', 'completed', 'cancelled')
- `payment_status` - Payment status ('pending', 'paid', 'failed')
- `checkout_request_id` - M-Pesa STK Push request ID
- `mpesa_transaction_id` - M-Pesa receipt number
- `notes` - Admin notes
- `created_at` - Order timestamp
- `updated_at` - Last update timestamp

---

### 3. Order Items Table

Stores individual items within each order.

```sql
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid,
  product_id uuid,
  product_name character varying NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  subtotal numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
```

**Columns:**

- `id` - UUID primary key
- `order_id` - Foreign key to orders table
- `product_id` - Foreign key to products table
- `product_name` - Product name (snapshot)
- `quantity` - Quantity ordered
- `price` - Price per unit at time of order
- `subtotal` - Total for this line item (quantity × price)
- `created_at` - Timestamp

**Foreign Keys:**

- `order_id` → `orders(id)` (ON DELETE CASCADE)
- `product_id` → `products(id)`

---

### 4. Payments Table

Stores M-Pesa STK Push payment transactions.

```sql
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid,
  merchant_request_id character varying,
  checkout_request_id character varying UNIQUE,
  mpesa_receipt_number character varying,
  phone_number character varying NOT NULL,
  amount numeric NOT NULL,
  transaction_date timestamp with time zone,
  result_code integer,
  result_desc text,
  status character varying DEFAULT 'pending'::character varying,
  payment_type character varying DEFAULT 'stk_push'::character varying,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
```

**Columns:**

- `id` - UUID primary key
- `order_id` - Foreign key to orders table
- `merchant_request_id` - M-Pesa merchant request ID
- `checkout_request_id` - M-Pesa checkout request ID (unique)
- `mpesa_receipt_number` - M-Pesa transaction receipt
- `phone_number` - Customer phone number
- `amount` - Payment amount
- `transaction_date` - When payment was completed
- `result_code` - M-Pesa result code (0 = success)
- `result_desc` - M-Pesa result description
- `status` - Payment status ('pending', 'completed', 'failed')
- `payment_type` - Type of payment ('stk_push')
- `error_message` - Error details if failed
- `created_at` - Timestamp
- `updated_at` - Last update timestamp

**Foreign Keys:**

- `order_id` → `orders(id)`

---

### 5. C2B Payments Table

Stores manual PayBill (Customer-to-Business) payments.

```sql
CREATE TABLE public.c2b_payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  transaction_id character varying NOT NULL UNIQUE,
  transaction_type character varying,
  amount numeric NOT NULL,
  phone_number character varying,
  bill_ref_number character varying,
  customer_name character varying,
  transaction_time character varying,
  status character varying DEFAULT 'completed'::character varying,
  matched_order_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT c2b_payments_pkey PRIMARY KEY (id),
  CONSTRAINT c2b_payments_matched_order_id_fkey FOREIGN KEY (matched_order_id) REFERENCES public.orders(id)
);
```

**Columns:**

- `id` - UUID primary key
- `transaction_id` - M-Pesa transaction ID (unique)
- `transaction_type` - Type of transaction
- `amount` - Payment amount
- `phone_number` - Customer phone
- `bill_ref_number` - Reference number used (can match order_number)
- `customer_name` - Customer name from M-Pesa
- `transaction_time` - Transaction timestamp from M-Pesa
- `status` - Payment status (default: 'completed')
- `matched_order_id` - Linked order if matched (optional)
- `created_at` - Timestamp

**Foreign Keys:**

- `matched_order_id` → `orders(id)`

---

### 6. Contact Messages Table

Stores contact form submissions from the website.

```sql
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  email character varying,
  phone character varying NOT NULL,
  subject character varying,
  message text NOT NULL,
  status character varying DEFAULT 'new'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);
```

**Columns:**

- `id` - UUID primary key
- `name` - Sender name
- `email` - Sender email (optional)
- `phone` - Sender phone number
- `subject` - Message subject/category
- `message` - Message content
- `status` - Message status ('new', 'read', 'replied')
- `created_at` - Submission timestamp

---

### 7. Enrollments Table

Stores course enrollment applications.

```sql
CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  full_name character varying NOT NULL,
  date_of_birth date NOT NULL,
  gender character varying,
  id_number character varying,
  email character varying NOT NULL,
  phone character varying NOT NULL,
  address text,
  city character varying,
  county character varying,
  education_level character varying,
  has_experience character varying,
  emergency_name character varying,
  emergency_relationship character varying,
  emergency_phone character varying,
  intake_month character varying,
  study_mode character varying,
  additional_info text,
  status character varying DEFAULT 'pending'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT enrollments_pkey PRIMARY KEY (id)
);
```

**Columns:**

- `id` - UUID primary key
- `full_name` - Applicant full name
- `date_of_birth` - Date of birth
- `gender` - Gender
- `id_number` - National ID number
- `email` - Email address
- `phone` - Phone number
- `address` - Residential address
- `city` - City
- `county` - County
- `education_level` - Highest education level
- `has_experience` - Fashion experience ('yes'/'no')
- `emergency_name` - Emergency contact name
- `emergency_relationship` - Relationship to emergency contact
- `emergency_phone` - Emergency contact phone
- `intake_month` - Preferred intake month
- `study_mode` - Study mode preference
- `additional_info` - Additional notes
- `status` - Application status ('pending', 'approved', 'rejected')
- `created_at` - Application timestamp
- `updated_at` - Last update timestamp

---

## 🔒 Row Level Security (RLS) Policies

### Products Table

**RLS Status:** Disabled ⚠️

**Policies:**

1. **Public can view active products** (SELECT)

   - Applied to: `public` role
   - Anyone can read active products via the Data API

2. **Service role full access products** (ALL)
   - Applied to: `public` role
   - Admin/backend has full access using service role key

---

### Orders Table

**RLS Status:** Disabled ⚠️

**Policies:**

1. **Customers can view own orders** (SELECT)

   - Applied to: `public` role
   - Customers can view their own orders (by phone number match)

2. **Service role full access orders** (ALL)
   - Applied to: `public` role
   - Admin/backend has full access

---

### Order Items Table

**RLS Status:** Disabled ⚠️

**Policies:**

- ⚠️ No policies created yet
- Table is accessible by anyone via the Data API

---

### Payments Table

**RLS Status:** Enabled ✅

**Policies:**

1. **Service role full access payments** (ALL)
   - Applied to: `public` role
   - Only service role can access payment data

---

### C2B Payments Table

**RLS Status:** Enabled ✅

**Policies:**

1. **Service role full access c2b** (ALL)
   - Applied to: `public` role
   - Only service role can access C2B payment data

---

### Contact Messages Table

**RLS Status:** Disabled ⚠️

**Policies:**

1. **Anyone can submit contact form** (INSERT)
   - Applied to: `public` role
   - Anyone can submit contact messages via the form

---

### Enrollments Table

**RLS Status:** Disabled ⚠️

**Policies:**

1. **Service role full access enrollments** (ALL)
   - Applied to: `public` role
   - Only service role can access enrollment data

---

## 🔑 API Keys & Access

### Anon Key (Public)

- Used by: Frontend (shop, forms)
- Access: Read public products, submit forms/enrollments
- URL: `https://vjhrmxfsiwmbeuswdagb.supabase.co`

### Service Role Key (Private)

- Used by: API routes, admin panel
- Access: Full access to all tables
- **Keep this secret!** Never expose in frontend code

---

## ⚠️ Security Notes

1. **RLS Disabled on Most Tables**

   - `products`, `orders`, `order_items`, `contact_messages`, `enrollments` have RLS disabled
   - These tables are accessible via the Data API
   - Security relies on policies and service role key

2. **Recommended Actions:**

   - Consider enabling RLS on `orders` and `order_items`
   - Add proper policies for customer data protection
   - Ensure sensitive operations use service role key

3. **Current Safe Practices:**
   - Payment tables (`payments`, `c2b_payments`) have RLS enabled ✅
   - Service role key is used for backend operations ✅
   - Contact and enrollment forms use API routes with service role ✅

---

## 🔄 Update Triggers

All tables with `updated_at` columns should have automatic update triggers:

- `products`
- `orders`
- `payments`
- `enrollments`

---

## 📊 Indexes

Expected indexes for performance:

- `products`: `category`, `is_active`
- `orders`: `status`, `payment_status`, `customer_phone`
- `payments`: `checkout_request_id`, `status`, `phone_number`
- `order_items`: `order_id`
- `enrollments`: `email`, `phone`, `status`

---

## 🎯 Data Flow

### Product Purchase Flow:

1. Customer adds products to cart (from `products` table)
2. Checkout creates entry in `orders` table
3. Order items saved to `order_items` table
4. M-Pesa STK Push initiated → `payments` table
5. Payment callback updates `orders.payment_status` and `orders.status`

### Form Submissions:

1. Contact form → `contact_messages` table via API route
2. Enrollment form → `enrollments` table via API route

---

## 📝 Notes

- All IDs use UUID v4
- All timestamps use `timestamp with time zone`
- Monetary values use `numeric` type for precision
- Phone numbers stored as strings (format: 254XXXXXXXXX)
- Foreign keys have proper cascade rules

---

**Last Schema Export:** January 8, 2026  
**Documentation Version:** 1.0
