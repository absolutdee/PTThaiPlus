-- ================================
-- FitConnect Database Schema
-- ระบบค้นหาเทรนเนอร์ออกกำลังกาย
-- ================================

-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS fitconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitconnect_db;

-- ================================
-- 1. ตาราง Users (ผู้ใช้หลัก)
-- ================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'trainer', 'customer') NOT NULL DEFAULT 'customer',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    profile_picture VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- ================================
-- 2. ตาราง Trainers (เทรนเนอร์)
-- ================================
CREATE TABLE trainers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    bio TEXT,
    experience_years INT DEFAULT 0,
    specialties JSON, -- ["Weight Training", "Cardio", "Yoga"]
    certifications JSON, -- [{"name": "ACSM", "year": 2023}]
    education TEXT,
    languages JSON, -- ["Thai", "English"]
    service_areas JSON, -- ["Bangkok", "Samut Prakan"]
    rating DECIMAL(3,2) DEFAULT 0.00, -- 0.00 - 5.00
    total_reviews INT DEFAULT 0,
    total_sessions INT DEFAULT 0,
    base_price DECIMAL(10,2), -- ราคาพื้นฐานต่อเซสชั่น
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    availability_schedule JSON, -- กำหนดเวลาว่าง
    social_media JSON, -- {"facebook": "url", "instagram": "url"}
    bank_account JSON, -- ข้อมูลบัญชีธนาคาร (encrypted)
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- % ค่าคอมมิชชั่น
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_featured (is_featured),
    INDEX idx_verified (is_verified),
    INDEX idx_available (is_available)
);

-- ================================
-- 3. ตาราง Trainer Images (รูปภาพเทรนเนอร์)
-- ================================
CREATE TABLE trainer_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trainer_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    image_type ENUM('profile', 'gallery', 'certificate') DEFAULT 'gallery',
    title VARCHAR(200),
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_type (image_type),
    INDEX idx_sort (sort_order)
);

-- ================================
-- 4. ตาราง Customers (ลูกค้า)
-- ================================
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    height DECIMAL(5,2), -- cm
    weight DECIMAL(5,2), -- kg
    fitness_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    fitness_goals JSON, -- ["lose_weight", "build_muscle", "improve_endurance"]
    medical_conditions TEXT,
    emergency_contact JSON, -- {"name": "ชื่อ", "phone": "เบอร์"}
    preferences JSON, -- ความชอบต่างๆ
    total_sessions INT DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0.00,
    membership_level ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
    referral_code VARCHAR(20) UNIQUE,
    referred_by INT NULL, -- customer_id ที่แนะนำ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_by) REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_level (fitness_level),
    INDEX idx_membership (membership_level),
    INDEX idx_referral (referral_code)
);

-- ================================
-- 5. ตาราง Packages (แพคเกจเทรนนิ่ง)
-- ================================
CREATE TABLE packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trainer_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2), -- ราคาเต็ม (สำหรับส่วนลด)
    sessions_count INT NOT NULL, -- จำนวนเซสชั่น
    session_duration INT NOT NULL, -- นาที/เซสชั่น
    validity_days INT DEFAULT 90, -- วันที่ใช้ได้
    package_type ENUM('personal', 'group', 'online', 'hybrid') DEFAULT 'personal',
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    max_participants INT DEFAULT 1,
    features JSON, -- ["Personal Plan", "Nutrition Guide"]
    includes JSON, -- สิ่งที่รวมในแพคเกจ
    excludes JSON, -- สิ่งที่ไม่รวม
    requirements TEXT, -- ข้อกำหนด
    is_recommended BOOLEAN DEFAULT FALSE, -- แพคเกจแนะนำ
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    total_sold INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_price (price),
    INDEX idx_type (package_type),
    INDEX idx_recommended (is_recommended),
    INDEX idx_active (is_active)
);

