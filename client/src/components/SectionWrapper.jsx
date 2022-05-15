import { Link } from 'react-router-dom'

const SectionWrapper = ({ sectionId, children, title, seeAllLink, breadcrumbs }) => (
  <section className={ sectionId + " section__detail"}>
    <div className="section__inner">
      <div className="section__top">
        <h2 className="section__header">
          
          {breadcrumbs && (
            <span className="section_breadcrumbs">
              <Link to='/'>Profile</Link>
            </span>
          )}

          {title && (
            <>
              {seeAllLink ? (
                <Link to={ seeAllLink }>{ title }</Link>
              ) : (
                <span>{ title }</span>
              )}
            </>
          )}
        </h2>
        
        {seeAllLink && (
          <Link to={ seeAllLink } className="section__see-all">See All</Link>
        )}
      </div>

      { children }
    </div>
  </section>
)

export default SectionWrapper