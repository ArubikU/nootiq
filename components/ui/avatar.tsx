import * as AvatarPrimitive from '@radix-ui/react-avatar';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
}

export const Avatar = ({ src, alt, fallback }: AvatarProps) => {
  return (
    <AvatarPrimitive.Root className="relative inline-flex h-10 w-10 rounded-full">
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
      />
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-bg text-text text-sm font-medium">
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};