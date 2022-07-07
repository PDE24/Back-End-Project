\c nc_games_test

SELECT reviews.*, COUNT(comments.review_id)::INT AS COMMENT_COUNT FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC

-- SELECT * FROM reviews
-- WHERE category = 'social deduction'

-- INSERT INTO comments
--     (author, body, review_id)
-- VALUES
--     ('mallionaire', 'This is a test review', 1)
-- RETURNING *;

-- SELECT * FROM comments

-- SELECT reviews.*, COUNT(comments.review_id) AS COMMENT_COUNT
-- FROM reviews
-- LEFT JOIN comments
-- ON comments.review_id = reviews.review_id
-- GROUP BY reviews.review_id
-- ORDER BY reviews.created_at DESC


-- SELECT reviews.*, COUNT(comments.review_id) AS COMMENT_COUNT
-- FROM reviews
-- LEFT JOIN comments
-- ON comments.review_id = reviews.review_id 
-- GROUP BY reviews.review_id
-- WHERE reviews.review_id = 1



-- SELECT *, COUNT(comments.review_id) AS COMMENT_COUNT 
-- FROM reviews
-- LEFT JOIN comments
-- ON reviews.review_id = comments.review_id
-- WHERE reviews.review_id = 1

