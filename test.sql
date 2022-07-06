\c nc_games

SELECT reviews.*, COUNT(comments.review_id) AS COMMENT_COUNT
FROM reviews
LEFT JOIN comments
ON comments.review_id = reviews.review_id 
WHERE reviews.review_id = 1
GROUP BY reviews.review_id



-- SELECT *, COUNT(comments.review_id) AS COMMENT_COUNT 
-- FROM reviews
-- LEFT JOIN comments
-- ON reviews.review_id = comments.review_id
-- WHERE reviews.review_id = 1

