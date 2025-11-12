-- Seed data for local development of profile + notification flows
-- Run with: npm run db:seed

INSERT INTO users (id, email, display_name, faculty, bio, avatar_url)
VALUES
  (1, 'mali@cmu.ac.th', 'Mali Thongchai', 'Engineering', 'Green campus advocate in CMU Engineering', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200'),
  (2, 'chai@cmu.ac.th', 'Chai Kittisak', 'Science', 'Loves swapping gadgets with friends', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200')
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    faculty = EXCLUDED.faculty,
    bio = EXCLUDED.bio,
    avatar_url = EXCLUDED.avatar_url;

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

INSERT INTO items (id, user_id, title, description, category, condition, status, images, tags)
VALUES
  (1, 1, 'IKEA Standing Lamp', 'Soft warm light lamp perfect for dorms', 'furniture', 'good', 'available', ARRAY['https://images.unsplash.com/photo-1449247613801-ab06418e2861?w=600'], ARRAY['lamp','lighting']),
  (2, 2, 'Arduino Starter Kit', 'Complete kit with sensors and tutorials', 'electronics', 'new', 'available', ARRAY['https://images.unsplash.com/photo-1517433456452-f9633a875f6f?w=600'], ARRAY['arduino','kit']),
  (3, 2, 'Cycling Helmet', 'Medium size helmet with LEDs', 'sports', 'good', 'available', ARRAY['https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=600'], ARRAY['helmet']),
  (4, 1, 'Bluetooth Speaker', 'Portable speaker with 10h battery', 'electronics', 'good', 'available', ARRAY['https://images.unsplash.com/photo-1490376840453-5f616fbebe5b?w=600'], ARRAY['speaker'])
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    images = EXCLUDED.images,
    tags = EXCLUDED.tags;

SELECT setval('items_id_seq', (SELECT MAX(id) FROM items));

INSERT INTO exchange_requests (id, requester_id, owner_id, item_id, offered_item_id, message, status)
VALUES
  (1, 2, 1, 1, 2, 'แลมป์ของคุณดูเข้ากับมุมอ่านหนังสือของผมมาก ขอแลกกับ Arduino Kit ไหม?', 'pending'),
  (2, 1, 2, 3, 4, 'หมวกปั่นจักรยานมีไฟท้ายหรือเปล่า? ผมมีลำโพงบลูทูธอยากแลกครับ', 'accepted')
ON CONFLICT (id) DO UPDATE
SET message = EXCLUDED.message,
    status = EXCLUDED.status,
    offered_item_id = EXCLUDED.offered_item_id,
    updated_at = NOW();

SELECT setval('exchange_requests_id_seq', (SELECT MAX(id) FROM exchange_requests));

INSERT INTO exchanges (request_id, exchange_code, created_at, verified_at, completed_at)
VALUES
  (2, 'XC-482913', NOW(), NOW(), NULL)
ON CONFLICT (request_id) DO UPDATE
SET exchange_code = EXCLUDED.exchange_code,
    verified_at = NOW(),
    completed_at = NULL;
