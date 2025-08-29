import React from 'react'
import { FluidOrb } from './FluidOrb'

interface DualVoiceVisualizerProps {
  aiAudioElement?: HTMLAudioElement | null
  userMicStream?: MediaStream | null
  isAIActive?: boolean
  isUserActive?: boolean
  className?: string
}

export function DualVoiceVisualizer({
  aiAudioElement = null,
  userMicStream = null,
  isAIActive = false,
  isUserActive = false,
  className = ""
}: DualVoiceVisualizerProps) {
  console.log('DualVoiceVisualizer - userMicStream:', userMicStream ? 'ATIVO' : 'NULL')
  console.log('DualVoiceVisualizer - aiAudioElement:', aiAudioElement ? 'ATIVO' : 'NULL')
  
  return (
    <div className={`flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 ${className}`}>
      {/* AI Visualizer */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <FluidOrb
            audioElement={aiAudioElement}
            color="blue"
            className="w-full h-full"
          />
          {/* Activity indicator */}
          {isAIActive && (
            <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-blue-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-ping" />
            </div>
          )}
          {/* Luminous border */}
          <div className={`absolute inset-0 rounded-full border-2 transition-colors duration-300 ${
            isAIActive ? 'border-blue-400/50 shadow-lg shadow-blue-400/25' : 'border-blue-600/20'
          }`} />
        </div>
        <div className="text-center">
          <p className="text-xs md:text-sm font-medium text-blue-400">IA Synapse</p>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mt-2 opacity-60" />
          {isAIActive && (
            <p className="text-xs text-blue-300 mt-1 animate-pulse">Falando...</p>
          )}
        </div>
      </div>

      {/* Central connection line */}
      <div className="flex md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4 rotate-90 md:rotate-0">
        <div className="flex items-center">
          <div className="w-8 md:w-16 h-px bg-gradient-to-r from-blue-400/30 via-purple-400/50 to-green-400/30" />
          <div className="relative">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-400/50 rounded-full mx-2 md:mx-3 animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 md:w-4 md:h-4 bg-purple-400/30 rounded-full animate-ping" />
          </div>
          <div className="w-8 md:w-16 h-px bg-gradient-to-r from-purple-400/30 via-purple-400/50 to-green-400/30" />
        </div>
        <div className="text-center">
          <p className="text-xs text-purple-400 opacity-60 whitespace-nowrap">Conexão Ativa</p>
        </div>
      </div>

      {/* User Visualizer */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <FluidOrb
            mediaStream={userMicStream}
            color="green"
            className="w-full h-full"
          />
          {/* Activity indicator */}
          {isUserActive && (
            <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-green-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-ping" />
            </div>
          )}
          {/* Luminous border */}
          <div className={`absolute inset-0 rounded-full border-2 transition-colors duration-300 ${
            isUserActive ? 'border-green-400/50 shadow-lg shadow-green-400/25' : 'border-green-600/20'
          }`} />
        </div>
        <div className="text-center">
          <p className="text-xs md:text-sm font-medium text-green-400">Você</p>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full mt-2 opacity-60" />
          {isUserActive && (
            <p className="text-xs text-green-300 mt-1 animate-pulse">Falando...</p>
          )}
        </div>
      </div>
    </div>
  )
}