import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PlanningPoker from './components/PlanningPoker'
import Welcome from './components/Welcome'
import { cn } from './lib/utils'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/room/:roomId" element={<PlanningPoker />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App 