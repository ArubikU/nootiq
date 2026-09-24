import { deleteRoom, updateRoomCount } from '@/lib/db';
import { createApiError, createSuccessResponse, handleApiError } from "@/lib/api-errors"
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const AuthObject = await auth();
        const { userId } = AuthObject;
        const para = await params
        
        if (!userId) {
            return createApiError('UNAUTHORIZED')
        }

        const roomId = para.id;

        await deleteRoom(roomId);
        await updateRoomCount(AuthObject);
        
        return createSuccessResponse({ roomId }, `Room ${roomId} eliminado exitosamente`)
    } catch (error) {
        return handleApiError(error)
    }
}