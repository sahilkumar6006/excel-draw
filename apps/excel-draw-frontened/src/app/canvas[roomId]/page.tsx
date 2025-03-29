import Canvas from '@/components/canvas'
import React from 'react'

export async function CanvasPage({params}: {params: {roomId: string}}) {
  const roomId = params.roomId
  return (
    <Canvas roomId={roomId} />
  )
}

export default CanvasPage