import { useParams } from 'react-router-dom'
import { useState } from 'react'
import problems from '../data/problems'
import '../styles/CodeEditor.css'

export default function CodeEditor() {
  const { id } = useParams()
  const problem = problems.find((p) => p.id.toString() === id)

  const [code, setCode] = useState('// Write your code here...')

  if (!problem) return <h2>Problem not found</h2>

  return (
    <div className="editor-container">
      <div className="problem-pane">
        <h2>{problem.title}</h2>
        <p>{problem.description}</p>
      </div>
      <div className="editor-pane">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-area"
        />
        <button className="submit-btn">Submit</button>
      </div>
    </div>
  )
}
