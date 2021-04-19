import { getCatNameByLangAndId, getPostsFilteredByCategoryAndLangWp } from 'lib/category';
import { locale, LocaleType, useLocaleContext } from 'context/localeContext';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import PostList from "components/organism/PostList/PostList";
import Head from "next/head";
import Title from "components/atom/Title/Title";
import Button from "components/atom/Button/Button";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const localeData: string = String(context.query.locale)
  let postsFilteredByCategory: { [key: string]: Array<any> }, catNameArray: { [key: string]: any };
  postsFilteredByCategory = {
    'ja': [],
    'aze': [],
    'en': [],
    'ru': [],
  };
  catNameArray = {
    'ja': [],
    'aze': [],
    'en': [],
    'ru': [],
  };
  await Promise.all([
    (async () => {
      postsFilteredByCategory[localeData] = await getPostsFilteredByCategoryAndLangWp(localeData, Number(context.query.category));
    })(),
    (async () => {
      catNameArray[localeData] = await getCatNameByLangAndId(localeData, Number(context.query.category));
    })(),
  ]);
  return {
    props: {
      postsFilteredByCategory,
      catNameArray,
    }
  }
}

const Category = ({postsFilteredByCategory, catNameArray}) => {
  const localeContext: LocaleType = useLocaleContext();
  const thumbnailDataArray = postsFilteredByCategory[localeContext].map(postData => ({
    id: postData.id,
    title: postData.title.rendered,
    eyecatch: postData.acf.eyecatch,
    description: postData.content.rendered,
    tags: postData.tag_name,
  }));
  const catName = catNameArray[localeContext];
  
  return (
    <>
      <Head>
        <title>{catName.name + locale(localeContext).categories.title}</title>
      </Head>
      <Title title={catName.name} subtitle={locale(localeContext).categoryArchive.subtitle}/>
      <PostList thumbnailDataArray={thumbnailDataArray}/>
      <Button path={"/allposts"}>{locale(localeContext).buttonText.toArchive}</Button>
    </>
  )
}

export default Category