-- ================================
-- 6. ตาราง Package Purchases (การซื้อแพคเกจ)
-- ================================
CREATE TABLE package_purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    package_id INT NOT NULL,
    trainer_id INT NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    sessions_remaining INT NOT NULL,
    sessions_total INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status ENUM('active', 'expired', 'cancelled', 'completed') DEFAULT 'active',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_package_id (package_id),
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_status (status),
    INDEX idx_expires (expires_at)
);

-- ================================
-- 7. ตาราง Sessions (เซสชั่นการฝึก)
-- ================================
CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    trainer_id INT NOT NULL,
    package_purchase_id INT,
    session_date DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    session_type ENUM('personal', 'group', 'online') DEFAULT 'personal',
    location VARCHAR(255),
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    notes TEXT, -- โน้ตจากเทรนเนอร์
    customer_notes TEXT, -- โน้ตจากลูกค้า
    exercises JSON, -- รายการออกกำลังกาย
    performance_data JSON, -- ข้อมูลการออกกำลังกาย
    trainer_feedback TEXT,
    customer_feedback TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    calories_burned INT,
    cancelled_by ENUM('customer', 'trainer', 'system'),
    cancellation_reason TEXT,
    rescheduled_from INT, -- session_id เดิม
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    FOREIGN KEY (package_purchase_id) REFERENCES package_purchases(id) ON DELETE SET NULL,
    FOREIGN KEY (rescheduled_from) REFERENCES sessions(id) ON DELETE SET NULL,
    INDEX idx_customer_id (customer_id),
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_session_date (session_date),
    INDEX idx_status (status)
);

-- ================================
-- 8. ตาราง Reviews (รีวิว)
-- ================================
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    trainer_id INT NOT NULL,
    session_id INT,
    package_purchase_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    pros TEXT,
    cons TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    reply_from_trainer TEXT,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL,
    FOREIGN KEY (package_purchase_id) REFERENCES package_purchases(id) ON DELETE SET NULL,
    INDEX idx_customer_id (customer_id),
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_rating (rating),
    INDEX idx_approved (is_approved),
    INDEX idx_created (created_at)
);

-- ================================
-- 9. ตาราง Nutrition Plans (แผนโภชนาการ)
-- ================================
CREATE TABLE nutrition_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trainer_id INT NOT NULL,
    customer_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_calories INT,
    target_protein DECIMAL(6,2),
    target_carbs DECIMAL(6,2),
    target_fat DECIMAL(6,2),
    plan_duration_days INT DEFAULT 7,
    meals_data JSON, -- ข้อมูลมื้ออาหาร
    guidelines TEXT,
    restrictions JSON, -- ข้อจำกัดอาหาร
    status ENUM('draft', 'active', 'completed', 'cancelled') DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status)
);

-- ================================
-- 10. ตาราง Progress Tracking (ติดตามความคืบหน้า)
-- ================================
CREATE TABLE progress_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    recorded_date DATE NOT NULL,
    weight DECIMAL(5,2),
    body_fat_percentage DECIMAL(5,2),
    muscle_mass DECIMAL(5,2),
    measurements JSON, -- {"chest": 90, "waist": 75, "arms": 35}
    photos JSON, -- URLs รูปภาพ
    notes TEXT,
    mood_score INT CHECK (mood_score >= 1 AND mood_score <= 10),
    energy_level INT CHECK (energy_level >= 1 AND energy_level <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_recorded_date (recorded_date)
);

-- ================================
-- 11. ตาราง Messages (ข้อความแชท)
-- ================================
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    conversation_id VARCHAR(100) NOT NULL, -- เช่น "customer_1_trainer_5"
    message_type ENUM('text', 'image', 'file', 'system') DEFAULT 'text',
    content TEXT,
    file_url VARCHAR(255),
    file_name VARCHAR(255),
    file_size INT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    replied_to INT, -- message_id ที่ตอบ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (replied_to) REFERENCES messages(id) ON DELETE SET NULL,
    INDEX idx_conversation (conversation_id),
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_created (created_at)
);

