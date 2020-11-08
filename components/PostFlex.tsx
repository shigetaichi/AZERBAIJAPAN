import React, {useState, useEffect} from 'react'
import styles from '../components-style/PostFlex.module.css';
import {PostThumbnail} from '../components';
import ReactPaginate from 'react-paginate';
import Router, { withRouter, useRouter } from 'next/router';

const sliceByNumber = (array, number) => {
  const length = Math.ceil(array.length / number)
  return new Array(length).fill(undefined).map((_, i) =>
    array.slice(i * number, (i + 1) * number)
  )
}

interface Props {
  thumbnailDataArray: any;
  perPage?: number;
  isPaginate?: boolean;
}

const PostFlex = (props: Props) => {
  const router = useRouter();
  let thumbnailDataArray = props.thumbnailDataArray;
  const postDataCount = thumbnailDataArray.length;
  let isPaginate = props.isPaginate;
  if(props.perPage > postDataCount){
    isPaginate = false;
  }
  const [nowPath, setNowPath] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);


  let slicedThumbnailDataArray = [];
  if(isPaginate){
    slicedThumbnailDataArray = sliceByNumber(thumbnailDataArray, props.perPage);
  }
  

  useEffect(() => { //After the component is mounted set router event handlers
    Router.events.on('routeChangeStart', startLoading); 
    Router.events.on('routeChangeComplete', stopLoading);
    setNowPath(0);
    return () => {
      Router.events.off('routeChangeStart', startLoading);
      Router.events.off('routeChangeComplete', stopLoading);
    }
  }, [])

  const paginationHandler = (page) => {
    const currentPath = router.pathname;
    const currentQuery = router.query;
    currentQuery.page = page.selected + 1;
    setNowPath(page.selected);
    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  // let content = null;
  
  return (
    <React.Fragment>
    {(() => {
      if (isLoading)
        return <div className="loader">Loading...</div>;
      else {
        //Generating posts list
        if(isPaginate){
          return(
            <div className={styles.post_flex}>
              {slicedThumbnailDataArray[nowPath].map((thumbnailData, i) => (
                <PostThumbnail
                  key={i}
                  id={thumbnailData.id}
                  title={thumbnailData.title}
                  image={thumbnailData.eyecatch.url}
                  description={thumbnailData.description}
                />
              ))}
            </div>
          )
        }else{
          return(
            <div className={styles.post_flex}>
              {thumbnailDataArray.map((thumbnailData, i) => (
                <PostThumbnail
                  key={i}
                  id={thumbnailData.id}
                  title={thumbnailData.title}
                  image={thumbnailData.eyecatch.url}
                  description={thumbnailData.description}
                />
              ))}
            </div>
          )
        }
      }})()
    }
    <div className="module-spacer--medium"></div>
    <div className="module-spacer--medium"></div>
    {isPaginate && (
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        activeClassName={'active'}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
  
        initialPage={0}
        pageCount={postDataCount / props.perPage}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={paginationHandler}
      />
    )}
    </React.Fragment>
  )
}

export default PostFlex
