import { createReferralCode, getUserReferralStats, getUserByClerkId } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authObject = await auth();
    const { userId } = authObject;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserByClerkId(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const stats = await getUserReferralStats(user.id);
    
    if (!stats) {
      // Create a new referral code if user doesn't have one
      const newCode = await createReferralCode(user.id);
      return NextResponse.json({
        success: true,
        code: newCode,
        usesLeft: 100,
        totalUses: 0,
        claims: []
      });
    }

    return NextResponse.json({
      success: true,
      ...stats
    });
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authObject = await auth();
    const { userId } = authObject;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserByClerkId(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const code = await createReferralCode(user.id);
    
    return NextResponse.json({
      success: true,
      code: code
    });
  } catch (error) {
    console.error("Error creating referral code:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