-- ================================
-- 12. ตาราง Notifications (การแจ้งเตือน)
-- ================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM(
        'session_reminder', 'session_cancelled', 'session_rescheduled',
        'new_message', 'payment_received', 'review_received',
        'package_expired', 'system_update', 'promotion'
    ) NOT NULL,
    related_id INT, -- ID ของ session, message, etc.
    action_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (notification_type),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
);

-- ================================
-- 13. ตาราง Articles (บทความ)
-- ================================
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT NOT NULL, -- admin or trainer
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(255),
    category ENUM(
        'fitness_tips', 'nutrition', 'workout_plans', 
        'health', 'motivation', 'equipment_reviews'
    ) NOT NULL,
    tags JSON, -- ["การลดน้ำหนัก", "โยคะ"]
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author_id (author_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_published (published_at),
    INDEX idx_slug (slug)
);

-- ================================
-- 14. ตาราง Events (อีเว้นท์)
-- ================================
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organizer_id INT NOT NULL, -- admin or trainer
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    event_type ENUM('workshop', 'competition', 'seminar', 'group_class') NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    location VARCHAR(255),
    location_url VARCHAR(255), -- Google Maps link
    max_participants INT,
    current_participants INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    featured_image VARCHAR(255),
    images JSON, -- รูปภาพเพิ่มเติม
    requirements TEXT,
    includes TEXT,
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    registration_deadline DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_organizer_id (organizer_id),
    INDEX idx_type (event_type),
    INDEX idx_start_date (start_datetime),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured)
);

-- ================================
-- 15. ตาราง Event Registrations (การลงทะเบียนอีเว้นท์)
-- ================================
CREATE TABLE event_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_status ENUM('registered', 'attended', 'cancelled', 'no_show') DEFAULT 'registered',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    payment_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (registration_status)
);

-- ================================
-- 16. ตาราง Gyms (ยิมและฟิตเนส)
-- ================================
CREATE TABLE gyms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    district VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    social_media JSON,
    opening_hours JSON, -- {"monday": "06:00-22:00"}
    facilities JSON, -- ["Swimming Pool", "Sauna", "Free Weights"]
    equipment JSON, -- รายการอุปกรณ์
    pricing JSON, -- ราคาสมาชิก
    images JSON, -- รูปภาพยิม
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_partner BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_location (latitude, longitude),
    INDEX idx_district (district),
    INDEX idx_province (province),
    INDEX idx_partner (is_partner),
    INDEX idx_active (is_active),
    INDEX idx_rating (rating)
);

-- ================================
-- 17. ตาราง Partners (พาร์ทเนอร์)
-- ================================
CREATE TABLE partners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    company_type ENUM('gym', 'supplement', 'equipment', 'nutrition', 'wellness') NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    website VARCHAR(255),
    contact_person VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    partnership_type ENUM('affiliate', 'sponsor', 'discount_provider') NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    discount_rate DECIMAL(5,2) DEFAULT 0.00,
    discount_code VARCHAR(50),
    contract_start_date DATE,
    contract_end_date DATE,
    status ENUM('active', 'inactive', 'pending', 'expired') DEFAULT 'pending',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (company_type),
    INDEX idx_partnership (partnership_type),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured)
);

-- ================================
-- 18. ตาราง Payments (การชำระเงิน)
-- ================================
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payer_id INT NOT NULL,
    receiver_id INT, -- trainer_id (null สำหรับ system payments)
    related_type ENUM('package_purchase', 'event_registration', 'subscription') NOT NULL,
    related_id INT NOT NULL, -- ID ของ package_purchase, event_registration, etc.
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'THB',
    payment_method ENUM('credit_card', 'bank_transfer', 'promptpay', 'truemoney', 'cash') NOT NULL,
    payment_provider VARCHAR(50), -- omise, stripe, scb, etc.
    transaction_id VARCHAR(100),
    provider_transaction_id VARCHAR(100),
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    fee_amount DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2), -- amount - fee
    failure_reason TEXT,
    metadata JSON, -- ข้อมูลเพิ่มเติมจาก payment provider
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES trainers(id) ON DELETE SET NULL,
    INDEX idx_payer_id (payer_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_status (status),
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_created (created_at)
);

