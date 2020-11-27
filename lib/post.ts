export const getSortedPostData =  async () => {
  const key = {
    headers: {'X-API-KEY': process.env.X_API_KEY},
  };
  const res = await fetch(
    `https://azerbaijapan.microcms.io/api/v1/blogs?limit=1000`,
    key,
  );
  const data = await res.json();
  const contents = data.contents;
  const postData = contents.map(content => {
    const id = content.id;
    const title = content.title;
    const eyecatch = content.eyecatch;
    const description = content.body;
    const publishedAt = content.publishedAt;
    const updatedAt = content.updatedAt;
    const tag = content.tag;
    return {id, title, eyecatch, description, publishedAt, updatedAt, tag};
  })
  return postData;
}

export const getAllPostIds = async() => {
  const key = {
    headers: {'X-API-KEY': process.env.X_API_KEY},
  };
  const res = await fetch(
    `https://azerbaijapan.microcms.io/api/v1/blogs?limit=1000`,
    key,
  );
  const data = await res.json();
  const contents = data.contents;

  //ここでreturnされるのは
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  // こいうオブジェクト配列じゃないとダメ
  return contents.map(content => {
    return {
      params: {
        id: content.id
      }
    }
  });
}

export const getPostData = async(slug) => {
  const key = {
    headers: {'X-API-KEY': process.env.X_API_KEY},
  };
  const res = await fetch(
    `https://azerbaijapan.microcms.io/api/v1/blogs/${slug}`,
    key,
  );
  const data = await res.json();
  const title = data.title;
  const publishedAt = data.publishedAt;
  const updatedAt = data.updatedAt;
  const eyecatch = data.eyecatch;
  const content = data.body;
  const tag = data.tag;
  return {
    id: slug,
    title: title,
    publishedAt: publishedAt,
    updatedAt: updatedAt,
    eyecatch: eyecatch,
    content: content,
    tag: tag,
  }
}

export const getRandomPostData =  async () => {
  const key = {
    headers: {'X-API-KEY': process.env.X_API_KEY},
  };
  const res = await fetch(
    `https://azerbaijapan.microcms.io/api/v1/blogs`,
    key,
  );
  const data = await res.json();
  const contents = data.contents;
  const postData = contents.map(content => {
    const id = content.id;
    const title = content.title;
    const eyecatch = content.eyecatch;
    const description = content.body;
    const publishedAt = content.publishedAt;
    const updatedAt = content.updatedAt;
    const tag = content.tag;
    return {id, title, eyecatch, description, publishedAt, updatedAt, tag};
  })
  const postDataLength = postData.length;
  const randomIndex = Math.floor(Math.random() * postDataLength);
  const randomPostData = postData[randomIndex];
  return randomPostData;
}

export const wpGetPostsSortedByLang = async(lang) => {
  const res = await fetch(`https://azerbaijapan.taichi-sigma2.com/${lang}/wp-json/wp/v2/posts?_fields=id,acf,title,date,modified,content,meta,categories,category_name,tags`);
  const data = await res.json();
  const postData = data.map(eachData => {
    const id = eachData.id;
    const eyecatch = eachData.acf.eyecatch;
    const title = eachData.title.rendered;
    const publishedAt = eachData.date;
    const updatedAt = eachData.modified;
    const tags = eachData.tags;
    const lang = eachData.meta['_locale'];
    const content = eachData.content.rendered;
    const category_name = eachData.category_name;
    const category_id = eachData.categories;
    return {id, eyecatch, title, publishedAt, updatedAt,tags,lang, content, category_name, category_id}
  });
  return postData;
}

export const wpGetAllPosts = async () => {
  const postArrayJp = await wpGetPostsSortedByLang('ja');
  const postArrayAz = await wpGetPostsSortedByLang('az');
  const postArrayEn = await wpGetPostsSortedByLang('en');
  const postArrayRu = await wpGetPostsSortedByLang('ru');
  console.log([...postArrayAz, ...postArrayEn, ...postArrayJp, ...postArrayRu]);
  
}
