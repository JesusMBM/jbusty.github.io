import styles from './Skills.module.css'

const categories = [
  {
    name: 'Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'HTML / CSS'],
  },
  {
    name: 'Frameworks & Libraries',
    items: ['React', 'Node.js', 'Express', 'Next.js'],
  },
  {
    name: 'Tools & Platforms',
    items: ['Git', 'Docker', 'Linux', 'GitHub Actions'],
  },
  {
    name: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQLite'],
  },
]

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <p className="section-eyebrow">Stack</p>
        <h2 className="section-heading">Technologies I work with</h2>
        <div className={styles.grid}>
          {categories.map((cat) => (
            <div key={cat.name} className={styles.category}>
              <h3 className={styles.catName}>{cat.name}</h3>
              <ul className={styles.list}>
                {cat.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <span className={styles.bullet} aria-hidden="true">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
