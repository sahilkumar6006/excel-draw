"use client";

import { BACKEND_URL } from "../../config";

async function fetchRoom(slug: string) {
  const response = await fetch(`${BACKEND_URL}/api/v1/rooms/${slug}`);
  const data = await response.json();
  return data;
}
  

export default function Room({ params }: { params: { slug: string } }) {
  const room = fetchRoom(params.slug);
  return <div>Room {room}</div>;
}