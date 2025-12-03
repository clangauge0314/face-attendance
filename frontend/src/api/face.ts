import apiClient from './client'

export interface FaceRegisterRequest {
  image: string
}

export interface FaceEmbeddingResponse {
  id: number
  userId: number
  imagePath: string | null
  createdAt: string
}

export interface FaceDetectRequest {
  image: string
}

export interface FaceDetectResponse {
  detected: boolean
  x?: number
  y?: number
  w?: number
  h?: number
}

export const registerFaceBase64 = async (data: FaceRegisterRequest): Promise<FaceEmbeddingResponse> => {
  const response = await apiClient.post<FaceEmbeddingResponse>('/face/register-base64', data)
  return response.data
}

export const getFaceEmbeddings = async (): Promise<FaceEmbeddingResponse[]> => {
  const response = await apiClient.get<FaceEmbeddingResponse[]>('/face/embeddings')
  return response.data
}

export const detectFace = async (data: FaceDetectRequest): Promise<FaceDetectResponse> => {
  const response = await apiClient.post<FaceDetectResponse>('/face/detect', data)
  return response.data
}

export const detectFacePublic = async (data: FaceDetectRequest): Promise<FaceDetectResponse> => {
  const response = await apiClient.post<FaceDetectResponse>('/face/detect/public', data)
  return response.data
}

export interface FaceVerifyPreviewRequest {
  image: string
}

export interface FaceVerifyPreviewResponse {
  detected: boolean
  similarity: number
  verified: boolean
}

export const verifyFacePreview = async (
  data: FaceVerifyPreviewRequest,
): Promise<FaceVerifyPreviewResponse> => {
  const response = await apiClient.post<FaceVerifyPreviewResponse>('/face/verify-preview', data)
  return response.data
}
