import React from 'react'
import { getAllCategoryWp, getPostsFilteredByCategoryAndLangWp } from '../lib/category';
import Link from 'next/link';
import styles from '../components-style/CategoryArea.module.css';

const CategoryAreaWp = (props) => {
  const categories = props.categories;
  
  return (
    <div className={styles.category_wrapper}>
      {categories.map((category, i) => (
        <Link href={`/categories/${category.id}`} key={i}>
          <div className={styles.category}>
            <img className={styles.categoryImage} src={category.acf.category_images} alt=""/>
            <p className={styles.category_title}>{category.name}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default CategoryAreaWp

