import { Photo } from "./Photo"

export interface Member {
    id: number
    userName: string
    photoUrl: string
    age: number
    dateOfBirth: string
    knownAs: string
    gender: string
    created: string
    lastActive: string
    introduction: string
    interests: string
    lookingFor: string
    city: string
    country: string
    photos: Photo[]
  }
  

  