-- ================================
-- 19. ตาราง Media Files (ไฟล์สื่อ)
-- ================================
CREATE TABLE media_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uploader_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type ENUM('image', 'video', 'document', 'audio') NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL, -- bytes
    dimensions VARCHAR(20), -- "1920x1080" for images/videos
    duration INT, -- seconds for videos/audio
    alt_text VARCHAR(255),
    description TEXT,
    usage_type ENUM('profile', 'gallery', 'article', 'event', 'chat', 'system') NOT NULL,
    related_type VARCHAR(50), -- 'trainer', 'article', 'event'
    related_id INT,
    is_public BOOLEAN DEFAULT TRUE,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_uploader_id (uploader_id),
    INDEX idx_file_type (file_type),
    INDEX idx_usage_type (usage_type),
    INDEX idx_related (related_type, related_id),
    INDEX idx_created (created_at)
);

-- ================================
-- 20. ตาราง System Settings (การตั้งค่าระบบ)
-- ================================
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value LONGTEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json', 'text') DEFAULT 'string',
    category ENUM('general', 'payment', 'email', 'sms', 'social', 'seo', 'maintenance') NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- สามารถเข้าถึงได้โดยไม่ต้องล็อกอิน
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_key (setting_key),
    INDEX idx_category (category),
    INDEX idx_public (is_public)
);

-- ================================
-- 21. ตาราง Coupons (คูปองส่วนลด)
-- ================================
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_discount DECIMAL(10,2), -- สำหรับ percentage type
    usage_limit INT, -- จำนวนครั้งที่ใช้ได้ทั้งหมด
    usage_limit_per_user INT DEFAULT 1,
    used_count INT DEFAULT 0,
    applicable_to ENUM('all', 'trainers', 'packages', 'events') DEFAULT 'all',
    applicable_ids JSON, -- IDs ที่สามารถใช้ได้
    starts_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_code (code),
    INDEX idx_active (is_active),
    INDEX idx_expires (expires_at),
    INDEX idx_applicable (applicable_to)
);

-- ================================
-- 22. ตาราง Coupon Usage (การใช้งานคูปอง)
-- ================================
CREATE TABLE coupon_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    coupon_id INT NOT NULL,
    user_id INT NOT NULL,
    order_type ENUM('package_purchase', 'event_registration') NOT NULL,
    order_id INT NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_coupon_id (coupon_id),
    INDEX idx_user_id (user_id),
    INDEX idx_order (order_type, order_id)
);

-- ================================
-- 23. ตาราง Activity Logs (บันทึกกิจกรรม)
-- ================================
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    model_type VARCHAR(50), -- 'User', 'Trainer', 'Session'
    model_id INT,
    changes JSON, -- บันทึกการเปลี่ยนแปลง
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_model (model_type, model_id),
    INDEX idx_created (created_at)
);

-- ================================
-- 24. ตาราง Newsletter Subscriptions (การสมัครรับข่าวสาร)
-- ================================
CREATE TABLE newsletter_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id INT NULL, -- ถ้าเป็นสมาชิก
    status ENUM('subscribed', 'unsubscribed', 'bounced') DEFAULT 'subscribed',
    subscription_source VARCHAR(50) DEFAULT 'website',
    interests JSON, -- ["fitness_tips", "nutrition", "events"]
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_subscribed (subscribed_at)
);

-- ================================
-- สร้าง Indexes เพิ่มเติมสำหรับ Performance
-- ================================

-- Composite indexes for common queries
CREATE INDEX idx_trainer_rating_available ON trainers(rating DESC, is_available, is_verified);
CREATE INDEX idx_sessions_trainer_date ON sessions(trainer_id, session_date);
CREATE INDEX idx_sessions_customer_date ON sessions(customer_id, session_date);
CREATE INDEX idx_reviews_trainer_rating ON reviews(trainer_id, rating, is_approved);
CREATE INDEX idx_packages_trainer_active ON packages(trainer_id, is_active, price);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at);

