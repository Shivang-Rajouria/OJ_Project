import { useNavigate } from 'react-router-dom'
import problems from '../data/problems'
import '../styles/Home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <h1>Problem List</h1>
      <ul className="problem-list">
        {problems.map((problem) => (
          <li
            key={problem.id}
            className="problem-item"
            onClick={() => navigate(`/problem/${problem.id}`)}
          >
            <h3>{problem.title}</h3>
            <p>{problem.description.slice(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
