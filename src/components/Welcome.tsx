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

      <div className="card p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-900 mb-3 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Create New Room
            </h3>
            <button
              onClick={createRoom}
              className="w-full btn-primary font-normal"
            >
              <span className="flex items-center justify-center">
                <Play className="w-4 h-4 mr-2" />
                Create Room
              </span>
            </button>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default Welcome 