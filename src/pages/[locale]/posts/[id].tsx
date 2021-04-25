import { wpBaseUrl, wpGenerateNextAndPrevArray } from 'lib/post';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import PostTemplate from "components/template/Post/PostTemplate";
import { fetchWithCache } from "lib/helpers";
import Head from "next/head";

// postの中のcssはglobal.cssに記載

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  let postData, nextAndPrev;
  const localeParam: string = String(context.query.locale);
  const idParam: number = Number(context.query.id);
  await Promise.all([
    (async () => {
      postData = await fetchWithCache(`${wpBaseUrl}/wp-json/wp/v2/posts/${idParam}?_fields=id,acf,title,date,modified,content,meta,categories,category_name,tags,translate_group`);
    })(),
    (async () => {
      nextAndPrev = await wpGenerateNextAndPrevArray(`${localeParam}`, idParam);
    })(),
  ]);
  
  return {
    props: {
      postData,
      nextAndPrev,
    }
  }
}

const Post = ({postData, nextAndPrev}) => (
  <>
    <Head>
      <meta property="og:image" content={postData.acf.eyecatch} key={"og_image"}/>
      <meta name="twitter:image:src" content={postData.acf.eyecatch} key={"tw_image_src"}/>
      <meta name="twitter:image" content={postData.acf.eyecatch} key={"tw_image"}/>
      {/*<meta name="keywords" content={postData}/>*/}
      <title>{postData.title.rendered}</title>
    </Head>
    <PostTemplate postData={postData} nextAndPrev={nextAndPrev}/>
  </>
);

export default Post;
