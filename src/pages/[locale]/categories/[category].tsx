import { locale, LocaleType, useLocaleContext } from 'context/localeContext';
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { langType } from "types";
import Category from "components/template/Category/Category";
import { wpBaseUrl } from "lib/post";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const localeData: string = String(context.query.locale)
  let postsFilteredByCategory: langType, catNameArray: langType;
  postsFilteredByCategory = {
    'ja': [],
    'az': [],
    'en': [],
    'ru': [],
  };
  catNameArray = {
    'ja': [],
    'az': [],
    'en': [],
    'ru': [],
  };
  await Promise.all([
    (async () => {
      postsFilteredByCategory[localeData] = await (await fetch(`${wpBaseUrl}/wp-json/wp/v2/posts?categories=${Number(context.query.category)}&lang=${localeData}`)).json();
    })(),
    (async () => {
      catNameArray[localeData] = await (await fetch(`${wpBaseUrl}/wp-json/wp/v2/categories/${Number(context.query.category)}?lang=${localeData}`)).json();
    })(),
  ]);
  return {
    props: {
      postsFilteredByCategory,
      catNameArray,
    }
  }
}

const CategoryPage = ({postsFilteredByCategory, catNameArray}) => {
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
      <Category catName={catName.name} thumbnailDataArray={thumbnailDataArray}/>
    </>
  )
}

export default CategoryPage
