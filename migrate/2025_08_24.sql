SELECT 
    pc.category_id,
    pc.title,
    json_agg(
        json_build_object(
            'id', p.id,
            'title', p.title,
            'content', p.content
            
        )
    ) AS posts
FROM post_categories pc
LEFT JOIN cate_post_rel rel ON pc.category_id = rel.cate_id
LEFT JOIN posts p ON rel.post_id = p.id
GROUP BY pc.category_id, pc.title;

CREATE OR REPLACE FUNCTION get_categories_with_posts()
RETURNS SETOF json AS $$
    SELECT json_build_object(
        'category_id', pc.category_id,
        'title', pc.title,
        'posts', COALESCE(
            json_agg(
                json_build_object(
                    'id', p.id,
                    'title', p.title,
                    'content', p.content
                )
            ) FILTER (WHERE p.id IS NOT NULL), '[]'::json
        )
    )
    FROM post_categories pc
    LEFT JOIN cate_post_rel rel ON pc.category_id = rel.cate_id
    LEFT JOIN posts p ON rel.post_id = p.id
    GROUP BY pc.category_id, pc.title;
$$ LANGUAGE sql STABLE;

