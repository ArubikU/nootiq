
"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProtectedByClerkFooter() {
    return (
        <footer className="flex items-center justify-center py-6  font-sans">
            <span className="text-sm font-medium text-secondary mr-3 tracking-wide">
                Protected by
            </span>
            <Link
                href="https://clerk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center transition-transform duration-200 ease-in-out hover:scale-105"
            >
                <Image
                    src="https://ph-files.imgix.net/297bc3d4-bd2e-4eaa-8fb6-a289cf61ea91.png?auto=format"
                    alt="Clerk"
                    width={32}
                    height={32}
                    className="rounded-lg mr-2 "
                />
                <span className="text-base font-bold text-primary tracking-wide">
                    Clerk
                </span>
            </Link>
        </footer>
    );
}
