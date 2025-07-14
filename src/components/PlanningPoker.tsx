import React, { useState, useRef, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Copy, Home, Play, Clock } from 'lucide-react'
import { cn } from '../lib/utils'
import { useMultiplayer } from '../hooks/useMultiplayer'

const PlanningPoker: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { isHost } = location.state || {}

  const [copied, setCopied] = useState(false)
  const [gridLayout, setGridLayout] = useState({ cols: 3, rows: 2 })
  const gridRef = useRef<HTMLDivElement>(null)

  const fibonacciSequence = [1, 2, 3, 5, 8, '?']
  const emojiOptions = ['🎯', '⭐', '💎', '🔥', '💖', '🎉', '🚀', '🌈', '🍕', '🎨']

  const {
    roomState,
    isConnected,
    startTimer,
    placeSticker,
    userCount
  } = useMultiplayer(roomId || '', isHost || false)

  // Update grid layout based on current breakpoint
  useEffect(() => {
    // Always use 3 columns and 2 rows for consistent layout - force update
    setGridLayout({ cols: 3, rows: 2 })
  }, [])

  const copyRoomId = async () => {
    if (roomId) {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getRandomEmoji = () => {
    return emojiOptions[Math.floor(Math.random() * emojiOptions.length)]
  }

  const handlePlaceSticker = (event: React.MouseEvent<HTMLDivElement>) => {
    if (roomState.isTimerRunning && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      // Calculate which grid cell was clicked
      const gridWidth = rect.width
      const gridHeight = rect.height
      const cellWidth = gridWidth / gridLayout.cols
      const cellHeight = gridHeight / gridLayout.rows
      
      const colIndex = Math.floor(x / cellWidth)
      const rowIndex = Math.floor(y / cellHeight)
      
      // Ensure we're within bounds
      if (colIndex >= 0 && colIndex < gridLayout.cols && rowIndex >= 0 && rowIndex < gridLayout.rows) {
        // Calculate position within the specific cell
        const cellX = x - (colIndex * cellWidth)
        const cellY = y - (rowIndex * cellHeight)
        
        // Store as percentage within the cell
        const relativeX = cellX / cellWidth
        const relativeY = cellY / cellHeight
        
        placeSticker({ 
          cellIndex: rowIndex * gridLayout.cols + colIndex,
          relativeX: relativeX,
          relativeY: relativeY
        }, getRandomEmoji())
      }
    }
  }

  const getStickerStyle = (sticker: any) => {
    const colIndex = sticker.position.cellIndex % gridLayout.cols
    const rowIndex = Math.floor(sticker.position.cellIndex / gridLayout.cols)
    
    // Calculate the position within the grid
    const cellWidth = 100 / gridLayout.cols
    const cellHeight = 100 / gridLayout.rows
    
    // Position sticker relative to its grid cell
    const cellLeft = colIndex * cellWidth
    const cellTop = rowIndex * cellHeight
    
    // Add the relative position within the cell
    const left = cellLeft + (sticker.position.relativeX * cellWidth)
    const top = cellTop + (sticker.position.relativeY * cellHeight)
    
    return {
      left: `${left}%`,
      top: `${top}%`,
      transform: 'translate(-50%, -50%)',
      position: 'absolute' as const,
      zIndex: 10
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sticker Grid</h1>
          <div className="flex items-center mt-2">
            <span className="text-gray-600 mr-2">Room:</span>
            <span className="font-mono text-gray-800 mr-2">{roomId}</span>
            <button
              onClick={copyRoomId}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy room code"
            >
              {copied ? (
                <div className="text-green-600 text-sm font-medium">Copied!</div>
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-gray-600 mr-2">Users in room:</span>
            <span className="font-mono text-gray-800 mr-2">{userCount}</span>
          </div>
          <div className="flex items-center mt-2">
            <div className={cn(
              "w-2 h-2 rounded-full mr-2",
              isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-sm text-gray-600">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </button>
        </div>
      </div>

      {/* Timer Display */}
      {roomState.isTimerRunning && (
        <div className="card p-6 mb-6 bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 mr-2 text-yellow-600" />
              <span className="text-lg font-semibold text-yellow-800">
                Time Left: {roomState.timeLeft} seconds
              </span>
            </div>
            <p className="text-yellow-700">
              {roomState.stickers.length > 0 
                ? "Click anywhere to change your sticker! 🎲" 
                : "Click anywhere on the grid to place a random sticker! 🎲"
              }
            </p>
          </div>
        </div>
      )}

      {/* Sticker Grid */}
      <div className="card p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Sticker Grid</h2>
          <div style={{ minWidth: 160, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {roomState.isTimerRunning ? (
              <div className="btn-primary flex items-center justify-center" style={{ width: 160, height: 44, fontSize: '1.25rem', fontWeight: 600, backgroundColor: '#FEF3C7', color: '#B45309', border: '2px solid #FDE68A', borderRadius: '0.5rem' }}>
                <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                {roomState.timeLeft} seconds
              </div>
            ) : (
              <button
                onClick={startTimer}
                className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ width: 160, height: 44 }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Timer
              </button>
            )}
          </div>
        </div>
        
        <div 
          className="grid grid-cols-3 gap-3 relative bg-gray-50 p-4 rounded-lg cursor-default"
          onClick={handlePlaceSticker}
          style={{ cursor: roomState.isTimerRunning ? 'crosshair' : 'default' }}
          ref={gridRef}
        >
          {fibonacciSequence.map((value, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg border-2 border-gray-300 bg-white flex items-center justify-center font-bold text-lg text-gray-500 cursor-default"
            >
              {value}
            </div>
          ))}
          
          {/* Sticker Overlays */}
          {roomState.stickers.map((sticker) => {
            const style = getStickerStyle(sticker)
            return (
              <div
                key={sticker.id}
                className="text-3xl pointer-events-none animate-bounce"
                style={style}
              >
                {sticker.emoji}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PlanningPoker 