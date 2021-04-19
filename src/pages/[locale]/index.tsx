import Head from 'next/head'
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { wpBaseUrl } from 'lib/post';
import { locale, LocaleType, useLocaleContext } from 'context/localeContext';
import { getPostsFilteredByTagAndLangWp } from 'lib/tags';
import { fetchWithCache } from "lib/helpers";
import { langType } from "types";
import styles from "styles/index.module.scss";
import Pagination from "components/molecules/Pagination/Pagination";
import { NextRouter, useRouter } from "next/router";
import Title from "components/atom/Title/Title";
import PostList from "components/organism/PostList/PostList";
import Button from "components/atom/Button/Button";
import LangSelect from "components/atom/LangSelect/LangSelect";


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const allPostsUrl: string = "wp-json/wp/v2/posts?per_page=100&_fields=id,acf,title,date,modified,content,meta,categories,category_name,tags,tag_name";
  const langString: string = String(context.query.locale);
  let allPostData: langType = {
    'ja': [],
    'az': [],
    'en': [],
    'ru': [],
  }, postsFilteredByTag: langType = {
    'ja': [],
    'az': [],
    'en': [],
    'ru': [],
  }
  await Promise.all([
    (async () => {
      allPostData[langString] = await fetchWithCache(`${wpBaseUrl}/${langString}/${allPostsUrl}`)
    })(),
    (async () => {
      postsFilteredByTag[langString] = await getPostsFilteredByTagAndLangWp(langString, 8);
    })(),
  ]);
  return {
    props: {
      allPostData,
      postsFilteredByTag,
    }
  }
}

const Home = ({allPostData, postsFilteredByTag}) => {
  const router: NextRouter = useRouter();
  const localeContext: LocaleType = useLocaleContext();
  const allPostDataArray = allPostData[localeContext];
  
  const thumbnailDataArray = allPostDataArray.map(post => ({
    id: post.id,
    title: post.title.rendered,
    eyecatch: post.acf.eyecatch,
    description: post.content.rendered,
    tags: post.tag_name,
  }));
  
  const thumbnailDataArraySelected = postsFilteredByTag[localeContext].map(postData => ({
    id: postData.id,
    title: postData.title.rendered,
    eyecatch: postData.acf.eyecatch,
    description: postData.content.rendered,
    tags: postData.tag_name
  }));
  
  return (
    <>
      <Head>
        <meta property="og:type" content="website"/>
        <title>{locale(localeContext).layout.home}</title>
      </Head>
      <div className={styles.indexStatement}>
        <div className={styles.left}>
          <p style={{display: "none",}}>Dear S.K.</p>
          {locale(localeContext).top.description.map((p: string, i: number) => <p key={i}>{p}</p>)}
        </div>
        <div className={styles.right}>
          <LangSelect/>
        </div>
      </div>
      
      <Title
        title={locale(localeContext).selectedEight.title}
        subtitle={locale(localeContext).selectedEight.subtitle}
      />
      <PostList thumbnailDataArray={thumbnailDataArraySelected}/>
      <Pagination perPage={10} total={330}/>
      <div className="m-s-36"/>
      <div className="m-s-36"/>
      <Title
        title={locale(localeContext).posts.title}
        subtitle={locale(localeContext).posts.subtitle}
      />
      <PostList thumbnailDataArray={thumbnailDataArray}/>
      <Pagination perPage={10} total={330}/>
      <div className="m-s-36"/>
      <Button path={`/${String(router.query.locale)}/allposts`}>{locale(localeContext).buttonText.toArchive}</Button>
      <div className="m-s-36"/>
      <div className="m-s-36"/>
      <div className="m-s-36"/>
    </>
  )
}

export default Home;
