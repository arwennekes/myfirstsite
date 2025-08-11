import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'

const Welcome: React.FC = () => {
  const navigate = useNavigate()

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    navigate(`/room/${newRoomId}`, { 
      state: { 
        isHost: true 
      } 
    })
  }

  return (
    <div className="max-w-md mx-auto font-normal">
      <div className="text-left mb-8">
        <h1 className="text-gray-900 mb-2">Annabel's planning poker</h1>
        <p className="text-gray-600">Effortless remote ticket estimating</p>
      </div>

      <div className="mt-6">
        <button
          onClick={createRoom}
          className="btn-primary font-normal"
        >
          <span className="flex items-center justify-center">
            <Play className="w-4 h-4 mr-2" />
            Create room
          </span>
        </button>
      </div>

      
    </div>
  )
}

export default Welcome 