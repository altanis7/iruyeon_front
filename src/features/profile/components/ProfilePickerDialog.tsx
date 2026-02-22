import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetFooter,
} from "@/shared/components/ui/bottom-sheet";
import { Button } from "@/shared/components/ui/button";

interface ProfilePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  options: readonly string[];
  selectedValue: string;
  onConfirm: (value: string) => void;
}

export function ProfilePickerDialog({
  open,
  onOpenChange,
  title,
  options,
  selectedValue,
  onConfirm,
}: ProfilePickerDialogProps) {
  const [pickerValue, setPickerValue] = useState<{ option: string }>({
    option: selectedValue || options[0] || "",
  });

  // 바텀시트가 열릴 때 현재 선택된 값으로 초기화
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) {
      setPickerValue({
        option: selectedValue || options[0] || "",
      });
    }
  }, [open, selectedValue]);

  // 확인
  const handleConfirm = () => {
    onConfirm(pickerValue.option);
    onOpenChange(false);
  };

  // 취소
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle className="text-center text-lg font-semibold text-red-500">
            {title}
          </BottomSheetTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            선택지에 결혼에 필요한 이성의 프로필이 등록되면 알림을 받으실 수
            있습니다!
          </p>
        </BottomSheetHeader>

        {/* Picker */}
        <div className="py-4">
          <Picker
            value={pickerValue}
            onChange={setPickerValue}
            wheelMode="natural"
          >
            <Picker.Column name="option">
              {options.map(option => (
                <Picker.Item key={option} value={option}>
                  {({ selected }) => (
                    <div
                      className={
                        selected
                          ? `font-semibold text-black-500`
                          : "text-neutral-400"
                      }
                    >
                      {option}
                    </div>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
          </Picker>
        </div>

        <BottomSheetFooter className="flex flex-col gap-2 pt-2">
          <Button
            type="button"
            onClick={handleConfirm}
            className="w-full h-12 rounded-full text-base font-semibold bg-pink-500 hover:bg-pink-600 text-white"
          >
            확인
          </Button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full h-10 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            취소
          </button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
}
