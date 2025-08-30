CREATE OR REPLACE FUNCTION get_posts_by_category(cid uuid)
RETURNS json AS $$
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', p.id,
                'title', p.title,
                'content', p.content,
                'created_at', p.created_at,
                'author_name', p.author_name
            )
        ),
        '[]'::json
    )
    FROM cate_post_rel rel
    JOIN posts p ON rel.post_id = p.id
    WHERE rel.cate_id = cid;
$$ LANGUAGE sql STABLE;