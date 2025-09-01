create or replace function get_posts_with_category(
  search text default null,
  limit_count int default 10,
  offset_count int default 0
)
returns json as $$
    select coalesce(
        json_agg(posts_with_categories),
        '[]'::json
    )
    from (
        select json_build_object(
            'id', p.id,
            'title', p.title,
            'created_at', p.created_at,
            'author_id', p.author_id,
            'categories', (
                select coalesce(
                    json_agg(
                        json_build_object(
                            'id', c.category_id,
                            'title', c.title
                        )
                    ),
                    '[]'::json
                )
                from cate_post_rel rel
                join post_categories c on rel.cate_id = c.category_id
                where rel.post_id = p.id
            )
        ) as posts_with_categories
        from posts p
        where search is null or p.title ilike '%' || search || '%'
        order by p.created_at desc
        limit limit_count offset offset_count
    ) t;
$$ language sql stable;
