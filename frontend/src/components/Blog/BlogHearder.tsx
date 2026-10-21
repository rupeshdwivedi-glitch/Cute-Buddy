import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const BlogHearder: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <Wrapper>
      <div className='section-center'>
        <h3>
          <Link to='/'>Home</Link>
          {title ? (
            <>
              <Link to='/blogs'>/ Blog</Link>/ {title}
            </>
          ) : (
            <>/ Blogs</>
          )}
        </h3>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  background: var(--clr-primary-10);
  width: 100%;
  min-height: 15vh;
  display: flex;
  align-items: center;
  padding: 1.5rem 0;
  color: var(--clr-primary-1);

  h3 {
    margin-bottom: 0;
    font-size: 1rem;
    line-height: 1.8;
    word-break: break-word;
  }
  a {
    color: var(--clr-primary-3);
    padding: 0.5rem 0.25rem;
    transition: var(--transition);
  }
  a:hover {
    color: var(--clr-primary-1);
  }

  @media (min-width: 576px) {
    min-height: 20vh;
    h3 {
      font-size: 1.5rem;
    }
    a {
      padding: 0.5rem;
    }
  }
  @media (min-width: 992px) {
    h3 {
      font-size: 2rem;
    }
  }
` 
export default BlogHearder
