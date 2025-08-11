import React, { useState, useRef, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Copy, Play, Clock, ChevronLeft } from 'lucide-react'
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
    userCount,
    roomError
  } = useMultiplayer(roomId || '', isHost || false)

  // Update grid layout based on current breakpoint
  useEffect(() => {
    // Always use 3 columns and 2 rows for consistent layout - force update
    setGridLayout({ cols: 3, rows: 2 })
  }, [])

  const copyRoomId = async () => {
    if (roomId) {
      await navigator.clipboard.writeText(window.location.href)
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
      <div className="flex flex-row justify-between items-stretch mb-6 gap-2">
        <div className="flex flex-col gap-2 justify-start">
          <button
            onClick={() => navigate('/')}
            className="flex items-center w-max px-0 py-0 bg-transparent text-black font-normal text-base hover:underline transition-colors shadow-none border-none"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <div>
            <div className="flex flex-wrap items-center mt-2 gap-2">
              <span className="text-gray-600">Room:</span>
              <span className="font-mono text-gray-800">{roomId}</span>
              <button
                onClick={copyRoomId}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy room link"
              >
                {copied ? (
                  <div className="text-green-600 text-sm font-medium">Copied!</div>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <span className="text-gray-600 ml-4">Users:</span>
              <span className="font-mono text-gray-800">{userCount}</span>
              <div className="flex items-center ml-4">
                <div className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )} />
                <span className="text-gray-600">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
            <h1 className="text-gray-900 flex items-center gap-2 mt-2">
              {isHost ? (
               <span className="ml-0 text-gray-700">You're the host!</span>
              ) : (
               <span className="ml-0 text-gray-700">You're a participant, wait for the host to make a move!</span>
              )}
            </h1>
          </div>
        </div>
        <div className="flex flex-col justify-end" style={{ minWidth: 160 }}>
          <div style={{ minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {roomState.isTimerRunning ? (
              <div className="btn-primary flex items-center justify-center text-base font-normal" style={{ width: 160, height: 44, backgroundColor: '#FEF3C7', color: '#B45309', border: '2px solid #FDE68A', borderRadius: '0.5rem' }}>
                <Clock className="w-5 h-5 mr-2 text-yellow-600" />
                {roomState.timeLeft} seconds
              </div>
            ) : (
              <div className="relative group" style={{ width: 160, height: 44 }}>
                <button
                  onClick={startTimer}
                  disabled={!isHost}
                  className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full h-full"
                  style={{ width: 160, height: 44 }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Timer
                </button>
                {!isHost && (
                   <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 hidden group-hover:block bg-gray-800 text-white rounded px-3 py-2 whitespace-nowrap shadow-lg" style={{ minWidth: 180 }}>
                    Only the host can start the timer
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticker Grid */}
      {roomError ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
           <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded mb-4 text-center font-semibold">
            {roomError}
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary mt-2"
          >
            Go Home
          </button>
        </div>
      ) : (
        <>
          <div 
            className="grid grid-cols-3 gap-3 relative cursor-default"
            onClick={handlePlaceSticker}
            style={{ cursor: roomState.isTimerRunning ? 'crosshair' : 'default' }}
            ref={gridRef}
          >
            {fibonacciSequence.map((value, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg border-2 border-gray-300 bg-white flex items-center justify-center font-bold text-gray-500 cursor-default"
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
                  className="pointer-events-none animate-bounce"
                  style={style}
                >
                  {sticker.emoji}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default PlanningPoker 