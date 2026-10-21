import React from 'react'
import styled from 'styled-components'
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa'

type BlogPost = {
  id: number
  category: string
  title: string
  excerpt: string
  date: string
  readTime: string
}

const posts: BlogPost[] = [
  {
    id: 1,
    category: 'safety',
    title: 'How to choose a safe car seat for your baby',
    excerpt:
      'A practical checklist covering size, certification and installation so your little one travels safely.',
    date: 'Oct 2, 2026',
    readTime: '5 min read',
  },
  {
    id: 2,
    category: 'clothing',
    title: 'Dressing your newborn: fabrics that are gentle on skin',
    excerpt:
      'Which materials to look for, which to avoid, and how to layer for every season.',
    date: 'Sep 24, 2026',
    readTime: '4 min read',
  },
  {
    id: 3,
    category: 'feeding',
    title: 'Bottle feeding basics: what to buy and what to skip',
    excerpt:
      'A simple guide to bottles, teats and sterilising, based on what parents actually use.',
    date: 'Sep 15, 2026',
    readTime: '6 min read',
  },
  {
    id: 4,
    category: 'toys',
    title: 'Age-appropriate toys that support early development',
    excerpt:
      'From sensory play to first puzzles, how to match toys to each stage of growth.',
    date: 'Sep 3, 2026',
    readTime: '5 min read',
  },
  {
    id: 5,
    category: 'new arrivals',
    title: 'New this month: imported favourites from Japan and Europe',
    excerpt:
      'A look at our latest limited-quantity arrivals and why they are worth a look.',
    date: 'Aug 27, 2026',
    readTime: '3 min read',
  },
  {
    id: 6,
    category: 'sleep',
    title: 'Building a calm bedtime routine that lasts',
    excerpt:
      'Small, consistent habits that help babies settle and help parents rest.',
    date: 'Aug 18, 2026',
    readTime: '4 min read',
  },
]

const BlogSection: React.FC = () => {
  return (
    <Wrapper>
      <div className='section-center'>
        <div className='title'>
          <h2>latest from our blog</h2>
          <div className='underline'></div>
        </div>
        <div className='blog-center'>
          {posts.map(({ id, category, title, excerpt, date, readTime }) => (
            <article key={id} className='post'>
              <div className='post-banner'>
                <span className='tag'>{category}</span>
              </div>
              <div className='post-body'>
                <h4>{title}</h4>
                <p>{excerpt}</p>
                <footer>
                  <span>
                    <FaRegCalendarAlt /> {date}
                  </span>
                  <span>
                    <FaRegClock /> {readTime}
                  </span>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  padding: 3rem 0;

  .title {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .title h2 {
    color: var(--clr-primary-1);
  }
  .underline {
    width: 6rem;
    height: 0.25rem;
    background: var(--clr-primary-5);
    margin: 0 auto;
  }

  .blog-center {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
  }

  .post {
    display: flex;
    flex-direction: column;
    background: var(--clr-white);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
    transition: var(--transition);
  }
  .post:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
  }

  .post-banner {
    height: 9rem;
    display: flex;
    align-items: flex-end;
    padding: 1rem;
    background: linear-gradient(
      135deg,
      var(--clr-primary-10),
      var(--clr-primary-5)
    );
  }
  .tag {
    background: var(--clr-white);
    color: var(--clr-primary-1);
    text-transform: uppercase;
    letter-spacing: var(--spacing);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius);
  }

  .post-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1.5rem;
  }
  .post-body h4 {
    color: var(--clr-primary-1);
    line-height: 1.4;
    margin-bottom: 0.75rem;
  }
  .post-body p {
    color: var(--clr-primary-3);
    line-height: 1.8;
    margin-bottom: 1.25rem;
  }
  footer {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    font-size: 0.85rem;
    color: var(--clr-primary-5);
  }
  footer span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  @media (min-width: 576px) {
    padding: 4rem 0;
    .blog-center {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (min-width: 992px) {
    padding: 5rem 0;
    .blog-center {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`

export default BlogSection
