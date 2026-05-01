import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  PRIVACY_POLICY,
  TERMS_OF_SERVICE,
} from "@/features/auth/constants/agreementContent";

interface AgreementItemProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  content: string;
  disabled?: boolean;
}

function AgreementItem({
  label,
  checked,
  onCheckedChange,
  content,
  disabled,
}: AgreementItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-1">
      <div className="flex items-center justify-between py-3">
        <button
          type="button"
          onClick={() => onCheckedChange(!checked)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          disabled={disabled}
        >
          <Check
            className={cn(
              "h-5 w-5 shrink-0",
              checked ? "text-purple-500" : "text-gray-300",
            )}
            strokeWidth={3}
            aria-hidden
          />
          <span className="text-sm font-normal text-gray-900">{label}</span>
        </button>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            setOpen(o => !o);
          }}
          className="ml-2 shrink-0 text-xs text-gray-400 underline hover:text-gray-600"
          disabled={disabled}
        >
          {open ? "접기" : "더보기"}
        </button>
      </div>
      {open && (
        <div
          className={cn(
            "mb-3 ml-8 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 px-3 py-3",
            "text-xs leading-relaxed text-gray-700 whitespace-pre-line",
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export interface AgreementSectionProps {
  termsAgreed: boolean;
  privacyAgreed: boolean;
  onTermsChange: (value: boolean) => void;
  onPrivacyChange: (value: boolean) => void;
  disabled?: boolean;
}

export function AgreementSection({
  termsAgreed,
  privacyAgreed,
  onTermsChange,
  onPrivacyChange,
  disabled,
}: AgreementSectionProps) {
  const allChecked = termsAgreed && privacyAgreed;

  const handleAllChange = (next: boolean) => {
    onTermsChange(next);
    onPrivacyChange(next);
  };

  return (
    <div className="space-y-4 border-t border-gray-200 pt-4">
      <button
        type="button"
        onClick={() => handleAllChange(!allChecked)}
        disabled={disabled}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors",
          allChecked
            ? "bg-purple-500 text-white"
            : "bg-purple-50 text-purple-500",
        )}
      >
        <Check
          className={cn(
            "h-5 w-5",
            allChecked ? "text-white" : "text-purple-500",
          )}
          strokeWidth={3}
          aria-hidden
        />
        전체 약관동의
      </button>

      <div>
        <AgreementItem
          label="(필수) 이용약관 동의"
          checked={termsAgreed}
          onCheckedChange={onTermsChange}
          content={TERMS_OF_SERVICE}
          disabled={disabled}
        />
        <AgreementItem
          label="(필수) 개인정보 처리방침 동의"
          checked={privacyAgreed}
          onCheckedChange={onPrivacyChange}
          content={PRIVACY_POLICY}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
