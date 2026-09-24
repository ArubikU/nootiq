import { claimReferralCode } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

    const { referralCode } = await request.json();

    if (!referralCode || !referralCode.trim()) {
      return NextResponse.json(
        { success: false, error: "Referral code is required" },
        { status: 400 }
      );
    }

    const result = await claimReferralCode(referralCode.trim(), userId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Referral code claimed successfully",
        referrerId: result.referrerId,
        planId: result.planId,
        duration: result.duration
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error claiming referral code:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
