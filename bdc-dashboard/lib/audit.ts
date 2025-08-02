import { prisma } from "@/lib/prisma"

interface AuditLogData {
  userId?: string
  action: string
  resource?: string
  details?: any
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    })
  } catch (error) {
    console.error("Failed to create audit log:", error)
    // Don't throw error to avoid breaking the main flow
  }
}