
-- SIH project schema. Make sure you are connected to the 'sih_db' database before running this file.

-- Stores registration details for all NGOs.
CREATE TABLE IF NOT EXISTS ngo (
    ngo_id SERIAL PRIMARY KEY,
    license_no VARCHAR(255),
    ngo_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    spokesperson_name VARCHAR(255),
    spokesperson_mobile VARCHAR(50),
    pan_no VARCHAR(10),
    account_holder_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    total_cc INTEGER DEFAULT 0,
    wallet_address VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores registration details for all Coastal Panchayats.
CREATE TABLE IF NOT EXISTS coastal_panchayat (
    cp_id SERIAL PRIMARY KEY,
    zila_id_ward_no VARCHAR(255),
    address TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    pan_no VARCHAR(10),
    account_holder_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    total_cc INTEGER DEFAULT 0,
    wallet_address VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores registration details for all Communities.
CREATE TABLE IF NOT EXISTS community (
    comm_id SERIAL PRIMARY KEY,
    community_name VARCHAR(255) NOT NULL,
    spokesperson_name VARCHAR(255),
    spokesperson_mobile VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    pan_no VARCHAR(10),
    account_holder_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    total_cc INTEGER DEFAULT 0,
    wallet_address VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores registration details for all Buyers.
CREATE TABLE IF NOT EXISTS buyer (
    buyer_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    pan_no VARCHAR(10),
    account_holder_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    total_cc INTEGER DEFAULT 0,
    wallet_address VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stores details for all restoration projects.
CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL,
    seller_type VARCHAR(50) NOT NULL,
    plantation_area VARCHAR(255),
    location VARCHAR(255),
    tree_type VARCHAR(255),
    tree_no INTEGER,
    plantation_period VARCHAR(255),
    photos TEXT[],
    estimated_cc INTEGER,
    actual_cc INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