-- Full-text search indexes
ALTER TABLE articles ADD FULLTEXT(title, content);
ALTER TABLE trainers ADD FULLTEXT(bio);
ALTER TABLE events ADD FULLTEXT(title, description);

-- ================================
-- Triggers for Auto-calculations
-- ================================

-- อัปเดต rating เทรนเนอร์เมื่อมีรีวิวใหม่
DELIMITER //
CREATE TRIGGER update_trainer_rating AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE trainers 
    SET rating = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE trainer_id = NEW.trainer_id AND is_approved = TRUE
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE trainer_id = NEW.trainer_id AND is_approved = TRUE
    )
    WHERE id = NEW.trainer_id;
END//

-- อัปเดตจำนวน sessions เมื่อมีการจองใหม่
CREATE TRIGGER update_trainer_sessions AFTER UPDATE ON sessions
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE trainers 
        SET total_sessions = total_sessions + 1
        WHERE id = NEW.trainer_id;
        
        UPDATE customers 
        SET total_sessions = total_sessions + 1
        WHERE id = NEW.customer_id;
    END IF;
END//

-- ลดจำนวน sessions_remaining เมื่อ session เสร็จสิ้น
CREATE TRIGGER update_package_sessions AFTER UPDATE ON sessions
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.package_purchase_id IS NOT NULL THEN
        UPDATE package_purchases 
        SET sessions_remaining = sessions_remaining - 1
        WHERE id = NEW.package_purchase_id;
    END IF;
END//

DELIMITER ;

-- ================================
-- สร้างข้อมูลเริ่มต้น (Sample Data)
-- ================================

-- Admin User
INSERT INTO users (email, password, role, first_name, last_name, is_active, email_verified) VALUES
('admin@fitconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'admin', 'Admin', 'System', TRUE, TRUE);

-- System Settings เริ่มต้น
INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_name', 'FitConnect', 'string', 'general', 'ชื่อเว็บไซต์'),
('site_description', 'แพลตฟอร์มค้นหาเทรนเนอร์ออกกำลังกาย', 'string', 'general', 'คำอธิบายเว็บไซต์'),
('default_commission_rate', '10.00', 'number', 'payment', 'อัตราค่าคอมมิชชั่นเริ่มต้น (%)'),
('currency', 'THB', 'string', 'payment', 'สกุลเงิน'),
('timezone', 'Asia/Bangkok', 'string', 'general', 'เขตเวลา'),
('max_trainer_images', '12', 'number', 'general', 'จำนวนรูปภาพสูงสุดต่อเทรนเนอร์'),
('max_trainer_packages', '3', 'number', 'general', 'จำนวนแพคเกจสูงสุดต่อเทรนเนอร์');

-- ================================
-- Views สำหรับ Reporting
-- ================================

-- View สำหรับสถิติเทรนเนอร์
CREATE VIEW trainer_stats AS
SELECT 
    t.id,
    u.first_name,
    u.last_name,
    t.rating,
    t.total_reviews,
    t.total_sessions,
    t.total_earnings,
    COUNT(DISTINCT pp.id) as active_packages,
    COUNT(DISTINCT s.id) as this_month_sessions
FROM trainers t
JOIN users u ON t.user_id = u.id
LEFT JOIN package_purchases pp ON t.id = pp.trainer_id AND pp.status = 'active'
LEFT JOIN sessions s ON t.id = s.trainer_id AND s.session_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
GROUP BY t.id;

-- View สำหรับรายงานรายได้
CREATE VIEW revenue_report AS
SELECT 
    DATE(p.created_at) as payment_date,
    COUNT(*) as total_transactions,
    SUM(p.amount) as total_revenue,
    SUM(p.fee_amount) as total_fees,
    SUM(p.net_amount) as net_revenue,
    AVG(p.amount) as avg_transaction_amount
FROM payments p
WHERE p.status = 'completed'
GROUP BY DATE(p.created_at)
ORDER BY payment_date DESC;