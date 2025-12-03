import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface ProfilePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  options: string[];
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

  // 다이얼로그가 열릴 때 현재 선택된 값으로 초기화
  useEffect(() => {
    if (open) {
      setPickerValue({
        option: selectedValue || options[0] || "",
      });
    }
  }, [open, selectedValue, options]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-red-500">
            {title}
          </DialogTitle>
          <p className="text-center text-sm text-gray-600 mt-2">
            선택지에 결혼에 필요한 이성의 프로필이 등록되면 알림을 받으실 수
            있습니다!
          </p>
        </DialogHeader>

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

        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-black"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-gray-700 hover:bg-gray-800 text-white"
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
