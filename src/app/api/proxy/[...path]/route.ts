import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'https://symponhy-backend-production.up.railway.app'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'PUT')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'PATCH')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, 'DELETE')
}

async function handleRequest(
  request: NextRequest,
  paramsPromise: Promise<{ path: string[] }>,
  method: string
) {
  try {
    // Obter autenticação do Clerk (incluindo Organization)
    const { userId, orgId, orgRole, getToken } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Obter token JWT do Clerk para enviar ao backend
    const token = await getToken()

    // Construir URL do backend
    const { path } = await paramsPromise
    const backendPath = path.join('/')
    const url = new URL(`/api/${backendPath}`, BACKEND_URL)

    // Copiar query params
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value)
    })

    // Preparar headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Adicionar dados do Clerk para o backend
    headers['X-Clerk-User-Id'] = userId

    // Adicionar Organization se existir
    if (orgId) {
      headers['X-Clerk-Org-Id'] = orgId
    }
    if (orgRole) {
      headers['X-Clerk-Org-Role'] = orgRole
    }

    // Preparar body para métodos que suportam
    let body: string | undefined
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        body = await request.text()
      } catch {
        // Request sem body
      }
    }

    // Fazer requisição ao backend
    const response = await fetch(url.toString(), {
      method,
      headers,
      body,
    })

    // Retornar resposta
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
