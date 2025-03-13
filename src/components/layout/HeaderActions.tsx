import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Settings, Icon } from 'lucide-react';
import { chest } from '@lucide/lab';

interface ActionButtonProps {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  className?: string;
  disabled?: boolean;
}

export function ActionButton({
  icon,
  label,
  onClick,
  variant = 'default',
  className = '',
  disabled = false,
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={className}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </Button>
  );
}

interface HeaderActionsProps {
  showSettings?: boolean;
  showToybox?: boolean;
  showLibrary?: boolean;
  customActions?: ReactNode;
  className?: string;
}

export function HeaderActions({
  showSettings = true,
  showToybox = false,
  showLibrary = false,
  customActions,
  className = '',
}: HeaderActionsProps) {
  const router = useRouter();

  return (
    <div className={`flex flex-row gap-2 ${className}`}>
      {customActions}
      
      {showLibrary && (
        <ActionButton
          icon={<Icon iconNode={chest} className="size-5" />}
          label="Library"
          onClick={() => router.push('/stories')}
          variant="outline"
        />
      )}
      
      {showToybox && (
        <ActionButton
          icon={<Icon iconNode={chest} className="size-5" />}
          label="Back to Toybox"
          onClick={() => router.push('/toys')}
          variant="outline"
          className="ml-auto"
        />
      )}
      
      {showSettings && (
        <Button
          onClick={() => router.push('/settings')}
          variant="ghost"
          size="icon"
          title="Settings"
        >
          <Settings className="size-4 text-gray-900 hover:border" />
        </Button>
      )}
    </div>
  );
} 