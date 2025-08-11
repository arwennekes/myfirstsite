import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Play } from 'lucide-react'

const Welcome: React.FC = () => {
  const [roomId, setRoomId] = useState('')
  const navigate = useNavigate()

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomId(id)
  }

  const joinRoom = () => {
    if (roomId) {
      navigate(`/room/${roomId}`, { 
        state: { 
          isHost: false 
        } 
      })
    }
  }

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    navigate(`/room/${newRoomId}`, { 
      state: { 
        isHost: true 
      } 
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Annabel's planning poker</h1>
        <p className="text-gray-600">Effortless remote ticket estimating</p>
      </div>

      <div className="card p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Create New Room
            </h3>
            <button
              onClick={createRoom}
              className="w-full btn-primary"
            >
              Create Room
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Join Existing Room
            </h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="Room ID"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={joinRoom}
                disabled={!roomId}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default Welcome 