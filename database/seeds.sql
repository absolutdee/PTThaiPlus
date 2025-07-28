-- ================================
-- Database Seeds - ข้อมูลตัวอย่าง
-- FitConnect Platform
-- ================================

USE fitconnect_db;

-- ปิด foreign key checks ชั่วคราว
SET FOREIGN_KEY_CHECKS = 0;

-- ================================
-- 1. ข้อมูล Users
-- ================================

-- Admin Users
INSERT INTO users (id, email, password, role, first_name, last_name, display_name, phone, is_active, email_verified, email_verified_at) VALUES
(1, 'admin@fitconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'admin', 'Admin', 'System', 'Admin System', '02-000-0000', TRUE, TRUE, NOW()),
(2, 'superadmin@fitconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'admin', 'Super', 'Admin', 'Super Admin', '02-000-0001', TRUE, TRUE, NOW());

-- Trainer Users  
INSERT INTO users (id, email, password, role, first_name, last_name, display_name, phone, date_of_birth, gender, is_active, email_verified, email_verified_at) VALUES
(10, 'john.trainer@fitconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'trainer', 'จอห์น', 'ฟิตเนส', 'จอห์น ฟิตเนส', '081-111-1111', '1990-05-15', 'male', TRUE, TRUE, NOW()),
(11, 'sara.trainer@fitconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'trainer', 'ซาร่า', 'แข็งแรง', 'ซาร่า แข็งแรง', '081-222-2222', '1988-08-22', 'female', TRUE, TRUE, NOW()),
(12, 'mike.trainer@fitconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'trainer', 'ไมค์', 'มัสเซิล', 'ไมค์ มัสเซิล', '081-333-3333', '1985-12-03', 'male', TRUE, TRUE, NOW()),
(13, 'anna.trainer@fitconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'trainer', 'แอนนา', 'โยคะ', 'แอนนา โยคะ', '081-444-4444', '1992-03-18', 'female', TRUE, TRUE, NOW()),
(14, 'david.trainer@fitconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'trainer', 'เดวิด', 'คาร์ดิโอ', 'เดวิด คาร์ดิโอ', '081-555-5555', '1987-09-25', 'male', TRUE, TRUE, NOW());

-- Customer Users
INSERT INTO users (id, email, password, role, first_name, last_name, display_name, phone, date_of_birth, gender, is_active, email_verified, email_verified_at) VALUES
(20, 'somchai@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'customer', 'สมชาย', 'ใจดี', 'สมชาย ใจดี', '082-111-1111', '1995-01-10', 'male', TRUE, TRUE, NOW()),
(21, 'somying@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'customer', 'สมหญิง', 'ใจงาม', 'สมหญิง ใจงาม', '082-222-2222', '1993-06-15', 'female', TRUE, TRUE, NOW()),
(22, 'malee@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'customer', 'มาลี', 'สุขใจ', 'มาลี สุขใจ', '082-333-3333', '1990-11-20', 'female', TRUE, TRUE, NOW()),
(23, 'somkid@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'customer', 'สมคิด', 'พยายาม', 'สมคิด พยายาม', '082-444-4444', '1988-04-08', 'male', TRUE, TRUE, NOW()),
(24, 'niran@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5TKJxIJJa6', 'customer', 'นิรันดร์', 'มั่นคง', 'นิรันดร์ มั่นคง', '082-555-5555', '1985-07-12', 'male', TRUE, TRUE, NOW());

-- ================================
-- 2. ข้อมูล Trainers
-- ================================

INSERT INTO trainers (id, user_id, bio, experience_years, specialties, certifications, education, languages, service_areas, rating, total_reviews, total_sessions, base_price, min_price, max_price, is_featured, is_verified, is_available, availability_schedule, social_media, total_earnings, commission_rate) VALUES
(1, 10, 'เทรนเนอร์มืออาชีพด้วยประสบการณ์กว่า 8 ปี เชี่ยวชาญด้านการเพิ่มกล้ามเนื้อและการลดน้ำหนัก พร้อมให้คำปรึกษาด้านโภชนาการ', 8, 
'["Weight Training", "Muscle Building", "Fat Loss", "Nutrition Coaching"]', 
'[{"name": "ACSM Certified Personal Trainer", "year": 2020}, {"name": "Nutrition Specialist", "year": 2021}]',
'ปริญญาตรี วิทยาศาสตร์การกีฬา จุฬาลงกรณ์มหาวิทยาลัย',
'["Thai", "English"]',
'["Bangkok", "Samut Prakan", "Nonthaburi"]',
4.8, 156, 1240, 1500.00, 1200.00, 2000.00, TRUE, TRUE, TRUE,
'{"monday": "06:00-20:00", "tuesday": "06:00-20:00", "wednesday": "06:00-20:00", "thursday": "06:00-20:00", "friday": "06:00-20:00", "saturday": "08:00-18:00", "sunday": "08:00-16:00"}',
'{"instagram": "@johnfitness_th", "facebook": "JohnFitnessCoach"}',
186000.00, 10.00),

(2, 11, 'เทรนเนอร์หญิงมืออาชีพ เชี่ยวชาญโยคะ พิลาทิส และการออกแบบโปรแกรมสำหรับผู้หญิง ใส่ใจในรายละเอียดและความปลอดภัย', 6,
'["Yoga", "Pilates", "Women Fitness", "Flexibility Training", "Posture Correction"]',
'[{"name": "RYT 500 Yoga Alliance", "year": 2019}, {"name": "Pilates Instructor Certification", "year": 2020}]',
'ปริญญาโท สาธารณสุขศาสตร์ มหาวิทยาลยรามคำแหง',
'["Thai", "English"]',
'["Bangkok", "Pathum Thani"]',
4.9, 203, 890, 1300.00, 1000.00, 1800.00, TRUE, TRUE, TRUE,
'{"monday": "07:00-19:00", "tuesday": "07:00-19:00", "wednesday": "07:00-19:00", "thursday": "07:00-19:00", "friday": "07:00-19:00", "saturday": "09:00-17:00", "sunday": "OFF"}',
'{"instagram": "@sarastrong_yoga", "youtube": "Sara Strong Fitness"}',
115700.00, 10.00),

(3, 12, 'อดีตนักเพาะกาย มีประสบการณ์ด้านการเพิ่มมวลกล้ามเนื้อและการแข่งขัน เชี่ยวชาญเทคนิคการยกน้ำหนักขั้นสูง', 10,
'["Bodybuilding", "Powerlifting", "Advanced Weight Training", "Competition Prep"]',
'[{"name": "NSCA-CPT", "year": 2018}, {"name": "Powerlifting Coach Level 2", "year": 2022}]',
'ปริญญาตรี พลศึกษา มหาวิทยาลัยศรีนครินทรวิโรฒ',
'["Thai", "English"]',
'["Bangkok", "Samut Prakan"]',
4.7, 89, 1156, 1800.00, 1500.00, 2500.00, TRUE, TRUE, TRUE,
'{"monday": "05:00-21:00", "tuesday": "05:00-21:00", "wednesday": "05:00-21:00", "thursday": "05:00-21:00", "friday": "05:00-21:00", "saturday": "06:00-20:00", "sunday": "08:00-18:00"}',
'{"instagram": "@mikemuscle_coach", "facebook": "Mike Muscle Training"}',
207840.00, 10.00),

(4, 13, 'ผู้เชี่ยวชาญด้านโยคะและการฝึกสมาธิ มีประสบการณ์สอนโยคะมากว่า 7 ปี เน้นการสร้างสมดุลระหว่างร่างกายและจิตใจ', 7,
'["Hatha Yoga", "Vinyasa Yoga", "Meditation", "Breathwork", "Mindfulness"]',
'[{"name": "E-RYT 200", "year": 2018}, {"name": "Meditation Teacher Training", "year": 2021}]',
'ปริญญาตรี จิตวิทยา มหาวิทยาลัยธรรมศาสตร์',
'["Thai", "English", "Chinese"]',
'["Bangkok", "Nonthaburi", "Pathum Thani"]',
4.9, 167, 723, 1200.00, 900.00, 1600.00, FALSE, TRUE, TRUE,
'{"monday": "06:00-20:00", "tuesday": "06:00-20:00", "wednesday": "06:00-20:00", "thursday": "06:00-20:00", "friday": "06:00-20:00", "saturday": "07:00-19:00", "sunday": "07:00-19:00"}',
'{"instagram": "@anna_yoga_peace", "website": "annayogastudio.com"}',
86760.00, 10.00),

(5, 14, 'เทรนเนอร์เชี่ยวชาญด้านคาร์ดิโอและการเผาผลาญไขมัน ผู้เชี่ยวชาญด้านการวิ่งและกีฬาประเภททนทาน', 9,
'["Cardio Training", "Running", "HIIT", "Endurance Sports", "Athletic Performance"]',
'[{"name": "NASM-PES", "year": 2019}, {"name": "Running Coach Certification", "year": 2020}]',
'ปริญญาตรี วิทยาศาสตร์การกีฬา มหาวิทยาลัยเกษตรศาสตร์',
'["Thai", "English"]',
'["Bangkok", "Samut Prakan", "Nonthaburi"]',
4.6, 134, 967, 1400.00, 1100.00, 1900.00, FALSE, TRUE, TRUE,
'{"monday": "05:30-20:00", "tuesday": "05:30-20:00", "wednesday": "05:30-20:00", "thursday": "05:30-20:00", "friday": "05:30-20:00", "saturday": "06:00-18:00", "sunday": "07:00-17:00"}',
'{"instagram": "@david_cardio_coach", "strava": "David Cardio Coach"}',
135380.00, 10.00);

-- ================================
-- 3. ข้อมูล Trainer Images
-- ================================

INSERT INTO trainer_images (trainer_id, image_url, image_type, title, description, sort_order, is_active) VALUES
-- John's Images
(1, '/uploads/trainers/john/profile.jpg', 'profile', 'รูปโปรไฟล์', 'รูปโปรไฟล์หลัก', 1, TRUE),
(1, '/uploads/trainers/john/gym1.jpg', 'gallery', 'ในยิม', 'ฝึกซ้อมในยิม', 2, TRUE),
(1, '/uploads/trainers/john/training1.jpg', 'gallery', 'การเทรน', 'กำลังเทรนลูกค้า', 3, TRUE),
(1, '/uploads/trainers/john/cert1.jpg', 'certificate', 'ใบรับรอง ACSM', 'ใบรับรอง ACSM CPT', 4, TRUE),

-- Sara's Images  
(2, '/uploads/trainers/sara/profile.jpg', 'profile', 'รูปโปรไฟล์', 'รูปโปรไฟล์หลัก', 1, TRUE),
(2, '/uploads/trainers/sara/yoga1.jpg', 'gallery', 'คลาสโยคะ', 'สอนโยคะกลุ่ม', 2, TRUE),
(2, '/uploads/trainers/sara/pilates1.jpg', 'gallery', 'พิลาทิส', 'เซสชั่นพิลาทิส', 3, TRUE),

-- Mike's Images
(3, '/uploads/trainers/mike/profile.jpg', 'profile', 'รูปโปรไฟล์', 'รูปโปรไฟล์หลัก', 1, TRUE),
(3, '/uploads/trainers/mike/competition.jpg', 'gallery', 'การแข่งขัน', 'ในการแข่งขันเพาะกาย', 2, TRUE),
(3, '/uploads/trainers/mike/deadlift.jpg', 'gallery', 'เดดลิฟต์', 'สาธิตเดดลิฟต์', 3, TRUE);

-- ================================
-- 4. ข้อมูล Customers
-- ================================

INSERT INTO customers (id, user_id, height, weight, fitness_level, fitness_goals, medical_conditions, emergency_contact, preferences, total_sessions, total_spent, membership_level, referral_code) VALUES
(1, 20, 175.00, 78.50, 'beginner', '["lose_weight", "build_muscle"]', 'ไม่มีโรคประจำตัว', '{"name": "สมใจ ใจดี", "phone": "082-111-1112", "relationship": "พี่ชาย"}', '{"preferred_time": "evening", "music": "pop"}', 8, 12000.00, 'bronze', 'SOMCHAI2024'),

(2, 21, 160.00, 55.00, 'intermediate', '["improve_flexibility", "stress_relief"]', 'ปวดหลังเล็กน้อย', '{"name": "สมศักดิ์ ใจงาม", "phone": "082-222-2223", "relationship": "สามี"}', '{"preferred_time": "morning", "style": "yoga"}', 15, 19500.00, 'silver', 'SOMYING2024'),

(3, 22, 165.00, 58.00, 'beginner', '["lose_weight", "improve_endurance"]', 'ไม่มีโรคประจำตัว', '{"name": "สมปอง สุขใจ", "phone": "082-333-3334", "relationship": "พ่อ"}', '{"preferred_time": "afternoon", "intensity": "moderate"}', 6, 7800.00, 'bronze', 'MALEE2024'),

(4, 23, 180.00, 85.00, 'advanced', '["build_muscle", "improve_strength"]', 'เคยได้รับบาดเจ็บที่หัวเข่า', '{"name": "สมจิต พยายาม", "phone": "082-444-4445", "relationship": "ภรรยา"}', '{"preferred_time": "morning", "focus": "strength"}', 22, 39600.00, 'gold', 'SOMKID2024'),

(5, 24, 172.00, 82.00, 'intermediate', '["lose_weight", "improve_cardio"]', 'ความดันโลหิตสูงเล็กน้อย', '{"name": "นิภา มั่นคง", "phone": "082-555-5556", "relationship": "ภรรยา"}', '{"preferred_time": "evening", "type": "cardio"}', 12, 16800.00, 'silver', 'NIRAN2024');

-- ================================
-- 5. ข้อมูล Packages
-- ================================

INSERT INTO packages (id, trainer_id, name, description, price, original_price, sessions_count, session_duration, validity_days, package_type, difficulty_level, max_participants, features, includes, excludes, is_recommended, is_popular, is_active, sort_order, total_sold) VALUES
-- John's Packages
(1, 1, 'Muscle Building Starter', 'แพคเกจเพิ่มกล้ามเนื้อสำหรับผู้เริ่มต้น ครอบคลุมการฝึกพื้นฐานและการดูแลโภชนาการ', 4500.00, 5000.00, 4, 60, 60, 'personal', 'beginner', 1, 
'["Personal Training Plan", "Nutrition Guide", "Progress Tracking"]',
'["4 เซสชั่นส่วนตัว", "แผนโภชนาการ", "การติดตามผล", "คำปรึกษาผ่านแชท"]',
'["อาหารเสริม", "อุปกรณ์ออกกำลังกาย"]',
TRUE, TRUE, TRUE, 1, 45),

(2, 1, 'Advanced Muscle Program', 'โปรแกรมเพิ่มกล้ามเนื้อระดับสูง สำหรับผู้ที่มีพื้นฐานแล้ว', 9000.00, 10000.00, 8, 75, 90, 'personal', 'advanced', 1,
'["Advanced Training", "Detailed Nutrition", "Body Composition Analysis"]',
'["8 เซสชั่นส่วนตัว", "แผนโภชนาการรายละเอียด", "การวัดองค์ประกอบร่างกาย", "คำปรึกษาตลอดโปรแกรม"]',
'["อาหารเสริม", "ค่ายิม"]',
FALSE, FALSE, TRUE, 2, 23),

(3, 1, 'Weight Loss Transformation', 'โปรแกรมลดน้ำหนักแบบครบวงจร เปลี่ยนแปลงรูปร่างใน 3 เดือน', 15000.00, 18000.00, 12, 60, 120, 'personal', 'intermediate', 1,
'["Complete Transformation", "Meal Planning", "Weekly Check-ins"]',
'["12 เซสชั่นส่วนตัว", "แผนอาหารรายสัปดาห์", "การติดตามรายสัปดาห์", "รูปก่อน-หลัง"]',
'["อาหาร", "อาหารเสริม"]',
FALSE, TRUE, TRUE, 3, 67),

-- Sara's Packages
(4, 2, 'Yoga for Beginners', 'โยคะสำหรับผู้เริ่มต้น เรียนรู้ท่าพื้นฐานและการหายใจ', 3200.00, 4000.00, 4, 60, 45, 'personal', 'beginner', 1,
'["Basic Yoga Poses", "Breathing Techniques", "Relaxation Methods"]',
'["4 เซสชั่นโยคะส่วนตัว", "คู่มือท่าโยคะ", "แผ่น CD สำหรับฝึกที่บ้าน"]',
'["อุปกรณ์โยคะ", "เสื่อโยคะ"]',
TRUE, FALSE, TRUE, 1, 78),

(5, 2, 'Pilates Core Strength', 'พิลาทิสเพื่อเสริมสร้างกล้ามเนื้อแกนกาย และปรับปรุงท่าทาง', 5600.00, 7000.00, 6, 50, 75, 'personal', 'intermediate', 1,
'["Core Strengthening", "Posture Correction", "Flexibility Improvement"]',
'["6 เซสชั่นพิลาทิส", "แผนฝึกที่บ้าน", "การประเมินท่าทาง"]',
'["อุปกรณ์พิลาทิส"]',
FALSE, TRUE, TRUE, 2, 34),

-- Mike's Packages  
(6, 3, 'Powerlifting Fundamentals', 'หลักการยกน้ำหนักแบบพาวเวอร์ลิฟติ้ง เน้นเทคนิคที่ถูกต้อง', 7200.00, 8000.00, 6, 90, 90, 'personal', 'intermediate', 1,
'["Powerlifting Techniques", "Strength Assessment", "Competition Prep"]',
'["6 เซสชั่นเทคนิคพาวเวอร์ลิฟติ้ง", "การประเมินความแข็งแรง", "โปรแกรมฝึกแข่งขัน"]',
'["อุปกรณ์เสริม", "ค่าสมัครแข่งขัน"]',
FALSE, FALSE, TRUE, 1, 19);

-- ================================
-- 6. ข้อมูล Package Purchases
-- ================================

INSERT INTO package_purchases (id, customer_id, package_id, trainer_id, purchase_price, discount_amount, sessions_remaining, sessions_total, expires_at, status, payment_status, payment_method, transaction_id) VALUES
(1, 1, 1, 1, 4500.00, 500.00, 2, 4, DATE_ADD(NOW(), INTERVAL 60 DAY), 'active', 'paid', 'credit_card', 'TXN_001_20240720'),
(2, 2, 4, 2, 3200.00, 800.00, 1, 4, DATE_ADD(NOW(), INTERVAL 30 DAY), 'active', 'paid', 'promptpay', 'TXN_002_20240718'),
(3, 4, 3, 1, 15000.00, 3000.00, 8, 12, DATE_ADD(NOW(), INTERVAL 100 DAY), 'active', 'paid', 'bank_transfer', 'TXN_003_20240715'),
(4, 5, 5, 2, 5600.00, 1400.00, 4, 6, DATE_ADD(NOW(), INTERVAL 65 DAY), 'active', 'paid', 'credit_card', 'TXN_004_20240722');

-- ================================
-- 7. ข้อมูล Sessions
-- ================================

INSERT INTO sessions (id, customer_id, trainer_id, package_purchase_id, session_date, duration_minutes, session_type, location, status, notes, exercises, performance_data, trainer_feedback, rating) VALUES
(1, 1, 1, 1, DATE_SUB(NOW(), INTERVAL 3 DAY), 60, 'personal', 'Fitness First Sathorn', 'completed', 'เซสชั่นแรก ประเมินสมรรถภาพพื้นฐาน', 
'[{"exercise": "Bench Press", "sets": 3, "reps": 10, "weight": 40}, {"exercise": "Lat Pulldown", "sets": 3, "reps": 12, "weight": 45}]',
'{"calories_burned": 280, "max_heart_rate": 165, "avg_heart_rate": 145}',
'ผลการฝึกดีมาก มีความตั้งใจและทำตามคำแนะนำ', 5),

(2, 1, 1, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 60, 'personal', 'Fitness First Sathorn', 'completed', 'เซสชั่นที่ 2 เน้นกล้ามเนื้อส่วนล่าง',
'[{"exercise": "Squat", "sets": 3, "reps": 12, "weight": 50}, {"exercise": "Leg Press", "sets": 3, "reps": 15, "weight": 80}]',
'{"calories_burned": 320, "max_heart_rate": 170, "avg_heart_rate": 150}',
'เห็นความก้าวหน้าชัดเจน แนะนำให้เพิ่มน้ำหนักในเซสชั่นหน้า', 5),

(3, 2, 2, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 60, 'personal', 'Anna Yoga Studio', 'completed', 'โยคะเบื้องต้น เรียนรู้ท่าพื้นฐาน',
'[{"pose": "Mountain Pose", "duration": "2 min"}, {"pose": "Downward Dog", "duration": "3 min"}, {"pose": "Child Pose", "duration": "5 min"}]',
'{"flexibility_score": 7, "balance_score": 6, "relaxation_level": 9}',
'ความยืดหยุ่นดีขึ้นมาก จิตใจสงบ', 5),

(4, 4, 1, 3, DATE_ADD(NOW(), INTERVAL 1 DAY), 75, 'personal', 'Mike Muscle Gym', 'scheduled', 'เซสชั่นเพิ่มกล้ามเนื้อขั้นสูง', NULL, NULL, NULL, NULL),

(5, 5, 2, 4, DATE_ADD(NOW(), INTERVAL 2 DAY), 50, 'personal', 'Sara Strong Studio', 'confirmed', 'พิลาทิสเพื่อกล้ามเนื้อแกนกาย', NULL, NULL, NULL, NULL);

-- ================================
-- 8. ข้อมูล Reviews
-- ================================

INSERT INTO reviews (id, customer_id, trainer_id, session_id, package_purchase_id, rating, title, comment, pros, cons, is_verified, is_featured, helpful_count, reply_from_trainer, replied_at) VALUES
(1, 1, 1, 1, 1, 5, 'เทรนเนอร์ดีมาก!', 'จอห์นเป็นเทรนเนอร์ที่ดีมาก ใส่ใจในรายละเอียด และให้คำแนะนำดีมาก ผลลัพธ์เห็นได้ชัด', 'ใส่ใจ, มีความรู้สูง, ให้กำลังใจ', 'ไม่มี', TRUE, TRUE, 15, 'ขอบคุณมากครับ! ยินดีที่ได้ช่วยให้คุณบรรลุเป้าหมาย', NOW()),

(2, 2, 2, 3, 2, 5, 'โยคะกับซาร่าดีมาก', 'ซาร่าสอนโยคะได้ดีมาก อธิบายชัดเจน ทำให้รู้สึกผ่อนคลายและแข็งแรงขึ้น', 'สอนดี, อดทน, บรรยากาศดี', 'เวลาผ่านไปเร็วเกินไป', TRUE, FALSE, 8, 'ขอบคุณค่ะ! ดีใจที่คุณชิอบคลาสโยคะ', NOW()),

(3, 4, 1, 2, 3, 4, 'โปรแกรมดี แต่หนักหน่อย', 'โปรแกรมของจอห์นดีมาก แต่สำหรับผมที่เพิ่งเริ่มอาจจะหนักไปหน่อย แต่ก็เห็นผลลัพธ์', 'มีความรู้, โปรแกรมมีประสิทธิภาพ', 'หนักเกินไปสำหรับผู้เริ่มต้น', TRUE, FALSE, 3, 'ขอบคุณสำหรับ feedback ครับ จะปรับโปรแกรมให้เหมาะสมกับแต่ละคนมากขึ้น', NOW());

-- ================================
-- 9. ข้อมูล Articles
-- ================================

INSERT INTO articles (id, author_id, title, slug, excerpt, content, featured_image, category, tags, status, is_featured, view_count, like_count, published_at) VALUES
(1, 10, '5 วิธีเพิ่มกล้ามเนื้อสำหรับมือใหม่', '5-ways-build-muscle-beginners', 'เคล็ดลับการเพิ่มกล้ามเนื้อที่มือใหม่ควรรู้ เพื่อผลลัพธ์ที่ดีที่สุด', 
'## การเพิ่มกล้ามเนื้อสำหรับมือใหม่\n\n### 1. เน้นการฝึกแบบ Compound Movements\nการออกกำลังกายแบบ compound movements เป็นการเคลื่อนไหวที่ใช้กล้ามเนื้อหลายกลุ่มร่วมกัน...\n\n### 2. ดูแลโภชนาการ\nโปรตีนเป็นสิ่งสำคัญสำหรับการเพิ่มกล้ามเนื้อ ควรรับประทานโปรตีน 1.6-2.2 กรัมต่อน้ำหนักตัว 1 กิโลกรัม...',
'/uploads/articles/muscle-building-guide.jpg', 'fitness_tips', '["กล้ามเนื้อ", "มือใหม่", "เทคนิค"]', 'published', TRUE, 2547, 156, DATE_SUB(NOW(), INTERVAL 5 DAY)),

(2, 11, 'ประโยชน์ของโยคะต่อสุขภาพจิต', 'yoga-mental-health-benefits', 'โยคะไม่ได้มีประโยชน์เฉพาะร่างกาย แต่ยังช่วยเรื่องสุขภาพจิตด้วย', 
'## โยคะกับสุขภาพจิต\n\n### การลดความเครียด\nโยคะช่วยลดระดับ cortisol ซึ่งเป็นฮอร์โมนความเครียด...\n\n### เพิ่มสมาธิ\nการฝึกสมาธิในโยคะช่วยให้จิตใจสงบและมีสมาธิมากขึ้น...',
'/uploads/articles/yoga-mental-health.jpg', 'health', '["โยคะ", "สุขภาพจิต", "ความเครียด"]', 'published', FALSE, 1834, 89, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(3, 1, 'แนวโน้มฟิตเนสปี 2024', 'fitness-trends-2024', 'สำรวจแนวโน้มฟิตเนสที่กำลังมาแรงในปี 2024', 
'## แนวโน้มฟิตเนสปี 2024\n\n### 1. Hybrid Training\nการรวมการฝึกออนไลน์และออฟไลน์เข้าด้วยกัน...\n\n### 2. Mindful Movement\nการเน้นความตระหนักรู้ในการเคลื่อนไหว...',
'/uploads/articles/fitness-trends-2024.jpg', 'fitness_tips', '["แนวโน้ม", "2024", "เทรนด์"]', 'published', TRUE, 3241, 203, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- ================================
-- 10. ข้อมูล Events
-- ================================

INSERT INTO events (id, organizer_id, title, slug, description, event_type, start_datetime, end_datetime, location, max_participants, current_participants, price, featured_image, status, is_featured) VALUES
(1, 1, 'Workshop: เทคนิคการยกน้ำหนักที่ถูกต้อง', 'proper-weightlifting-technique-workshop', 'เวิร์คช็อปสอนเทคนิคการยกน้ำหนักที่ถูกต้อง ป้องกันการบาดเจ็บ', 'workshop', DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 10 DAY), 'Fitness First Sathorn', 20, 12, 1500.00, '/uploads/events/weightlifting-workshop.jpg', 'published', TRUE),

(2, 11, 'คลาสโยคะริมน้ำ', 'riverside-yoga-class', 'คลาสโยคะกลางแจ้งริมแม่น้ำ บรรยากาศสงบร่มรื่น', 'group_class', DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 'สวนลุมพินี', 30, 8, 500.00, '/uploads/events/riverside-yoga.jpg', 'published', FALSE),

(3, 1, 'การแข่งขันเพาะกายสมัครเล่น', 'amateur-bodybuilding-competition', 'การแข่งขันเพาะกายสำหรับนักกีฬาสมัครเล่น หลายประเภท', 'competition', DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), 'Thunder Dome', 50, 23, 2000.00, '/uploads/events/bodybuilding-comp.jpg', 'published', TRUE);

-- ================================
-- 11. ข้อมูล Event Registrations
-- ================================

INSERT INTO event_registrations (event_id, user_id, registration_status, payment_status, payment_amount) VALUES
(1, 20, 'registered', 'paid', 1500.00),
(1, 22, 'registered', 'paid', 1500.00),
(2, 21, 'registered', 'paid', 500.00),
(2, 24, 'registered', 'paid', 500.00),
(3, 23, 'registered', 'paid', 2000.00);

-- ================================
-- 12. ข้อมูล Gyms
-- ================================

INSERT INTO gyms (id, name, description, address, district, province, latitude, longitude, phone, email, opening_hours, facilities, rating, total_reviews, is_partner, is_active) VALUES
(1, 'Fitness First Sathorn', 'ยิมชั่นนำที่มีอุปกรณ์ทันสมัย ครบครัน', '999/9 ถนนสาทร แขวงสีลม เขตบางรัก', 'บางรัก', 'กรุงเทพฯ', 13.7251, 100.5200, '02-234-5678', 'sathorn@fitnessfirst.co.th', 
'{"monday": "05:00-24:00", "tuesday": "05:00-24:00", "wednesday": "05:00-24:00", "thursday": "05:00-24:00", "friday": "05:00-24:00", "saturday": "06:00-22:00", "sunday": "06:00-22:00"}',
'["Free Weights", "Cardio Machines", "Swimming Pool", "Sauna", "Group Classes", "Personal Training"]', 4.5, 234, TRUE, TRUE),

(2, 'Virgin Active Emquartier', 'ยิมหรูระดับพรีเมียม บริการครบครัน', '693 ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา', 'วัฒนา', 'กรุงเทพฯ', 13.7367, 100.5698, '02-269-1000', 'emquartier@virginactive.co.th',
'{"monday": "05:30-23:00", "tuesday": "05:30-23:00", "wednesday": "05:30-23:00", "thursday": "05:30-23:00", "friday": "05:30-23:00", "saturday": "07:00-21:00", "sunday": "07:00-21:00"}',
'["Premium Equipment", "Swimming Pool", "Spa", "Yoga Studio", "Pilates Studio", "Personal Training", "Nutrition Consultation"]', 4.7, 189, TRUE, TRUE),

(3, 'California WOW X', 'ยิมสำหรับทุกเพศทุกวัย สะดวกสบาย', '4/4-5 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท', 'พญาไท', 'กรุงเทพฯ', 13.7765, 100.5447, '02-617-1111', 'phahonyothin@californiawow.com',
'{"monday": "05:00-24:00", "tuesday": "05:00-24:00", "wednesday": "05:00-24:00", "thursday": "05:00-24:00", "friday": "05:00-24:00", "saturday": "06:00-22:00", "sunday": "06:00-22:00"}',
'["Cardio Zone", "Strength Training", "Group Classes", "Swimming Pool", "Kids Club", "Cafe"]', 4.2, 156, FALSE, TRUE);

-- ================================
-- 13. ข้อมูล Partners
-- ================================

INSERT INTO partners (id, name, company_type, description, logo_url, website, contact_email, partnership_type, discount_rate, discount_code, contract_start_date, contract_end_date, status, is_featured) VALUES
(1, 'Whey Pro Thailand', 'supplement', 'ผู้จำหน่ายอาหารเสริมคุณภาพสูง โปรตีนเวย์ และวิตามิน', '/uploads/partners/wheypro-logo.jpg', 'https://wheypro.co.th', 'partnership@wheypro.co.th', 'discount_provider', 15.00, 'FITCONNECT15', '2024-01-01', '2024-12-31', 'active', TRUE),

(2, 'Nike Thailand', 'equipment', 'อุปกรณ์กีฬาและเสื้อผ้าออกกำลังกาย', '/uploads/partners/nike-logo.jpg', 'https://nike.com/th', 'b2b@nike.com', 'sponsor', 10.00, 'NIKEFIT10', '2024-03-01', '2025-02-28', 'active', TRUE),

(3, 'Massage Therapy Center', 'wellness', 'ศูนย์นวดเพื่อการกีฬาและการฟื้นฟู', '/uploads/partners/massage-center-logo.jpg', 'https://massagetherapy.co.th', 'info@massagetherapy.co.th', 'affiliate', 20.00, 'RECOVERY20', '2024-02-15', '2024-12-31', 'active', FALSE);

-- ================================
-- 14. ข้อมูล Messages (Chat)
-- ================================

INSERT INTO messages (id, sender_id, receiver_id, conversation_id, message_type, content, is_read, read_at) VALUES
(1, 20, 10, 'customer_20_trainer_10', 'text', 'สวัสดีครับ ผมสนใจแพคเกจเพิ่มกล้ามเนื้อครับ', TRUE, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 10, 20, 'customer_20_trainer_10', 'text', 'สวัสดีครับ! ยินดีให้คำปรึกษาครับ คุณมีประสบการณ์ออกกำลังกายมาก่อนไหมครับ?', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(3, 20, 10, 'customer_20_trainer_10', 'text', 'เคยครับ แต่ไม่ค่อยเป็นระบบ อยากได้โปรแกรมที่เหมาะกับผม', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(4, 10, 20, 'customer_20_trainer_10', 'text', 'เข้าใจครับ แนะนำแพคเกจ Muscle Building Starter ครับ จะมีการประเมินสมรรถภาพก่อนเริ่มโปรแกรม', FALSE, NULL),

(5, 21, 11, 'customer_21_trainer_11', 'text', 'สวัสดีค่ะ ดิฉันสนใจคลาสโยคะค่ะ', TRUE, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(6, 11, 21, 'customer_21_trainer_11', 'text', 'สวัสดีค่ะ! ยินดีมากเลยค่ะ คุณเคยเล่นโยคะมาก่อนไหมคะ?', TRUE, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(7, 21, 11, 'customer_21_trainer_11', 'text', 'เคยค่ะ แต่นานแล้ว อยากเริ่มใหม่ค่ะ', FALSE, NULL);

-- ================================
-- 15. ข้อมูล Notifications
-- ================================

INSERT INTO notifications (user_id, title, message, notification_type, related_id, action_url, is_read, priority) VALUES
(20, 'เซสชั่นใกล้เข้าแล้ว', 'คุณมีเซสชั่นกับเทรนเนอร์จอห์นพรุ่งนี้เวลา 18:00 น.', 'session_reminder', 4, '/sessions/4', FALSE, 'normal'),
(21, 'ข้อความใหม่', 'คุณมีข้อความใหม่จากเทรนเนอร์ซาร่า', 'new_message', 6, '/messages', TRUE, 'normal'),
(10, 'การจองเซสชั่นใหม่', 'คุณสมชายได้จองเซสชั่นใหม่แล้ว', 'session_reminder', 4, '/trainer/sessions', FALSE, 'high'),
(22, 'โปรโมชั่นพิเศษ', 'ลดราคาแพคเกจโยคะ 20% สำหรับสมาชิกใหม่', 'promotion', NULL, '/packages', FALSE, 'low');

-- ================================
-- 16. ข้อมูล Nutrition Plans
-- ================================

INSERT INTO nutrition_plans (id, trainer_id, customer_id, name, description, target_calories, target_protein, target_carbs, target_fat, plan_duration_days, meals_data, guidelines, status, start_date, end_date) VALUES
(1, 1, 1, 'แผนเพิ่มกล้ามเนื้อ - สมชาย', 'แผนโภชนาการสำหรับการเพิ่มกล้ามเนื้อ เหมาะกับผู้ชายวัย 29 ปี น้ำหนัก 78 กก.', 2800, 140.00, 350.00, 93.00, 7,
'{"breakfast": {"calories": 650, "protein": 30, "meals": ["2 ฟองไข่", "ข้าวโอ๊ต 80g", "กล้วย 1 ลูก", "นมถั่วเหลือง 250ml"]}, "lunch": {"calories": 800, "protein": 40, "meals": ["ข้าวกล้อง 150g", "อกไก่ย่าง 120g", "ผักรวม", "น้ำมันมะกอก 1 ช้อนโต๊ะ"]}, "dinner": {"calories": 700, "protein": 35, "meals": ["ปลาแซลมอน 150g", "มันฝรั่งอบ 200g", "บร็อกโคลี", "อัลมอนด์ 30g"]}, "snacks": {"calories": 650, "protein": 35, "meals": ["เวย์โปรตีน 1 scoop", "ข้าวโพดคั่ว 50g", "โยเกิร์ตกรีก 200g"]}}',
'ดื่มน้ำวันละ 3-4 ลิตร, รับประทานอาหารทุก 3-4 ชั่วโมง, หลีกเลี่ยงของทอดและน้ำตาลมาก', 'active', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),

(2, 2, 2, 'แผนลดน้ำหนัก - สมหญิง', 'แผนโภชนาการสำหรับการลดน้ำหนักและเสริมสร้างสุขภาพ', 1800, 90.00, 180.00, 60.00, 14,
'{"breakfast": {"calories": 400, "protein": 20, "meals": ["ไข่ขาว 3 ฟอง", "ขนมปังโฮลวีท 2 แผ่น", "อโวคาโด 1/2 ลูก"]}, "lunch": {"calories": 500, "protein": 25, "meals": ["สลัดไก่ย่าง", "ข้าวกล้อง 100g", "น้ำสลัดโยเกิร์ต"]}, "dinner": {"calories": 450, "protein": 25, "meals": ["ปลาต้ม 120g", "ผักรวมต้ม", "ข้าวหอมมะลิ 80g"]}, "snacks": {"calories": 450, "protein": 20, "meals": ["ผลไม้ตามฤดู", "ถั่วอัลมอนด์ 20g", "น้ำผึ้ง 1 ช้อนชา"]}}',
'หลีกเลี่ยงขนมหวาน น้ำอัดลม ดื่มชาเขียวและน้ำมะนาว', 'active', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY));

-- ================================
-- 17. ข้อมูล Progress Records
-- ================================

INSERT INTO progress_records (customer_id, recorded_date, weight, body_fat_percentage, muscle_mass, measurements, photos, notes, mood_score, energy_level) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 78.50, 18.5, 45.2, '{"chest": 95, "waist": 82, "arms": 32, "thighs": 58}', '["progress/somchai_week0_front.jpg", "progress/somchai_week0_side.jpg"]', 'เริ่มต้นโปรแกรม รู้สึกกระตือรือร้น', 8, 7),
(1, CURDATE(), 78.2, 17.8, 45.8, '{"chest": 96, "waist": 81, "arms": 32.5, "thighs": 58.5}', '["progress/somchai_week1_front.jpg", "progress/somchai_week1_side.jpg"]', 'เห็นความเปลี่ยนแปลงเล็กน้อย รู้สึกแข็งแรงขึ้น', 9, 8),

(2, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 55.0, 25.2, 35.1, '{"chest": 85, "waist": 70, "hips": 92}', '["progress/somying_start_front.jpg"]', 'เริ่มคลาสโยคะ ตื่นเต้นมาก', 7, 6),
(2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 54.7, 24.8, 35.3, '{"chest": 85, "waist": 69, "hips": 91.5}', '["progress/somying_week1_front.jpg"]', 'รู้สึกยืดหยุ่นขึ้น นอนหลับดีขึ้น', 9, 8);

-- ================================
-- 18. ข้อมูล Payments
-- ================================

INSERT INTO payments (payer_id, receiver_id, related_type, related_id, amount, currency, payment_method, payment_provider, transaction_id, status, fee_amount, net_amount, paid_at) VALUES
(20, 1, 'package_purchase', 1, 4500.00, 'THB', 'credit_card', 'omise', 'charge_test_5xtsdo2c2dfrm0z37k1', 'completed', 135.00, 4365.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(21, 2, 'package_purchase', 2, 3200.00, 'THB', 'promptpay', 'scb_easy', 'pp_test_5xtsdo2c2dfrm0z37k2', 'completed', 32.00, 3168.00, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(23, 1, 'package_purchase', 3, 15000.00, 'THB', 'bank_transfer', 'manual', 'bank_transfer_001', 'completed', 0.00, 15000.00, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(24, 2, 'package_purchase', 4, 5600.00, 'THB', 'credit_card', 'stripe', 'pi_test_5xtsdo2c2dfrm0z37k3', 'completed', 168.00, 5432.00, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(20, NULL, 'event_registration', 1, 1500.00, 'THB', 'promptpay', 'scb_easy', 'pp_test_event_001', 'completed', 15.00, 1485.00, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ================================
-- 19. ข้อมูล Coupons
-- ================================

INSERT INTO coupons (code, name, description, discount_type, discount_value, minimum_amount, usage_limit, usage_limit_per_user, starts_at, expires_at, applicable_to, is_active, created_by) VALUES
('WELCOME20', 'ยินดีต้อนรับสมาชิกใหม่', 'ส่วนลด 20% สำหรับสมาชิกใหม่', 'percentage', 20.00, 1000.00, 100, 1, DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_ADD(NOW(), INTERVAL 60 DAY), 'packages', TRUE, 1),
('NEWYEAR2024', 'ส่วนลดปีใหม่', 'ส่วนลดพิเศษรับปีใหม่', 'fixed_amount', 500.00, 2000.00, 50, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 20 DAY), 'all', TRUE, 1),
('SUMMER50', 'ส่วนลดฤดูร้อน', 'ส่วนลดคงที่ 50 บาทสำหรับอีเว้นท์', 'fixed_amount', 50.00, 200.00, 200, 2, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 'events', TRUE, 1);

-- ================================
-- 20. ข้อมูล Coupon Usage
-- ================================

INSERT INTO coupon_usage (coupon_id, user_id, order_type, order_id, discount_amount) VALUES
(1, 20, 'package_purchase', 1, 900.00),  -- 20% ของ 4500
(1, 21, 'package_purchase', 2, 640.00),   -- 20% ของ 3200  
(2, 23, 'package_purchase', 3, 500.00),  -- ส่วนลดคงที่ 500
(3, 20, 'event_registration', 1, 50.00); -- ส่วนลดอีเว้นท์

-- ================================
-- 21. ข้อมูล System Settings
-- ================================

INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', 'FitConnect', 'string', 'general', 'ชื่อเว็บไซต์', TRUE),
('site_description', 'แพลตฟอร์มค้นหาเทรนเนอร์ออกกำลังกายที่ดีที่สุดในประเทศไทย', 'string', 'general', 'คำอธิบายเว็บไซต์', TRUE),
('site_logo', '/uploads/system/logo.png', 'string', 'general', 'โลโก้เว็บไซต์', TRUE),
('contact_email', 'info@fitconnect.com', 'string', 'general', 'อีเมลติดต่อ', TRUE),
('contact_phone', '02-123-4567', 'string', 'general', 'เบอร์โทรติดต่อ', TRUE),
('default_commission_rate', '10.00', 'number', 'payment', 'อัตราค่าคอมมิชชั่นเริ่มต้น (%)', FALSE),
('currency', 'THB', 'string', 'payment', 'สกุลเงิน', TRUE),
('timezone', 'Asia/Bangkok', 'string', 'general', 'เขตเวลา', FALSE),
('max_trainer_images', '12', 'number', 'general', 'จำนวนรูปภาพสูงสุดต่อเทรนเนอร์', FALSE),
('max_trainer_packages', '3', 'number', 'general', 'จำนวนแพคเกจสูงสุดต่อเทรนเนอร์', FALSE),
('maintenance_mode', 'false', 'boolean', 'maintenance', 'โหมดปิดปรับปรุงระบบ', FALSE),
('google_analytics_id', 'GA-XXXXXXXXX', 'string', 'seo', 'Google Analytics ID', FALSE),
('facebook_pixel_id', 'FB-XXXXXXXXX', 'string', 'social', 'Facebook Pixel ID', FALSE);

-- ================================
-- 22. ข้อมูล Newsletter Subscriptions
-- ================================

INSERT INTO newsletter_subscriptions (email, user_id, status, subscription_source, interests) VALUES
('newsletter1@example.com', NULL, 'subscribed', 'website', '["fitness_tips", "nutrition"]'),
('newsletter2@example.com', NULL, 'subscribed', 'website', '["events", "promotions"]'),
('somchai@example.com', 20, 'subscribed', 'registration', '["fitness_tips", "nutrition", "events"]'),
('somying@example.com', 21, 'subscribed', 'registration', '["yoga", "mindfulness"]');

-- ================================
-- 23. ข้อมูล Activity Logs  
-- ================================

INSERT INTO activity_logs (user_id, action, description, model_type, model_id, ip_address) VALUES
(20, 'user_login', 'ผู้ใช้เข้าสู่ระบบ', 'User', 20, '192.168.1.100'),
(20, 'package_purchase', 'ซื้อแพคเกจ Muscle Building Starter', 'Package', 1, '192.168.1.100'),
(10, 'trainer_login', 'เทรนเนอร์เข้าสู่ระบบ', 'User', 10, '192.168.1.101'),
(10, 'session_completed', 'เซสชั่นเสร็จสิ้น', 'Session', 1, '192.168.1.101'),
(1, 'admin_login', 'แอดมินเข้าสู่ระบบ', 'User', 1, '192.168.1.200'),
(21, 'review_created', 'สร้างรีวิวใหม่', 'Review', 2, '192.168.1.102');

-- เปิด foreign key checks กลับ
SET FOREIGN_KEY_CHECKS = 1;

-- ================================
-- Reset AUTO_INCREMENT counters
-- ================================

ALTER TABLE users AUTO_INCREMENT = 100;
ALTER TABLE trainers AUTO_INCREMENT = 10;
ALTER TABLE customers AUTO_INCREMENT = 10;
ALTER TABLE packages AUTO_INCREMENT = 10;
ALTER TABLE sessions AUTO_INCREMENT = 10;
ALTER TABLE reviews AUTO_INCREMENT = 10;
ALTER TABLE articles AUTO_INCREMENT = 10;
ALTER TABLE events AUTO_INCREMENT = 10;
ALTER TABLE payments AUTO_INCREMENT = 100;
ALTER TABLE messages AUTO_INCREMENT = 100;
ALTER TABLE notifications AUTO_INCREMENT = 100;

-- ================================
-- Verify Data Insertion
-- ================================

SELECT 'Users created:' as Info, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Trainers created:', COUNT(*) FROM trainers  
UNION ALL
SELECT 'Customers created:', COUNT(*) FROM customers
UNION ALL
SELECT 'Packages created:', COUNT(*) FROM packages
UNION ALL
SELECT 'Sessions created:', COUNT(*) FROM sessions
UNION ALL
SELECT 'Reviews created:', COUNT(*) FROM reviews
UNION ALL
SELECT 'Articles created:', COUNT(*) FROM articles
UNION ALL
SELECT 'Events created:', COUNT(*) FROM events
UNION ALL
SELECT 'Gyms created:', COUNT(*) FROM gyms
UNION ALL
SELECT 'Messages created:', COUNT(*) FROM messages
UNION ALL
SELECT 'Payments completed:', COUNT(*) FROM payments WHERE status = 'completed';

-- ================================
-- Sample Queries for Testing
-- ================================

-- ค้นหาเทรนเนอร์ที่มี rating สูงสุด
SELECT u.first_name, u.last_name, t.rating, t.total_reviews 
FROM trainers t 
JOIN users u ON t.user_id = u.id 
ORDER BY t.rating DESC, t.total_reviews DESC;

-- ดูแพคเกจที่ขายดีที่สุด
SELECT p.name, p.price, p.total_sold, u.first_name as trainer_name
FROM packages p 
JOIN trainers t ON p.trainer_id = t.id
JOIN users u ON t.user_id = u.id
ORDER BY p.total_sold DESC;

-- สถิติรายได้ของเทรนเนอร์แต่ละคน
SELECT u.first_name, u.last_name, t.total_earnings, COUNT(pp.id) as active_packages
FROM trainers t
JOIN users u ON t.user_id = u.id
LEFT JOIN package_purchases pp ON t.id = pp.trainer_id AND pp.status = 'active'
GROUP BY t.id
ORDER BY t.total_earnings DESC;